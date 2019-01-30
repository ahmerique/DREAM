from flask import Flask, render_template, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
##Fonction de vérification que le back est plutot bon
def result():
    return ("le back est plutôt bon")

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
    print(hello)
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
    print(data)
    return(str(data))

@app.route('/wildtype', methods=['GET'])
##Fonction de recuperation des etats stables
def wildtype():
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor()
    sql2="select datas from tsv where nom='wildtype'"
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
    print(newdata)
    records=newdata.split(" t")
    print(records)
    for row in records:
        print(row)
        hello+=' '+row
    print(hello)
    cur.close()

    conn.close()

    return (hello)

@app.route('/learning', methods=['POST'])
#Route en cas de demande d'apprentissage, le POST contient un json recapitulant les differentes informations: {'name': 'Silico10', 'data': '{"0":"knockout"}', 'learning': 'RandomForest'}
# la fonction renvoie les données utilisées et stocke 
def learn():
    x=request.get_json(force=True)
    print(x)
    return (str(x))

@app.route('/displayData', methods=['POST'])
def display():
    headers=request.get_json(force=True)
    dossier=headers['donnee']
    name=headers['type']
    displayData=[]
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor()
    sql2="select tsv.datas from tsv, dossier, contient where dossier.nom='"+dossier+"' and dossier.id_dossier=contient.id_dossier and contient.id_tsv=tsv.id_tsv and tsv.nom='"+name+"'"
    cur.execute(sql2)
    records = cur.fetchall()
    datas=str(records[0])
    newdata=''
    length=10
    for j in range(2,len(datas)-2):
        if datas[j]=="\\":
            newdata+=' '
        elif datas[j]=="n":
            newdata+='t'
        else:
            newdata+=datas[j]
    records=newdata.split(" t")
    for row in range (len(records)-1):
        if row<length:
            displayData.append({"label":str(records[row])[1:-1],"data":[]})
        else:
            displayData[row%length]["data"].append(records[row])
    cur.close()
    conn.close()
    return (str(displayData))

@app.route('/displayTimeseries', methods=['POST'])
#Route créée pour afficher les timeseries sur le graphe.
def displayTimeseries():
    headers=request.get_json(force=True)
    dossier=headers['donnee']
    name=headers['type']
    displayData=[]
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")
    cur = conn.cursor()
    sql2="select tsv.datas from tsv, dossier, contient where dossier.nom='"+dossier+"' and dossier.id_dossier=contient.id_dossier and contient.id_tsv=tsv.id_tsv and tsv.nom='"+name+"'"
    cur.execute(sql2)
    records = cur.fetchall()
    datas=str(records[0])
    newdata=''
    length=11
    for j in range(2,len(datas)-2):
        if datas[j]=="\\":
            newdata+=' '
        elif datas[j]=="n":
            newdata+='t'
        else:
            newdata+=datas[j]
    records=newdata.split(" t")
    for row in range (243):
        if row<length:
            displayData.append({"label":str(records[row])[1:-1],"data":[]})
        elif row>length:
            displayData[(row-1)%length]["data"].append(records[row])
    cur.close()
    conn.close()
    print(displayData)
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
    print(newdata)
    records=newdata.split(" t")
    print(records)
    for row in records:
        print(row)
        hello+=' '+row
    print(hello)
    cur.close()

    conn.close()

    return (hello)
