import psycopg2


conn = psycopg2.connect(host="localhost", database="postgres", user="postgres", password="")

cur = conn.cursor()

print(conn)
print(cur)

##sql1 = """create table test3 (indentifiant varchar)"""
sql2="select * from test1"
#cur.execute(sql1)
cur.execute(sql2)
records = cur.fetchall()
print("Total number of rows in python_developers is - ", cur.rowcount)
print ("Printing each row's column values i.e.  developer record")
for row in records:
    print("G1 = ", row[0], )
    print("G2 = ", row[1])
    print("G3  = ", row[2])
    print("G4  = ", row[3])
    print("G5  = ", row[4])
    print("G6  = ", row[5])
    print("G7  = ", row[6])
    print("G8  = ", row[7])
    print("G9  = ", row[8])

    print("G10  = ", row[9], "\n")
cur.close()

conn.close()