#authentication/models.py

import datetime
import jwt

from Backend.src import app, db, bcrypt


class User(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pseudo = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    search_queries = db.relationship('Search_query', backref='user')
    folders = db.relationship('Folder', backref='user')

    def __init__(self, email, pseudo, password):
        self.email = email
        self.pseudo = pseudo
        self.registered_on = datetime.datetime.now()
        self.password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')).decode()

    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp':
                datetime.datetime.utcnow() + datetime.timedelta(
                    days=0, hours=4),
                'iat':
                datetime.datetime.utcnow(),
                'sub':
                user_id
            }
            return jwt.encode(
                payload, app.config.get('SECRET_KEY'), algorithm='HS256')
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Validates the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted_token:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


class BlacklistToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_token'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False


class Search_query(db.Model):
    """
    Token Model for storing user's history
    """
    __tablename__ = 'search_query'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    query_date = db.Column(db.DateTime, nullable=False)
    tsv = db.Column(db.Text, nullable=False)
    model = db.Column(db.String(500), nullable=False)
    results = db.Column(db.Text, nullable=False)

    def __init__(self, user_id, tsv, model, results):
        self.user_id = user_id
        self.query_date = datetime.datetime.now()
        self.tsv = tsv
        self.model = model
        self.results = results


class Folder(db.Model):
    """
    Token Model for storing user's history
    """
    __tablename__ = 'folder'

    folder_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    tsvs = db.relationship('Tsv', backref='folder')

    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name


class Tsv(db.Model):
    """
    Token Model for storing user's history
    """
    __tablename__ = 'tsv'

    tsv_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    folder_id = db.Column(
        db.Integer, db.ForeignKey('folder.folder_id'), nullable=False)
    name = db.Column(db.Text, nullable=False)

    def __init__(self, folder_id, name):
        self.folder_id = folder_id
        self.name = name
