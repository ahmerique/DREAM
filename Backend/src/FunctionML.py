import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn import ensemble
from sklearn import metrics
from statistics import mean

def etudeRelationSigne(df_knockouts,df_wildtype,v=.12):
    m = len(df_knockouts.values)
    mat = np.zeros((m,m))

    for i in range(m):
        for j in range(m):
            if i != j:
                mat[i][j] =(round(df_knockouts.values[i][j] - df_wildtype.values[0][j], 3))
                if -v < mat[i][j] < v : 
                    mat[i][j] = 0.
                elif mat[i][j]>0:
                    mat[i][j] = 1.
                else:
                    mat[i][j] = -1.
    return mat

def creationDict(df_knockouts,df_wildtype,v):
    dict={}
    for i in range(len(df_knockouts.values)):
        dict[i+1]={}
    relation=etudeRelationSigne(df_knockouts,df_wildtype,v)  
    for i in range(len(relation)):
        newrel=[]
        for j in range(len(relation)):
            if relation[i][j]==1:
                newrel.append(j+1)
            if relation[i][j]==-1:
                newrel.append(-j-1)
        dict[i+1][i+1]=(newrel)
        for l in range(len(newrel)):
            dict[abs(newrel[l])][i+1]=(newrel)
    return dict

def etudedict(df_knockouts,df_knockdowns,df_wildtype,v=.13):
    m = len(df_knockouts.values)
    mat = np.zeros((m,m))
    dict1=creationDict(df_knockouts,df_wildtype,v)
    for i in range (len(dict1)):
        list1=dict1[i+1][i+1]
        list2=[]
        for j in range(len(list1)):
                mat[i][abs(list1[j])-1]=np.sign(list1[j]+.01)
        for key in dict1[i+1]:
            if (i+1) in dict1[i+1][key]:
                for j in dict1[i+1][key]:
                    if j!=(i+1):
                        if j in list2:
                            mat[i][abs(j)-1]=np.sign(j+0.1)
                        else:
                            list2.append(j)
    return mat

def etudeVariation(df_knockouts,df_knockdowns,df_wildtype):
    m = len(df_knockouts.values)
    mat=etudedict(df_knockouts,df_knockdowns,df_wildtype).T
    retour=[]
    for i in range(m):
        if (max(mat[i])-min(mat[i])==1):
            if (max(mat[i])==1):
                retour.append(1)
            else:
                retour.append(-1)
        elif (max(mat[i])-min(mat[i])==0):
            if (max(mat[i])==1):
                retour.append(2)
            elif (max(mat[i])==-1):
                retour.append(-2)
            else:
                retour.append(0)
        else:
            retour.append(0)
    return retour

def implementation1(df_knockouts,df_knockdowns,df_wildtype,var1,var2):
    variation=etudeVariation(df_knockouts,df_knockdowns,df_wildtype)
    answer=[-1 for i in range(len(df_knockouts.values))]
    if var1[0]=='o':
        answer[int(var1[1:])-1]=0
    else:
        answer[int(var1[1:])-1]=df_knockdowns.values[int(var1[1:])-1][int(var1[1:])-1]
    if var2[0]=='o':
        answer[int(var2[1:])-1]=0
    else:
        answer[int(var2[1:])-1]=df_knockdowns.values[int(var2[1:])-1][int(var2[1:])-1]
    i=0
    for i in range(len(df_knockouts.values)):
        if answer[i]==-1:
            if relation(df_knockouts,df_knockdowns,df_wildtype,i,int(var1[1:])-1) and variation[i]==1:
                answer[i]=max(getValue(df_knockouts,df_knockdowns,df_wildtype,var1,i),getValue(df_knockouts,df_knockdowns,df_wildtype,var2,i))
            elif relation(df_knockouts,df_knockdowns,df_wildtype,i,int(var1[1:])-1) and variation[i]==-1:
                answer[i]=min(getValue(df_knockouts,df_knockdowns,df_wildtype,var1,i),getValue(df_knockouts,df_knockdowns,df_wildtype,var2,i))
            elif relation(df_knockouts,df_knockdowns,df_wildtype,i,int(var2[1:])-1) and (variation[i]==-1 or variation[i]==1):
                answer[i]=getValue(df_knockouts,df_knockdowns,df_wildtype,var2,i)
    return (answer)

def getValue(df_knockouts,df_knockdowns,df_wildtype,var,i):
    if var[0]=='o':
        return df_knockouts.values[int(var[1:])-1][i]
    else:
        return df_knockdowns.values[int(var[1:])-1][i]
    
def relation(df_knockouts,df_knockdowns,df_wildtype,var1,var2):
    mat=etudedict(df_knockouts,df_knockdowns,df_wildtype)
    if abs(mat[var1][var2])==1:
        return True
    return False

def secondPartImplement(df_knockouts,df_knockdowns,df_wildtype,G1,G2,result):
    for j in range(len(df_knockouts.values)):
        value=[]
        if(abs(etudeVariation(df_knockouts,df_knockdowns,df_wildtype)[j]))==1 and result[j]==-1:
            for i in range(len(df_knockouts.values)):
                if (result[i]!=-1 and result[i]<df_wildtype.values[0][i]-.1):
                    if result[i]>=df_knockdowns.values[i][j] or df_knockdowns.values[i][j]-result[i]>result[i]:
                        if relation(df_knockouts,df_knockdowns,df_wildtype,j,i):
                            value.append(df_knockdowns.values[i][j])
                    elif relation(df_knockouts,df_knockdowns,df_wildtype,j,i):
                        value.append(df_knockouts.values[i][j])
            if (len(value)!=0):
                if result[j]==-1:
                    if etudeVariation(df_knockouts,df_knockdowns,df_wildtype)[j]==1:
                        result[j]=max(value)
                    else:
                        result[j]=min(value)

    return  result

def thirdPartImplement(df_knockouts,df_knockdowns,df_wildtype,G1,G2,result):
    for j in range(len(df_knockouts.values)):
        if result[j]==-1:
            result[j]=mean([getValue(df_knockouts,df_knockdowns,df_wildtype,G1,j),getValue(df_knockouts,df_knockdowns,df_wildtype,G2,j)])
    return result

def Global(df_knockouts,df_knockdowns,df_wildtype,G1,G2):
    result=implementation1(df_knockouts,df_knockdowns,df_wildtype,G1,G2)
    result=secondPartImplement(df_knockouts,df_knockdowns,df_wildtype,G1,G2,result)
    return thirdPartImplement(df_knockouts,df_knockdowns,df_wildtype,G1,G2,result)

### Graphe d'interaction : 
