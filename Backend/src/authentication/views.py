# authentication/auth/views.py

from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView

from Backend.src import app, bcrypt, db
from Backend.src.models import User, BlacklistToken, Search_query

auth_blueprint = Blueprint('auth', __name__)

#TOOLS


def _getUser(self):
    # get the auth token
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
        except IndexError:
            responseObject = {
                'status': 'fail',
                'message': 'Bearer token malformed.'
            }
            return responseObject, 401
    else:
        auth_token = ''
    if auth_token:
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            try:
                # fetch the user data
                user = User.query.filter_by(id=resp).first()
                return user, 200
            except Exception as e:
                responseObject = {
                    'status': 'fail',
                    'message': 'User does not exist'
                }
                return make_response(jsonify(responseObject)), 404
        else:
            responseObject = {'status': 'fail', 'message': resp}
            return responseObject, 401
    else:
        responseObject = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        return responseObject, 401


def _checkPassword(self):
    # get the auth token and the post data
    auth_header = request.headers.get('Authorization')
    post_data = request.get_json()

    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
        except IndexError:
            responseObject = {
                'status': 'fail',
                'message': 'Bearer token malformed.'
            }
            return responseObject, 401
    else:
        auth_token = ''

    if auth_token:
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            try:
                # fetch the user data
                user = User.query.filter_by(id=resp).first()
                if user and bcrypt.check_password_hash(
                        user.password, post_data.get('password')):
                    print('password ok')
                    responseObject = {
                        'status': 'success',
                        'message': 'password correct.',
                    }
                    return responseObject, 200
                else:
                    responseObject = {
                        'status': 'fail',
                        'message': 'Wrong password'
                    }
                    return responseObject, 404
            except Exception as e:
                print(e)
                responseObject = {'status': 'fail', 'message': 'Try again'}
                return responseObject, 500
        responseObject = {'status': 'fail', 'message': resp}
        return responseObject, 401
    else:
        responseObject = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        return responseObject, 401


class RegisterAPI(MethodView):
    """
    User Registration Resource
    """

    def post(self):
        # get the post data
        post_data = request.get_json()
        # check if user already exists
        userMail = User.query.filter_by(email=post_data.get('email')).first()
        userPseudo = User.query.filter_by(
            pseudo=post_data.get('pseudo')).first()

        if not (userMail or userPseudo):
            try:
                user = User(
                    email=post_data.get('email'),
                    pseudo=post_data.get('pseudo'),
                    password=post_data.get('password'))
                # insert the user
                db.session.add(user)
                db.session.commit()
                # generate the auth token
                auth_token = user.encode_auth_token(user.id)
                responseObject = {
                    'status': 'success',
                    'message': 'Successfully registered.',
                    'auth_token': auth_token.decode()
                }
                return make_response(jsonify(responseObject)), 201
            except Exception as e:
                responseObject = {'status': 'fail', 'message': e.args}
                return make_response(jsonify(responseObject)), 500
        else:
            responseObject = {
                'status': 'fail',
                'message': 'User already exists. Please Log in.',
            }
            return make_response(jsonify(responseObject)), 500


class LoginAPI(MethodView):
    """
    User Login Resource
    """

    def post(self):
        # get the post data
        post_data = request.get_json()
        try:
            # fetch the user data
            user = User.query.filter_by(pseudo=post_data.get('pseudo')).first()
            if user and bcrypt.check_password_hash(user.password,
                                                   post_data.get('password')):
                print('user and password ok')
                auth_token = user.encode_auth_token(user.id)
                if auth_token:
                    responseObject = {
                        'status': 'success',
                        'message': 'Successfully logged in.',
                        'auth_token': auth_token.decode()
                    }
                    return make_response(jsonify(responseObject)), 200
            else:
                responseObject = {
                    'status': 'fail',
                    'message': 'User does not exist or wrong password'
                }
                return make_response(jsonify(responseObject)), 404
        except Exception as e:
            print(e)
            responseObject = {'status': 'fail', 'message': e.args}
            return make_response(jsonify(responseObject)), 500


class UserAPI(MethodView):
    """
    User Resource
    """

    def get(self):
        resp, returnCode = _getUser(self)
        if returnCode == 200:
            responseObject = {
                'status': 'success',
                'data': {
                    'user_id': resp.id,
                    'email': resp.email,
                    'pseudo': resp.pseudo,
                    'registered_on': resp.registered_on
                }
            }
            return make_response(jsonify(responseObject)), returnCode
        return make_response(jsonify(resp)), returnCode


class LogoutAPI(MethodView):
    """
    Logout Resource
    """

    def post(self):
        # get auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                # mark the token as blacklisted
                blacklist_token = BlacklistToken(token=auth_token)
                try:
                    # insert the token
                    db.session.add(blacklist_token)
                    db.session.commit()
                    responseObject = {
                        'status': 'success',
                        'message': 'Successfully logged out.'
                    }
                    return make_response(jsonify(responseObject)), 200
                except Exception as e:
                    responseObject = {'status': 'fail', 'message': e}
                    return make_response(jsonify(responseObject)), 200
            else:
                responseObject = {'status': 'fail', 'message': resp}
                return make_response(jsonify(responseObject)), 401
        else:
            responseObject = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(responseObject)), 401


