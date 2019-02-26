import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn import ensemble
from sklearn import metrics
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

def filtering_list(list, var=0.01):
    if np.var(list) > var:
        return list
    else:
        return [0 for i in range(len(list))]

def filter_echant(echant, gene_label=0, var=0.01):
    if gene_label == 0:
        return np.transpose(list(map(lambda x: filtering(x, var), np.transpose(echant))))
    else:
        echant_filtered_temp = np.transpose(echant)
        if np.var(echant_filtered_temp[gene_label-1]) < var:
            echant_filtered_temp[gene_label-1] = [0 for i in range(21)]
        return np.transpose(echant_filtered_temp)

def get_confusion_matrix(RelationsXGBoost, Gold_st, n_gene):
    CM = [[0,0],[0,0]]
    M = np.zeros((n_gene, n_gene))
    for (i,j) in RelationsXGBoost:
        M[i-1][j-1]+=1
    for (i,j) in Gold_st:
        M[i-1][j-1]+=10
    for i in range(n_gene):
        for j in range(n_gene):
            if M[i][j] == 0:
                CM[1][1] += 1
            elif M[i][j] == 1:
                CM[1][0] += 1
            elif M[i][j] == 10:
                CM[0][1] += 1
            elif M[i][j] == 11:
                CM[0][0] += 1
    return CM

def get_auc_error(CM):
    TPR = CM[0][0]/(CM[0][0]+CM[0][1])
    FPR = CM[1][0]/(CM[1][0]+CM[1][1])
    return metrics.auc([0, FPR, 1.],[0.,TPR,1.]), TPR, FPR

def init_df_timeseries(df_timeseries):
    return df_timeseries.drop(["Time"], axis=1).values

def init_df_wildtype(df_wildtype):
    return df_wildtype.values[0]

def get_echant_from_timeseries(df_timeseries, n_echant=0):
    X = init_df_timeseries(df_timeseries)
    if n_echant == 0:
        return X
    elif 21*n_echant <= len(X):
        return X[21*(n_echant-1):21*n_echant]
    else:
        return "Error, echant number "+ str(n_echant)+" does not exist. There is only "+ str(int(len(X)/21))+ " echant."

def extract_Xi_and_Yi_from_echant(echant, gene_label, shift=-1):
    n_gene=len(np.transpose(echant))
    #echant = filter_echant(echant, gene_label, 0.02)
    #echant = list(echant) + list(df_wildtype_10_1.values)*21
    if shift == -1:
        if gene_label == n_gene:
            Xi=np.transpose(np.transpose(echant)[0:-1])[1:]
            Yi=np.transpose(np.transpose(echant)[-1])[0:-1]
        elif gene_label == 1:
            Xi=np.transpose(np.transpose(echant)[1:])[1:]
            Yi=np.transpose(np.transpose(echant)[0])[0:-1]
        else:
            Xi=np.transpose(list(np.transpose(echant)[0:(gene_label-1)])+list(np.transpose(echant)[gene_label:]))[1:]
            Yi=np.transpose(np.transpose(echant)[gene_label-1])[0:-1]
        return {"Xi": Xi, "Yi": Yi}
    elif shift == 0:
        if gene_label == n_gene:
            Xi=np.transpose(np.transpose(echant)[0:-1])
            Yi=np.transpose(np.transpose(echant)[-1])
        elif gene_label == 1:
            Xi=np.transpose(np.transpose(echant)[1:])
            Yi=np.transpose(np.transpose(echant)[0])
        else:
            Xi=np.transpose(list(np.transpose(echant)[0:(gene_label-1)])+list(np.transpose(echant)[gene_label:]))
            Yi=np.transpose(np.transpose(echant)[gene_label-1])
        return {"Xi": Xi, "Yi": Yi}
    elif shift == 1:
        #echant = list(echant) + list(df_wildtype_10_1.values)*21
        if gene_label == n_gene:
            Xi=np.transpose(np.transpose(echant)[0:-1])[0:-1]
            Yi=np.transpose(np.transpose(echant)[-1])[1:]
        elif gene_label == 1:
            Xi=np.transpose(np.transpose(echant)[1:])[0:-1]
            Yi=np.transpose(np.transpose(echant)[0])[1:]
        else:
            Xi=np.transpose(list(np.transpose(echant)[0:(gene_label-1)])+list(np.transpose(echant)[gene_label:]))[0:-1]
            Yi=np.transpose(np.transpose(echant)[gene_label-1])[1:]
        return {"Xi": Xi2, "Yi": Yi2}
    else:
        print(shift)
        return "Error, shift "+ str(shift)+" is not suported yet"

