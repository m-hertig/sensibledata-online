import requests
import os

dir = "/Users/martinhertig/Documents/Workspace/sensible-data/imagesConverted/"
for filename in os.listdir(dir):
    abspath= dir+filename
    r = requests.post('https://faceatlas.co/upload', files={'webcam': open(abspath, 'rb')})
    print abspath+" added"
