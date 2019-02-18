import os
import psycopg2
from . import FunctionML
from . import MLPRegressor
from . import XGBoost
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os
import ast
app = Flask(__name__)
CORS(app)

app_settings = os.getenv('APP_SETTINGS',
                         'Backend.src.config.DevelopmentConfig')
app.config.from_object(app_settings)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

from Backend.src.authentication.views import auth_blueprint
app.register_blueprint(auth_blueprint)


@app.route('/')
##Fonction de vérification que le back est plutot bon
def result():

    return ("le back est plutot bon")


@app.route('/test2', methods=['GET'])
##Fonction test pour verifier que le front est bien relié a la BDD, renvoie les données de la table test1
def config():
    hello = ""
    conn = psycopg2.connect(
        host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()

    sql2 = "select * from test1"
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records[1:len(records)]:
        hello += '\t'.join(row) + '\t'
    cur.close()

    conn.close()

    return (hello)


@app.route('/data', methods=['GET'])
def getData():
    data = []
    conn = psycopg2.connect(
        host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor()
    sql2 = "select folder_id,name from folder order by name"
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records:
        row = (str(row).split(','))
        id = int(row[0][1:])
        name = row[1][2:-2]
        data.append({"id": id, "name": name})
    for i in range(len(data)):
        sql = "select tsv.name from tsv where tsv.folder_id=" + str(i + 1) +" order by tsv.name"
        cur.execute(sql)
        records = cur.fetchall()
        if len(records) != 0:
            types = []
            for j in range(len(records)):
                type_name = str(records[j])[2:-3]
                types.append(type_name)
            data[i]["type"] = types
        else:
            data[i]["type"] = ['test' + str(i)]
    return (str(data))

def getDataId(data,id):
    for i in range(len(data)):
        if (data[i]['id']==id):
            return i
    return 0

@app.route('/wildtype', methods=['POST','GET'])
##Fonction de recuperation des etats stables
def wildtype():
    hello = ""
    datas = []
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor()
    headers=request.get_json(force=True)
    id=int(headers['id'])

    sql2 = "select name from folder where folder_id="+str(id)
    cur.execute(sql2)
    dossier= cur.fetchall()
    dossier=str(dossier)[3:-4]
    df_wildtype = pd.read_csv('Backend/data/' + dossier + '/' + dossier + '_wildtype.tsv', sep='\t')

    datas = (df_wildtype.values)
    for row in datas[0]:
        hello += ' ' + str(row)
    return (hello)


@app.route('/learning', methods=['POST'])
#Route en cas de demande d'apprentissage, le POST contient un json recapitulant les differentes informations: {'name': 'Silico10', 'data': '{"0":"knockout"}', 'learning': 'RandomForest'}
# la fonction renvoie les données utilisées et stocke
def learn():
    headers = request.get_json(force=True)
    datas = []
    for i in range(len(ast.literal_eval(headers['data']))):
        x = '\'' + str(0) + '\''

        files = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            ast.literal_eval(headers['data'])[str(i)] + '.tsv',
            sep='\t')
        datas.append(files.values)
    return (str(headers))

@app.route('/graph', methods=['POST'])
def graph():
    headers = request.get_json(force=True)
    if True:#Creer une condition pour choisir la methode
        df_knockouts = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'knockouts' + '.tsv',
            sep='\t')
        df_knockdowns = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'knockdowns' + '.tsv',
            sep='\t')
        df_wildtype = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'wildtype' + '.tsv',
            sep='\t')
        M=FunctionML.etudedict(df_knockouts,df_knockdowns,df_wildtype)
    retour=[]

    for i in range(len(M[0])):
        for j in range(len(M[0])):
            if abs(M[i][j])==1:
                retour.append({ 'source': i+1, 'target': j+1, 'type': 'unknown' })
    return (str(retour))

@app.route('/displayData', methods=['POST'])
def display():
    headers = request.get_json(force=True)
    dossier = headers['donnee']
    name = headers['type']
    if name != 'knockouts':
        displayData = []
        files = pd.read_csv(
            'Backend/data/' + dossier + '/' + dossier + '_' + name + '.tsv',
            sep='\t')
        data2 = files.values
        text = open('Backend/data/' + dossier + '/' + dossier + '_' + name + '.tsv',
                    'r+')

        content = text.read()
        text.close()
        datas = str(content)
        newdata = ''
        length = 10
        for j in range(0, len(datas)):
            if datas[j] == "\n":
                newdata += '\t'
            else:
                newdata += datas[j]
        records = newdata.split("\t")
        for i in range(length):
            displayData.append({"label": "G" + str(i + 1), "data": []})
        for i in range(len(data2)):
            for j in range(len(data2[i])):
                displayData[j]["data"].append(data2[i][j])

        return (str(displayData))
    else:
        displayData = []
        data = []
        files2 = pd.read_csv(
            'Backend/data/insilico_size10_1/insilico_size10_1_wildtype.tsv',
            sep='\t')
        data = (files2.values)
        files = pd.read_csv(
            'Backend/data/' + dossier + '/' + dossier + '_' + name + '.tsv',
            sep='\t')
        data2 = files.values
        text = open('Backend/data/' + dossier + '/' + dossier + '_' + name + '.tsv',
                    'r+')
        content = text.read()
        text.close()
        datas = str(content)
        newdata = ''
        length = 10
        for j in range(0, len(datas)):
            if datas[j] == "\n":
                newdata += '\t'
            else:
                newdata += datas[j]
        records = newdata.split("\t")
        for i in range(2 * length):
            displayData.append({"label": "G" + str(i + 1), "data": []})
        for i in range(len(data2)):
            for j in range(len(data2[i])):
                displayData[(j * 2)]["data"].append(data2[i][j])

        for i in range(len(data[0])):
            displayData[(i * 2) + 1]["data"].append(data[0][i])
        return (str(displayData))


