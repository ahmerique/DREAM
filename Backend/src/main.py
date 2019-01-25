from flask import Flask, render_template, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
##Fonction de vérification que le back est plutot bon
def result():
    return ("le back est plutôt bon")

@app.route('/test', methods=['GET'])
##Fonction test pour verifier que le front est bien relié a la BDD, renvoie les données de la table test1

def config():
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()


    sql2="select * from test1"
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records[1:len(records)]:
        hello+='\t'.join(row)+'\t'
    print(hello)
    cur.close()

    conn.close()

    return (hello)

@app.route('/test2', methods=['GET'])
##Fonction test pour verifier que le front est bien relié a la BDD, renvoie les données de la table test2
def config2():
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()


    sql2="select * from test2"
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records[1:len(records)]:
        hello+='\t'.join(row)+'\t'

    cur.close()

    conn.close()

    print(hello)
    return (hello)

@app.route('/learning', methods=['POST'])
#Route en cas de demande d'apprentissage, le POST contient un json recapitulant les differentes informations: {'name': 'Silico10', 'data': '{"0":"knockout"}', 'learning': 'RandomForest'}
# la fonction renvoie les données utilisées et stocke 
def learn():
    x=request.get_json(force=True)
    print(x)
    return (str(x))

@app.route('/prediction', methods=['POST'])
#Route en cas de prediction de knockdown/knockout -> x est un json a 2 parametre de type {pert1: "knockdown G2", pert2 : "knockout G7"}
#La fonction renvoie directement les données récupérées post-traitement (sous forme de 10 valeurs successives)
def predict():
    x=request.get_json(force=True)
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor()
    sql2="select * from test2"
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records[1:len(records)]:
        hello+='\t'.join(row)+'\t'
    cur.close()
    conn.close()
    
    print(x)
    return (hello)
