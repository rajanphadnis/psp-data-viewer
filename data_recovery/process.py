import pandas as pd
from scipy.io import loadmat


def createDFFromMat(mat_name: str) -> list[pd.DataFrame]:
    data_dict = loadmat(f"daq/{mat_name}")
    keys = data_dict.keys()
    toProcess = {}
    for key in keys:
        flat_list = [x for xs in data_dict[key] for x in xs]
        toProcess[key] = flat_list
    df = pd.DataFrame(toProcess)
    df = condenseTime(df)
    df = splitDF(df)
    return df


def createDFFromText(file_name: str) -> list[pd.DataFrame]:
    df = pd.read_csv(f"daq/{file_name}", sep="	")
    df = df.loc[:, ~df.columns.duplicated()]
    df = condenseTime(df)
    df = splitDF(df)
    return df


def condenseTime(df: pd.DataFrame):
    time_columns = [col for col in df.columns if col.endswith("_time")]
    if time_columns:
        columns_to_keep = [time_columns[0]] + [
            col for col in df.columns if not col.endswith("_time")
        ]
        df = df[columns_to_keep]
    df.columns = ["time" if col.endswith("_time") else col for col in df.columns]
    return df


def splitDF(df: pd.DataFrame):
    columns = [col for col in df.columns if col != "time"]
    toReturn: list[pd.DataFrame] = []
    for col in columns:
        splitDf = pd.DataFrame.from_dict({"time": df["time"], col: df[col]})
        toReturn.append(splitDf)
    return toReturn

def createDFList(files: list[str]) -> list[pd.DataFrame]:
    dfs: list[pd.DataFrame] = []
    for file in files:
        if file.endswith(".txt"):
            smallDfList = createDFFromText(file)
            dfs.extend(smallDfList)
        elif file.endswith(".mat"):
            smallDfList = createDFFromMat(file)
            dfs.extend(smallDfList)
        else:
            raise ValueError("This file type is not surrently supported")
        # print(file)
        # print(dfs)
    return dfs
