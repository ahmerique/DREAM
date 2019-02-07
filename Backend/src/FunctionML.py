from statistics import mean
import numpy as np

def etudeRelationSigne(Exp_ko,Exp_wt,v):##v=.35 pour un resultat moyen de .78/.80
    m = len(Exp_ko)
    mat = np.zeros((m,m))

    for i in range(m):
        for j in range(m):
            if i != j:
                mat[i][j] =(round(Exp_ko[i][j] - Exp_wt[1][0][j], 3))/Exp_wt[1][0][j]
                if -v < mat[i][j] < v : 
                    mat[i][j] = 0.
                elif mat[i][j]>0:
                    mat[i][j] = 1.
                else:
                    mat[i][j] = -1.
    return mat

def etudeVariationKO(Exp_ko,Exp_wt):
    m = len(Exp_ko)
    mat=etudeRelationSigne(Exp_ko,Exp_wt,.35).T
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

def implementation2KO(Exp_ko,Exp_wt,serie,G1,G2):
    variation=etudeVariationKO(Exp_ko,Exp_wt)
    answer=[-1 for i in range(len(serie.values))]
    answer[G1]=0
    answer[G2]=0
    i=0
    for i in range(len(serie.values)):
        if relation(Exp_ko,Exp_wt,i,G1) and variation[i]==1:
            if relation(Exp_ko,Exp_wt,i,G2):
                answer[i]=max(Exp_ko[G1][i],Exp_ko[G2][i])
            else:
                answer[i]=(Exp_ko[G1][i])
        elif relation(Exp_ko,Exp_wt,i,G1) and variation[i]==-1:
            if relation(Exp_ko,Exp_wt,i,G2):
                answer[i]=min(Exp_ko[G1][i],Exp_ko[G2][i])
            else:
                answer[i]=(Exp_ko[G1][i])
        elif relation(Exp_ko,Exp_wt,i,G2) and (variation[i]==-1 or variation[i]==1):
                answer[i]=(Exp_ko[G2][i])
    return (answer)

def relation(Exp_ko,Exp_wt,G1,G2):
    mat=etudeRelationSigne(Exp_ko,Exp_wt,.35)
    if abs(mat[G1][G2])==1:
        return True
    return False

def secondPartImplementKO(Exp_ko,Exp_wt,serie,G1,G2,result):
    for j in range(len(serie.values)):
        value=[]
        if(abs(etudeVariationKO(Exp_ko,Exp_wt)[j]))==1 and result[j]!=0:
            for i in range(len(serie.values)):
                if (result[i]!=-1 and Exp_wt[0][0][i]-result[i]>.35*result[i]):
                    if relation(Exp_ko,Exp_wt,j,i):
                        value.append(Exp_ko[i][j])
            if (len(value)!=0):
                if result[j]==-1:
                    if etudeVariationKO(Exp_ko,Exp_wt)[j]==1:
                        result[j]=mean(value)
                    else:
                        result[j]=mean(value)
                else:
                    result[j]=mean([result[j],mean(value)])
    return  result

def thirdPartImplementKO(Exp_ko,Exp_wt,serie,G1,G2,result):
    for j in range(len(serie.values)):
        if result[j]==-1:
                result[j]=mean([Exp_ko[G1][j],Exp_ko[G2][j]])
    return result

def Global2KO(Exp_ko,Exp_wt,serie,G1,G2):
    result=implementation2KO(Exp_ko,Exp_wt,serie,G1-1,G2-1)
    secondPartImplementKO(Exp_ko,Exp_wt,serie,G1-1,G2-1,result)
    result=thirdPartImplementKO(Exp_ko,Exp_wt,serie,G1-1,G2-1,result)
    return result

