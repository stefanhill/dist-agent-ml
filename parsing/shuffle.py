import pandas as pd
from sklearn.utils import shuffle
import fileinput

fname = 'right'

fname_csv = fname + '.csv'
fname_json = fname + '.json'

data = pd.read_csv(fname_csv, sep=',', header=0)
data = shuffle(data)
data.to_json(r''+fname_json, orient='records')

with fileinput.FileInput(fname_json, inplace=True, backup='.bak') as file:
    for line in file:
        print(line.replace('},{', '},\n{' ), end='')
        
for word in data.keys():
    with fileinput.FileInput(fname_json, inplace=True, backup='.bak') as file:
        for line in file:
            print(line.replace('"'+word+'"', word ), end='')

print(data.keys())