def train_XGBoost_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label, shift=-1, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}, df_multivarie="no"):
    n_echant = int(len(df_timeseries)/21)
    Xi = extract_Xi_and_Yi_from_echant(init_df_timeseries(df_timeseries), gene_label, shift=shift)["Xi"]
    Yi = extract_Xi_and_Yi_from_echant(init_df_timeseries(df_timeseries), gene_label, shift=shift)["Yi"]
    Xi2 = []
    Yi2=[]
    for i in range(1,n_echant):
        Xi2 += list(Xi[0:21*i])
        Yi2 += list(Yi[0:21*i])
        #Xi[21*i-1] = extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Xi']
        #Yi[21*i-1] = extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Yi']
    Xi2 += list(Xi[21*n_echant+1:])
    Yi2 += list(Yi[21*n_echant+1:])
    #Xi2 += list(extract_Xi_and_Yi_from_echant(df_multivarie_10_1.values, gene_label, shift=0)['Xi'])
    #Yi2 += list(extract_Xi_and_Yi_from_echant(df_multivarie_10_1.values, gene_label, shift=0)['Yi'])
    #Xi2 += list([extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Xi']])
    #Yi2 += list([extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Yi']])
    clf = ensemble.GradientBoostingRegressor(**params)
    model = clf.fit(Xi2, Yi2)
    print(str(gene_label)+' TRAINED')
    return model

def train_RandomForest_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label, shift=-1, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}, df_multivarie="no"):
    n_echant = int(len(df_timeseries)/21)
    Xi = extract_Xi_and_Yi_from_echant(init_df_timeseries(df_timeseries), gene_label, shift=shift)["Xi"]
    Yi = extract_Xi_and_Yi_from_echant(init_df_timeseries(df_timeseries), gene_label, shift=shift)["Yi"]
    Xi2 = []
    Yi2=[]
    for i in range(1,n_echant):
        Xi2 += list(Xi[0:21*i])
        Yi2 += list(Yi[0:21*i])
        #Xi[21*i-1] = extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Xi']
        #Yi[21*i-1] = extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Yi']
    Xi2 += list(Xi[21*n_echant+1:])
    Yi2 += list(Yi[21*n_echant+1:])
    #Xi2 += list(extract_Xi_and_Yi_from_echant(df_multivarie_10_1.values, gene_label, shift=0)['Xi'])
    #Yi2 += list(extract_Xi_and_Yi_from_echant(df_multivarie_10_1.values, gene_label, shift=0)['Yi'])
    #Xi2 += list([extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Xi']])
    #Yi2 += list([extract_Xi_and_Yi_from_echant(init_df_wildtype(df_wildtype), gene_label, shift=0)['Yi']])
    rgr = RandomForestRegressor(max_depth=2, random_state=0, n_estimators=100)
    model = rgr.fit(Xi2, Yi2)
    print(str(gene_label)+' TRAINED')
    return model

def get_XGBoost_coef_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label, shift=-1, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    trained_model = train_XGBoost_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label, shift, params)
    return trained_model.feature_importances_

def get_RandomForest_coef_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label, shift=-1, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    trained_model = train_RandomForest_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label, shift, params)
    return trained_model.feature_importances_

def get_all_XGBoost_coef_from_timeseries(df_timeseries, df_wildtype, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    n_gene=len(np.transpose(init_df_timeseries(df_timeseries)))
    X = []
    for gene_label in range(1, 1+n_gene):
        X+= list([get_XGBoost_coef_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label)])
        print(str(gene_label)+' CALCULATED')
        print('///////')
    return X #[get_XGBoost_coef_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label) for gene_label in range(1, 1+n_gene)]

