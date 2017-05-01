import pprint
import json
import boto3
import os

if __name__ == '__main__':
    rekognition = boto3.client('rekognition')

    dir = "/Users/martinhertig/Documents/Workspace/sensible-data/imagesConverted/"
    for filename in os.listdir(dir):
        abspath= dir+filename
        with open(abspath, 'rb') as source_image:
            source_bytes = source_image.read()

        response = rekognition.detect_faces(
                       Image={ 'Bytes': source_bytes },
    		   Attributes=['ALL'],
        )

        firstPerson = response["FaceDetails"][0]


        emotions = firstPerson["Emotions"]
        for emotion in emotions:
            att = emotion['Type'].lower()
            val = int(round(emotion['Confidence']))
            print att,val


    #pprint.pprint(response)
