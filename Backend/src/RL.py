def init_df_timeseries(df_timeseries):
    return df_timeseries.drop(["Time"], axis=1).values

def get_echant_from_timeseries(df_timeseries, n_echant=0):
    X = init_df_timeseries(df_timeseries)
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

def RL_for_one_gene_from_echant(echant, i):
    X = extract_Xi_and_Yi_from_echant(echant, i)['Xi']
    y = extract_Xi_and_Yi_from_echant(echant, i)['Yi']
    reg = LinearRegression().fit(X, y)
    result=reg.coef_

    #On réduit les coef à un pourcentage d'influence
    som = sum((abs(result)))
    for j in range(len(result)):
        result[j]=result[j]/(som+1)

    #On met en forme le résultat
    result = list(result)
    if i == len(echant):
        result = result+[0.]
    else:
        result = result[0:(i-1)]+[0.]+result[(i-1):]


    return result

def RL_from_timeseries(df_timeseries):
    n_gene = int(len(np.transpose(init_df_timeseries(df_timeseries))))
    n_echant = int(len(df_timeseries)/21)
    M = [0. for i in range(n_gene)]
    for i in range(n_gene):
        result = np.array([0. for i in range(n_gene)])
        for j in range(n_echant):
            echant = get_echant_from_timeseries(df_timeseries, j+1)
            result += np.array(RL_for_one_gene_from_echant(echant, i+1))
        M[i] = list(result)
    return M

def get_relation_matrix(M, pourc=0.2, taille=10):
    n_gene = int(len(np.transpose(init_df_timeseries(df_timeseries))))
    if n_gene == 10:
        pourc = 0.2
        taille = 10
    elif n_gene == 100:
        pourc = 0.05
        taille = 100
    X = np.zeros((taille,taille))
    Rel = []
    for i in range(len(M)):
        for j in range(len(M)):
            if abs(M[i][j]) >= pourc:
                X[i][j] = 1
                Rel += [(i+1,j+1)]
    return X,Rel