def get_all_RandomForest_coef_from_timeseries(df_timeseries, df_wildtype, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    n_gene=len(np.transpose(init_df_timeseries(df_timeseries)))
    X = []
    for gene_label in range(1, 1+n_gene):
        X+= list([get_RandomForest_coef_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label)])
        print(str(gene_label)+' CALCULATED')
        print('///////')
    return X #[get_XGBoost_coef_for_one_gene_from_timeseries(df_timeseries, df_wildtype, gene_label) for gene_label in range(1, 1+n_gene)]

def get_coef_matrix_from_XGBoost_coef(df_timeseries, df_wildtype, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}, test='no'):
    if test == 'no':
        n_gene=len(np.transpose(init_df_timeseries(df_timeseries)))
        M_coefs = np.zeros((n_gene, n_gene))
        coefs = get_all_XGBoost_coef_from_timeseries(df_timeseries, df_wildtype)
        for i in range(len(coefs)):
            for k in range(len(coefs[i])):
                    if i <= k:
                        M_coefs[i][k+1]+=int(coefs[i][k]*100)
                    else:
                        M_coefs[i][k]+=int(coefs[i][k]*100)
        return M_coefs
    else:
        n_gene=len(np.transpose(init_df_timeseries(df_timeseries)))
        M_coefs = np.zeros((n_gene, n_gene))
        coefs = get_all_XGBoost_coef_from_timeseries(df_timeseries, df_wildtype)
        for i in range(len(coefs)):
            for k in range(len(coefs[i])):
                    if i != k:
                        M_coefs[i][k]+=int(coefs[i][k]*100)
        return M_coefs

def get_coef_matrix_from_RandomForest_coef(df_timeseries, df_wildtype, params={'n_estimators': 500, 'max_depth': 10, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}, test='no'):
    if test == 'no':
        n_gene=len(np.transpose(init_df_timeseries(df_timeseries)))
        M_coefs = np.zeros((n_gene, n_gene))
        coefs = get_all_RandomForest_coef_from_timeseries(df_timeseries, df_wildtype)
        for i in range(len(coefs)):
            for k in range(len(coefs[i])):
                    if i <= k:
                        M_coefs[i][k+1]+=int(coefs[i][k]*100)
                    else:
                        M_coefs[i][k]+=int(coefs[i][k]*100)
        return M_coefs
    else:
        n_gene=len(np.transpose(init_df_timeseries(df_timeseries)))
        M_coefs = np.zeros((n_gene, n_gene))
        coefs = get_all_RandomForest_coef_from_timeseries(df_timeseries, df_wildtype)
        for i in range(len(coefs)):
            for k in range(len(coefs[i])):
                    if i != k:
                        M_coefs[i][k]+=int(coefs[i][k]*100)
        return M_coefs

def get_RL_coef_for_one_gene_from_echant(echant, i):
    X = extract_Xi_and_Yi_from_echant(echant, i)['Xi']
    y = extract_Xi_and_Yi_from_echant(echant, i)['Yi']
    reg = LinearRegression().fit(X, y)
    result=reg.coef_

    som = sum((abs(result)))
    for j in range(len(result)):
        result[j]=result[j]/(som+1)

    result = list(result)
    if i == len(echant):
        result = result+[0.]
    else:
        result = result[0:(i-1)]+[0.]+result[(i-1):]
    return result

def get_RL_coef_from_timeseries(df_timeseries):
    n_gene = int(len(np.transpose(init_df_timeseries(df_timeseries))))
    n_echant = int(len(df_timeseries)/21)
    M = [0. for i in range(n_gene)]
    for i in range(n_gene):
        result = np.array([0. for i in range(n_gene)])
        for j in range(n_echant):
            echant = get_echant_from_timeseries(df_timeseries, j+1)
            result += np.array(get_RL_coef_for_one_gene_from_echant(echant, i+1))
        M[i] = list(result)
    return M

def get_relation_matrix(M, pourc=0.2, taille=10):
    X = np.zeros((taille,taille))
    Rel = []
    for i in range(len(M)):
        for j in range(len(M)):
            if abs(M[i][j]) >= pourc:
                X[i][j] = 1
                Rel += [(i+1,j+1)]
    return X
