from flask import Flask, render_template, request
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def result():
    return ("hello world")

@app.route('/test', methods=['GET'])
def config():
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()


    ##sql1 = """create table test3 (indentifiant varchar)"""
    sql2="select * from test1"
    #cur.execute(sql1)
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records[1:len(records)]:
        hello+='\t'.join(row)+'\t'
    print(hello)
    cur.close()

    conn.close()

    return (hello)

@app.route('/test2', methods=['GET'])
def config2():
    hello=""
    conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")

    cur = conn.cursor()


    ##sql1 = """create table test3 (indentifiant varchar)"""
    sql2="select * from test2"
    #cur.execute(sql1)
    cur.execute(sql2)
    records = cur.fetchall()
    for row in records[1:len(records)]:
        hello+='\t'.join(row)+'\t'

    cur.close()

    conn.close()

    print(hello)
    return (hello)
