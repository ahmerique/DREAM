from flask import Flask, render_template, request
import psycopg2
from flask_cors import CORS
import pandas as pd
import os
import ast

app = Flask(__name__)
CORS(app)

@app.route('/')
##Fonction de vérification que le back est plutot bon
def result():

 return ("le back est plutot bon")
    
@app.route('/test2', methods=['GET'])
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
    cur.close()

    conn.close()

    return (hello)

@app.route('/data', methods=['GET'])
def getData():
    data=[]
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor() 
    sql2="select id_dossier,nom from dossier"
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records:
        row=(str(row).split(','))
        id=int(row[0][1:])
        name=row[1][2:-2]
        data.append({"id":id,"name":name})
    for i in range(len(data)):
        sql="select tsv.nom from tsv, dossier, contient where dossier.id_dossier="+str(i+1) +"and dossier.id_dossier=contient.id_dossier and contient.id_tsv=tsv.id_tsv"
        cur.execute(sql)
        records = cur.fetchall()
        if len(records)!=0:
            types=[]
            for j in range(len(records)):
                type_name=str(records[j])[2:-3]
                types.append(type_name)
            data[i]["type"]=types
        else:
            data[i]["type"]=['test' + str(i)]
    return(str(data))

@app.route('/wildtype', methods=['GET'])
##Fonction de recuperation des etats stables
def wildtype():
    hello=""
    datas=[]

    files=pd.read_csv('../data/insilico_size10_1/insilico_size10_1_wildtype.tsv', sep='\t')

    datas=(files.values)
    print("datas")
    print(datas[0])
    for row in datas[0]:
        print(row)
        hello+=' '+str(row)

    return (hello)

@app.route('/learning', methods=['POST'])
#Route en cas de demande d'apprentissage, le POST contient un json recapitulant les differentes informations: {'name': 'Silico10', 'data': '{"0":"knockout"}', 'learning': 'RandomForest'}
# la fonction renvoie les données utilisées et stocke 
def learn():
    headers=request.get_json(force=True)
    datas=[]
    for i in range(len(ast.literal_eval(headers['data']))):
        x='\''+str(0)+'\''
        print(x)
        print('../data/'+headers['name']+'/'+headers['name']+'_'+ast.literal_eval(headers['data'])[str(i)]+'.tsv', 'r+')
        files=pd.read_csv('../data/'+headers['name']+'/'+headers['name']+'_'+ast.literal_eval(headers['data'])[str(i)]+'.tsv', sep='\t')
        datas.append(files.values)
    print(datas)
    return (str(headers))

@app.route('/displayData', methods=['POST'])
def display():
    headers=request.get_json(force=True)
    dossier=headers['donnee']
    name=headers['type']
    displayData=[]
    files=pd.read_csv('../data/'+dossier+'/'+dossier+'_'+name+'.tsv',sep='\t')
    data2=files.values
    text = open('../data/'+dossier+'/'+dossier+'_'+name+'.tsv', 'r+')

    content = text.read()
    text.close()
    datas=str(content)
    newdata=''
    length=10
    for j in range(0,len(datas)):
        if datas[j]=="\n":
            newdata+='\t'
        else:
            newdata+=datas[j]
    records=newdata.split("\t")
    print(records,data2)
    for i in range(length):
        displayData.append({"label":"G"+str(i),"data":[]})
    for i in range(len(data2)):
        for j in range(len(data2[i])):
            displayData[j]["data"].append(data2[i][j])

    print(displayData)
    return (str(displayData))

@app.route('/displayTimeseries', methods=['POST'])
#Route créée pour afficher les timeseries sur le graphe.
def displayTimeseries():
    headers=request.get_json(force=True)
    dossier=headers['donnee']
    name=headers['type']
    displayData=[]
    text = open('../data/'+dossier+'/'+dossier+'_'+name+'.tsv', 'r+')
    content = text.read()
    text.close()
    datas=str(content)
    newdata=''
    length=11
    for j in range(0,len(datas)):
        if datas[j]=="\n":
            newdata+='\t'
        else:
            newdata+=datas[j]
    records=newdata.split("\t")
    for row in range (243):
        if row<length:
            displayData.append({"label":str(records[row])[1:-1],"data":[]})
        elif row>length:
            displayData[(row-1)%length]["data"].append(records[row])
    return (str(displayData))



@app.route('/prediction', methods=['POST'])
#Route en cas de prediction de knockdown/knockout -> x est un json a 2 parametre de type {pert1: "knockdown G2", pert2 : "knockout G7"}
#La fonction renvoie directement les données récupérées post-traitement (sous forme de 10 valeurs successives)
def predict():
    x=request.get_json(force=True)
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()


    sql2="select datas from tsv where nom='knockdowns'"
    cur.execute(sql2)
    records = cur.fetchall()
    datas=str(records[0])
    newdata=''
    for j in range(2,len(datas)-2):
        if datas[j]=="\\":
            newdata+=' '
        elif datas[j]=="n":
            newdata+='t'
        else:
            newdata+=datas[j]
    records=newdata.split(" t")
    for row in records:
        hello+=' '+row
    cur.close()

    conn.close()

    return (hello)