@app.route('/displayTimeseries', methods=['POST'])
#Route créée pour afficher les timeseries sur le graphe.
def displayTimeseries():
    headers = request.get_json(force=True)
    dossier = headers['donnee']
    name = headers['type']
    displayData = []
    text = open('Backend/data/' + dossier + '/' + dossier + '_' + name + '.tsv',
                'r+')
    content = text.read()
    text.close()
    datas = str(content)
    newdata = ''
    length = 11
    for j in range(0, len(datas)):
        if datas[j] == "\n":
            newdata += '\t'
        else:
            newdata += datas[j]
    records = newdata.split("\t")
    for row in range(243):
        if row < length:
            displayData.append({"label": str(records[row])[1:-1], "data": []})
        elif row > length:
            displayData[(row - 1) % length]["data"].append(records[row])
    return (str(displayData))


@app.route('/score', methods=['POST'])
#Route créée pour afficher les timeseries sur le graphe.
def score():
    headers = request.get_json(force=True)
    matrice = headers['matrice']
    score=FunctionML.score(matrice)
    print(score)
    return (str(score))

@app.route('/model', methods=['POST'])
#Route créée pour afficher les timeseries sur le graphe.
def getModel():
    headers = request.get_json(force=True)
    if True:#Creer une condition pour choisir la methode
        df_knockouts = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'knockouts' + '.tsv',
            sep='\t')
        df_knockdowns = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'knockdowns' + '.tsv',
            sep='\t')
        df_wildtype = pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'wildtype' + '.tsv',
            sep='\t')
        df_gold=pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'goldstandard' + '.tsv',   sep='\t')
        M=FunctionML.etudedict(df_knockouts,df_knockdowns,df_wildtype)
    retour="["

    for i in range(len(M[0])):
        retour+="["
        for j in range(len(M[i])):
            retour+=str((int(abs(M[i][j]))))
            if j!=len(M[i])-1:
                retour+=','
        retour+="]"    
        if i!=len(M[0])-1:
            retour+=","
    retour+="]"
    x=FunctionML.getGold(df_gold,10)
    return (str(retour))


@app.route('/gold', methods=['POST'])
#Route créée pour afficher les timeseries sur le graphe.
def getGold():
    headers = request.get_json(force=True)
    if True:#Creer une condition pour choisir la methode

        df_gold=pd.read_csv(
            'Backend/data/' + headers['name'] + '/' + headers['name'] + '_' +
            'goldstandard' + '.tsv',   sep='\t')
    x=FunctionML.getGold(df_gold,10)
    return (str(x))

@app.route('/prediction', methods=['POST'])
#Route en cas de prediction de knockdown/knockout -> x est un json a 2 parametre de type {pert1: "knockdown G2", pert2 : "knockout G7"}
#La fonction renvoie directement les données récupérées post-traitement (sous forme de 10 valeurs successives)
def predict():
    conn = psycopg2.connect(
    host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()
    headers=request.get_json(force=True)
    if headers['pert1'][5]!='o':
        G1= 'd'+headers['pert1'][-1]
    else:
        G1= 'o'+headers['pert1'][-1]
    if headers['pert2'][5]!='o':
        G2= 'd'+headers['pert2'][-1]
    else:
        G2= 'o'+headers['pert2'][-1]
    id=int(headers['id'])

    sql2 = "select name from folder where folder_id="+str(id)
    cur.execute(sql2)
    dossier= cur.fetchall()
    dossier=str(dossier)[3:-4]
    hello=""
    datas=[]
    df_knockouts = pd.read_csv('Backend/data/' + dossier + '/' + dossier + '_knockouts.tsv', sep='\t')
    df_knockdowns = pd.read_csv('Backend/data/' + dossier + '/' + dossier + '_knockdowns.tsv', sep='\t')
    df_wildtype = pd.read_csv('Backend/data/' + dossier + '/' + dossier + '_wildtype.tsv', sep='\t')
    df_timeseries = pd.read_csv('Backend/data/' + dossier + '/' + dossier + '_timeseries.tsv', sep='\t')
    if headers['method']=='Reseau_neurone':
        datas=MLPRegressor.doubleKO(df_timeseries,df_wildtype,G1,G2)[0]
    elif headers['method']=='XGBoost':
        models = XGBoost.train_XGBoost_from_timeseries(df_timeseries)
        datas=XGBoost.get_double_knockouts(df_timeseries, df_wildtype, 30, G1, G2, models)

    else:
        datas= FunctionML.Global(df_knockouts,df_knockdowns,df_wildtype,G1,G2)

    for row in datas:
        hello+=' '+str(row)

    return (hello)