class CheckPasswordAPI(MethodView):
    def post(self):
        responseObject, returnCode = _checkPassword(self)
        return make_response(jsonify(responseObject), returnCode)


class CheckTokenAPI(MethodView):
    def get(self):
        # get the auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[1]
            except IndexError:
                responseObject = {
                    'status': 'fail',
                    'message': 'Bearer token malformed.'
                }
                return make_response(jsonify(responseObject)), 401
        else:
            auth_token = ''
        if auth_token:
            resp = User.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                responseObject = {
                    'status': 'success',
                    'message': 'valid token.'
                }
                return make_response(jsonify(responseObject)), 200
            else:
                responseObject = {'status': 'fail', 'message': resp}
                return make_response(jsonify(responseObject)), 401
        else:
            responseObject = {
                'status': 'fail',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(responseObject)), 401


class DeleteAccountAPI(MethodView):
    def post(self):
        responseObjectUser, returnCodeUser = _getUser(self)
        responseObjectPassword, returnCodePassword = _checkPassword(self)
        if (returnCodePassword == 200):
            if (returnCodeUser == 200):
                # get auth token
                auth_header = request.headers.get('Authorization')
                auth_token = auth_header.split(" ")[1]

                # mark the token as blacklisted
                blacklist_token = BlacklistToken(token=auth_token)

                try:
                    # insert the token in blacklist
                    db.session.add(blacklist_token)
                    db.session.commit()
                    try:
                        # delete the user
                        db.session.delete(responseObjectUser)
                        db.session.commit()
                        responseObject = {
                            'status': 'success',
                            'message': 'User successfully deleted'
                        }
                        return make_response(jsonify(responseObject)), 200
                    except Exception as e:
                        responseObject = {'status': 'fail', 'message': e}
                        return make_response(jsonify(responseObject)), 200
                except Exception as e:
                    responseObject = {'status': 'fail', 'message': e}
                    return make_response(jsonify(responseObject)), 200
            else:
                return make_response(
                    jsonify(responseObjectUser)), returnCodeUser
        else:
            return make_response(
                jsonify(responseObjectPassword)), returnCodePassword


class AddSearchQueryAPI(MethodView):
    def post(self):
        post_data = request.get_json()
        responseObjectUser, returnCodeUser = _getUser(self)
        if returnCodeUser == 200:
            try:
                query = Search_query(
                    user_id=responseObjectUser.id,
                    tsv=post_data.get('tsv'),
                    model=post_data.get('model'),
                    results=post_data.get('results'))
                # insert the query
                db.session.add(query)
                db.session.commit()
                # generate the auth token
                responseObject = {
                    'status': 'success',
                    'message': 'Search query successfully saved'
                }
                return make_response(jsonify(responseObject)), 201
            except Exception as e:
                responseObject = {
                    'status': 'fail',
                    'message': 'Some error occurred. Please try again.'
                }
                return make_response(jsonify(responseObject)), 401

        else:
            return make_response(jsonify(responseObjectUser)), returnCodeUser


class SearchQueryAPI(MethodView):
    def get(self):
        get_data = request.get_json()
        responseObjectUser, returnCodeUser = _getUser(self)
        if returnCodeUser == 200:
            # get the user's queries
            try:
                queries = Search_query.query.filter_by(
                    user_id=responseObjectUser.id).all()
                data = []
                for query in queries:
                    temp = {
                        'query_id': query.id,
                        'query_date': query.query_date,
                        'tsv': query.tsv,
                        'model': query.model
                    }
                    data.append(temp)
                responseObject = {'status': 'success', 'data': data}
                return make_response(jsonify(responseObject)), 201
            except Exception as e:
                responseObject = {'status': 'fail', 'message': e.args}
                return make_response(jsonify(responseObject)), 500
        else:
            return make_response(jsonify(responseObjectUser)), returnCodeUser

    def post(self):
        post_data = request.get_json()
        responseObjectUser, returnCodeUser = _getUser(self)
        if returnCodeUser == 200:
            # get the user's queries
            try:
                query = Search_query.query.filter_by(
                    user_id=responseObjectUser.id,
                    id=post_data.get('query_id')).first()
                responseObject = {'status': 'success', 'data': query.results}
                return make_response(jsonify(responseObject)), 201
            except Exception as e:
                responseObject = {'status': 'fail', 'message': e.args}
                return make_response(jsonify(responseObject)), 500
        else:
            return make_response(jsonify(responseObjectUser)), returnCodeUser


