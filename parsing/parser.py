import pandas as pd
import fileinput

fname = 'left'

fname_csv = fname + '.csv'
fname_json = fname + '.json'

data = pd.read_csv(fname_csv, sep=',', header=0)
data.to_json(r''+fname_json, orient='records')

with fileinput.FileInput(fname_json, inplace=True, backup='.bak') as file:
    for line in file:
        print(line.replace('},{', '},\n{' ), end='')
        
for word in data.keys():
    with fileinput.FileInput(fname_json, inplace=True, backup='.bak') as file:
        for line in file:
            print(line.replace('"'+word+'"', word ), end='')

print(data.keys())