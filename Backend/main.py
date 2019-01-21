from flask import Flask,request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/')
@app.route('/coucou/')
def index():
   return "hello to the flask app"

@app.route('/get', methods=['GET'])
def envoi():
    return "test de get" 