class DeleteSearchQueryAPI(MethodView):
    def post(self):
        post_data = request.get_json()
        responseObjectUser, returnCodeUser = _getUser(self)
        if returnCodeUser == 200:
            # get the user's queries
            try:
                query = Search_query.query.filter_by(
                    user_id=responseObjectUser.id,
                    id=post_data.get('query_id')).first()
                try:
                    # delete the query
                    db.session.delete(query)
                    db.session.commit()
                    responseObject = {
                        'status': 'success',
                        'message': 'Query successfully deleted'
                    }
                    return make_response(jsonify(responseObject)), 200
                except Exception as e:
                    responseObject = {'status': 'fail', 'message': e.args}
                    return make_response(jsonify(responseObject)), 500
            except Exception as e:
                responseObject = {'status': 'fail', 'message': e.args}
                return make_response(jsonify(responseObject)), 500
        else:
            return make_response(jsonify(responseObjectUser)), returnCodeUser


class changeInfoAPI(MethodView):
    def post(self):
        # get the post data
        post_data = request.get_json()

        # check password
        responseObjectPassword, returnCodePassword = _checkPassword(self)
        if returnCodePassword == 200:
            # get current user if possible
            responseObjectUser, returnCodeUser = _getUser(self)
            if returnCodeUser == 200:
                new_pseudo = post_data.get('new_pseudo')
                new_email = post_data.get('new_email')
                if new_pseudo == '':
                    new_pseudo = responseObjectUser.pseudo
                if new_email == '':
                    new_email = responseObjectUser.email
                try:
                    # change user info
                    responseObjectUser.email = new_email
                    responseObjectUser.pseudo = new_pseudo
                    db.session.commit()
                    responseObject = {
                        'status': 'success',
                        'message': 'user info successfully modified'
                    }
                    return make_response(jsonify(responseObject)), 200
                except Exception as e:
                    responseObject = {'status': 'fail', 'message': e.args}
                    return make_response(jsonify(responseObject)), 500
            else:
                return make_response(
                    jsonify(responseObjectPassword)), returnCodePassword
        else:
            return make_response(
                jsonify(responseObjectPassword)), returnCodePassword


class changePasswordAPI(MethodView):
    def post(self):
        # get the post data
        post_data = request.get_json()

        # check password
        responseObjectPassword, returnCodePassword = _checkPassword(self)
        if returnCodePassword == 200:
            # get current user if possible
            responseObjectUser, returnCodeUser = _getUser(self)
            if returnCodeUser == 200:
                new_password = post_data.get('new_password')
                if new_password == '':
                    responseObject = {
                        'status': 'fail',
                        'message':
                        'empty password, please insert correct password'
                    }
                    return make_response(jsonify(responseObject)), 404
                try:
                    # change user info
                    responseObjectUser.password = bcrypt.generate_password_hash(new_password, app.config.get('BCRYPT_LOG_ROUNDS')).decode()
                    db.session.commit()
                    responseObject = {
                        'status': 'success',
                        'message': 'user password successfully modified'
                    }
                    return make_response(jsonify(responseObject)), 200
                except Exception as e:
                    responseObject = {'status': 'fail', 'message': e.args}
                    return make_response(jsonify(responseObject)), 500
            else:
                return make_response(
                    jsonify(responseObjectPassword)), returnCodePassword
        else:
            return make_response(
                jsonify(responseObjectPassword)), returnCodePassword


# define the API resources
registration_view = RegisterAPI.as_view('register_api')
login_view = LoginAPI.as_view('login_api')
user_view = UserAPI.as_view('user_api')
logout_view = LogoutAPI.as_view('logout_api')
checkPassword_view = CheckPasswordAPI.as_view('checkPassword_api')
deleteAccount_view = DeleteAccountAPI.as_view('deleteAccount_api')
checkToken_view = CheckTokenAPI.as_view('checkToken_api')
addSearchQuery_view = AddSearchQueryAPI.as_view('addSearchQuery_api')
searchQuery_view = SearchQueryAPI.as_view('searchQuery_api')
deleteSearchQuery_view = DeleteSearchQueryAPI.as_view('deleteSearchQuery_api')
changeInfo_view = changeInfoAPI.as_view('changeInfo_api')
changePassword_view = changePasswordAPI.as_view('changePassword_api')

# add Rules for API Endpoints
auth_blueprint.add_url_rule(
    '/auth/register', view_func=registration_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/login', view_func=login_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/logout', view_func=logout_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/checkpassword', view_func=checkPassword_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/deleteaccount', view_func=deleteAccount_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/status', view_func=user_view, methods=['GET'])
auth_blueprint.add_url_rule(
    '/auth/checktoken', view_func=checkToken_view, methods=['GET'])
auth_blueprint.add_url_rule(
    '/auth/addsearchquery', view_func=addSearchQuery_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/searchquery', view_func=searchQuery_view, methods=['GET', 'POST'])
auth_blueprint.add_url_rule(
    '/auth/deletesearchquery',
    view_func=deleteSearchQuery_view,
    methods=['POST'])
auth_blueprint.add_url_rule(
    '/account/changeinfo', view_func=changeInfo_view, methods=['POST'])
auth_blueprint.add_url_rule(
    '/account/changepassword', view_func=changePassword_view, methods=['POST'])
