import json
import subprocess

digits = 32
bashCommand = "cat /dev/urandom | tr -dc 'a-fA-F0-9' | fold -w {} | head -n 1".format(digits)
result = subprocess.check_output(bashCommand, shell=True)

configfile = 'appconfig.json'
with open(configfile) as json_file:
    config = json.load(json_file)
lastID = max(list(map(int, config['peppers'].keys()))) if config['peppers'] else 1
config['peppers'][str(lastID + 1)] = result.decode("utf-8")[:-1]

with open(configfile, 'w') as json_file:
    json.dump(config, json_file)
