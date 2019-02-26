import pandas as pd 
import csv
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_squared_error

def train(X,y,test,reg):
    list = []
    Ypred = reg.predict(test)

    return [Ypred,reg]

import copy
##Etude de variation
def doubleKO(df_timeseries,df_wildtype,var1,var2):
    j=int(len(df_timeseries.drop(["Time"],axis=1).values)/5)
    X=[]
    y=[]
    length=10
    for s in range(1,6):
        X+=[[float(df_timeseries.drop(["Time"],axis=1).values[i][j]) for j in range(0,length)] for i in range(j*(s-1),j*s-1)]
        y+=[[float(df_timeseries.drop(["Time"],axis=1).values[i][j]) for j in range(0,length)] for i in range(j*(s-1)+1,j*s)]
    result=copy.copy(df_wildtype.values)
    if var1[0]=='o':
        result[0][int(var1[1:])-1]=0
    else:
        result[0][int(var1[1:])-1]=df_wildtype.values[0][int(var1[1:])-1]/2
    if var2[0]=='o':
        result[0][int(var2[1:])-1]=0
    else:
        result[0][int(var2[1:])-1]=df_wildtype.values[0][int(var2[1:])-1]/2
    reg = MLPRegressor(solver ='lbfgs', alpha = 1e-5, hidden_layer_sizes = (20,10), random_state = 1)
    reg.fit(X, y)
    for s in range(25):
        result=train(X,y,result,reg)[0]
        if var1[0]=='o':
            result[0][int(var1[1:])-1]=0
        else:
            result[0][int(var1[1:])-1]=df_wildtype.values[0][int(var1[1:])-1]/2
        if var2[0]=='o':
            result[0][int(var2[1:])-1]=0
        else:
            result[0][int(var2[1:])-1]=df_wildtype.values[0][int(var2[1:])-1]/2
        for j in range(len(result[0])):
            if result[0][j]<0:
                result[0][j]=0.05
            if result[0][j]>1:
                result[0][j]=0.95
    return result

## Etude des relations

def testrelation(i,k,df_timeseries,df_wildtype,reg,c):
    result=copy.copy(df_wildtype.values)
    result2=copy.copy(df_wildtype.values)
    result[0][i]=0
    result=reg.predict(result)
    result2[0][i]=1
    result2=reg.predict(result2)
    return (c*abs(result[0][k]-df_wildtype.values[0][k])+(1-c)*abs(result2[0][k]-df_wildtype.values[0][k]))

def testcomplet(df_timeseries,df_wildtype,z=91/1000,c=54/100):
    reg = MLPRegressor(solver ='lbfgs', alpha = 1e-5, hidden_layer_sizes = (20,20), random_state = 1)
    j=int(len(df_timeseries.drop(["Time"],axis=1).values)/5)
    X=[]
    y=[]
    length=10
    for s in range(1,6):
        X+=[[float(df_timeseries.drop(["Time"],axis=1).values[i][j]) for j in range(0,length)] for i in range(j*(s-1),j*s-1)]
        y+=[[float(df_timeseries.drop(["Time"],axis=1).values[i][j]) for j in range(0,length)] for i in range(j*(s-1)+1,j*s)]
    reg.fit(X, y)
    A=[]
    for i in range(10):
        B=[]
        for j in range(10):
            if j!=i:
                B.append(testrelation(i,j,df_timeseries,df_wildtype,reg,c))
            else:
                B.append(0)
        A.append(B)
    M=[[0 for i in range(10)] for j in range(10)]
    for i in range(10):
        for j in range(10):
            if A[i][j]>z:
                M[i][j]=1
    return M