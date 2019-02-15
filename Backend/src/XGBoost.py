import pandas as pd
import numpy as np
from sklearn import ensemble
from sklearn import metrics
from sklearn.metrics import mean_squared_error

def init_timeseries(df_timeseries):
    return df_timeseries.drop(["Time"], axis=1).values

def get_echant_from_timeseries(df_timeseries, n_echant=0):
    X = init_timeseries(df_timeseries)
    if n_echant == 0:
        return X
    elif 21*n_echant <= len(X):
        return X[21*(n_echant-1):21*n_echant]
    else:
        return "Error, echant number "+ str(n_echant)+" does not exist. There is only "+ str(int(len(X)/21))+ " echant."

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
        return {"Xi": Xi, "Yi": Yi}
    else:
        print(shift)
        return "Error, shift "+ str(shift)+" is not suported yet"

def train_XGBoost_for_one_gene_from_echant(echant, gene_label, shift=-1, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}, trained_model="no"):
    Xi = extract_Xi_and_Yi_from_echant(echant, gene_label, shift=shift)["Xi"]
    Yi = extract_Xi_and_Yi_from_echant(echant, gene_label, shift=shift)["Yi"]
    if trained_model=="no":
        clf = ensemble.GradientBoostingRegressor(**params)
    else:
        clf = trained_model
    model = clf.fit(Xi, Yi)
    return model

def get_XGBoost_coef_for_one_gene_from_echant(echant, gene_label, shift=-1, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    trained_model = train_XGBoost_for_one_gene_from_echant(echant, gene_label, shift, params)
    return trained_model.feature_importances_

def get_XGBoost_coef_for_one_gene_from_timeseries(df_timeseries, gene_label, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    return [get_XGBoost_coef_for_one_gene_from_echant(get_echant_from_timeseries(df_timeseries, i), gene_label, params=params) for i in range(1, 1+int(len(df_timeseries)/21))]

def get_all_XGBoost_coef_from_timeseries(df_timeseries, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    n_gene=len(np.transpose(init_timeseries(df_timeseries)))
    return [get_XGBoost_coef_for_one_gene_from_timeseries(df_timeseries, gene_label) for gene_label in range(1, 1+n_gene)]

def get_coef_matrix_from_XGBoost_coef(df_timeseries, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    n_gene=len(np.transpose(init_timeseries(df_timeseries)))
    M_coefs = np.zeros((n_gene, n_gene))
    coefs = get_all_XGBoost_coef_from_timeseries(df_timeseries)
    for i in range(len(coefs)):
        for j in range(len(coefs[i])):
            for k in range(len(coefs[i][j])):
                if i <= k:
                    M_coefs[i][k+1]+=int(coefs[i][j][k]*100)
                else:
                    M_coefs[i][k]+=int(coefs[i][j][k]*100)
    return M_coefs

def get_relation_matrix_from_coef_matrix(M):
    for i in range(len(M)):
        for j in range(len(M[i])):
            if M[i][j] > 30:
                M[i][j] = 1
            else:
                M[i][j] = 0
    return M


#Etats stables

def train_XGBoost_from_timeseries(df_timeseries, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    n_gene=len(np.transpose(init_timeseries(df_timeseries)))
    models = [0 for i in range(n_gene)]
    for gene_label in range(1,n_gene+1):
        trained_model = train_XGBoost_for_one_gene_from_echant(get_echant_from_timeseries(df_timeseries), gene_label, shift=1, params=params)
        models[gene_label-1] = trained_model
    return models

def get_XGBoost_next_point_from_df_timeseries(df_timeseries, X, models, params={'n_estimators': 500, 'max_depth': 8, 'min_samples_split': 2,'learning_rate': 0.01, 'loss': 'ls'}):
    #models = train_XGBoost_from_timeseries(df_timeseries, param)
    Y = [0 for i in range(len(X))]
    for i in range(len(X)):
        if i == 0:
            Xi = [X[1:]]
        elif i == 9:
            Xi = [X[0:-1]]
        else:
            Xi = [list(X[0:i])+list(X[i+1:])]
        Y[i] = models[i].predict(Xi)
    for i in range(len(Y)):
        Y[i] = Y[i][0]
    return Y

def get_double_knockouts(df_timeseries, df_wildtype, itera, var1, var2, models):
    X = df_wildtype.values[0]
    if var1[0]=='o':
        X[int(var1[1:])-1]=0
    else:
        X[int(var1[1:])-1]=df_wildtype.values[0][int(var1[1:])-1]/2
    if var2[0]=='o':
        X[int(var2[1:])-1]=0
    else:
        X[int(var2[1:])-1]=df_wildtype.values[0][int(var1[1:])-1]/2

    for k in range(itera):
        X = get_XGBoost_next_point_from_df_timeseries(df_timeseries, X, models)
        if var1[0]=='o':
            X[int(var1[1:])-1]=0
        else:
            X[int(var1[1:])-1]=df_wildtype.values[0][int(var1[1:])-1]/2
        if var2[0]=='o':
            X[int(var2[1:])-1]=0
        else:
            X[int(var2[1:])-1]=df_wildtype.values[0][int(var1[1:])-1]/2
    return X
