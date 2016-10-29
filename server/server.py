# -*- coding: utf-8 -*-
import os, time
import uuid

from elasticsearch import Elasticsearch
from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from flask import request
from werkzeug.utils import secure_filename
import requests, json, sys

rekognition_url = "http://rekognition.com/func/api/"
api_key = "yHvz5xQExIxdKT1M"
api_secret = "IoAdfLyIgoPBn8VB"

#elasticsearch_url = "http://localhost:9200"
elasticsearch_url = "http://data.iterativ.ch:9200"
elasticsearch_index_url = elasticsearch_url+"/ppl/p/%s"

UPLOAD_FOLDER = './uploads'

app = Flask(__name__, static_url_path='')
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/")
def hello():
    return "Hello World!"


@app.route("/upload", methods=['POST'])
def upload():
    print 'hallo uploader!!!!'
    req = request
    if request.method == 'POST':
        try:
            webcam_file = request.files['webcam']
            if webcam_file:
                randomtext = "Bla"
                filename = secure_filename(str(uuid.uuid4())+".jpg")
                webcam_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                print 'saved? %s ' % filename

                data = {'api_key':api_key, 'api_secret':api_secret, 'jobs':'face_gender_emotion_age_beauty', 'urls':'http://idowebsites.ch/sensibleData/imageToAnalyze.jpg'}
                print "Trying to get Face Analysis from Rekognition"
                r = requests.get(rekognition_url, params=data)
                jsondata =  r.json()
                # sample jsondata = {u'url': u'https://www.dropbox.com/s/m8gkdlh6zdeea9e/2015-05-16%2016.13.08.jpg?dl=1', u'face_detection': [{u'emotion': {u'calm': 0.03, u'confused': 0.28, u'sad': 0.09}, u'confidence': 0.99, u'beauty': 0.12593, u'pose': {u'yaw': 0.08, u'roll': 0.1, u'pitch': 14.79}, u'sex': 1, u'race': {u'white': 0.58}, u'boundingbox': {u'tl': {u'y': 48.46, u'x': 139.23}, u'size': {u'width': 376.15, u'height': 376.15}}, u'smile': 0, u'quality': {u'brn': 0.51, u'shn': 1.6}, u'mustache': 0, u'beard': 0}], u'ori_img_size': {u'width': 576, u'height': 576}, u'usage': {u'status': u'Succeed.', u'quota': 19968, u'api_id': u'yHvz5xQExIxdKT1M'}}
                print "Got it"
                print jsondata

                #Parse data
                try:
                    emotions = jsondata["face_detection"][0]["emotion"]
                    beauty = str(int(jsondata["face_detection"][0]["beauty"]*100))
                    # 0 = female, 1 = male
                    if jsondata["face_detection"][0]["sex"]==1:
                        sex = "M"
                    else:
                        sex = "F"
                    age = str(int(jsondata["face_detection"][0]["age"]))
                    highestVal = 0
                    highestAttr = ""
                    for att,val in emotions.iteritems():
                        print att,val
                        if val>highestVal:
                            highestVal = val
                            highestAttr = att
                    if len(highestAttr)<4:
                        if highestVal < 0.2:
                            highestAttr = "A BIT "+highestAttr
                        elif highestVal < 0.5:
                            highestAttr = "RATHER "+highestAttr
                        elif highestVal < 0.6:
                            highestAttr = "QUITE "+highestAttr
                        elif highestVal > 0.7:
                            highestAttr = "VERY "+highestAttr
                    mood = str(highestAttr)

                except Exception as e:
                    print(e)
                    print "error parsing data"

                # here comes the elasticsearch index command
                data = {'beauty':beauty, 'age':age, 'gender':sex, 'mood':mood, 'file':"http://localhost:8000/server/uploads/"+filename}
                print data
                print "Trying to put data into elasticsearch"

                es = Elasticsearch(
                    ['localhost:9200'],
                    # port=80,
                    # use_ssl=True,
                    # verify_certs=True,
                    # ca_certs=certifi.where(),
                    request_timeout=1000
                )
                try:
                    es.index(index='moods', doc_type='mood', body=data)
                except Exception as e:
                    print e

                #target_url = elasticsearch_index_url % filename
                #r = requests.put(target_url, data=json.dumps(data))
                #jsondata =  r.json()
                # sample jsondata = {u'url': u'https://www.dropbox.com/s/m8gkdlh6zdeea9e/2015-05-16%2016.13.08.jpg?dl=1', u'face_detection': [{u'emotion': {u'calm': 0.03, u'confused': 0.28, u'sad': 0.09}, u'confidence': 0.99, u'beauty': 0.12593, u'pose': {u'yaw': 0.08, u'roll': 0.1, u'pitch': 14.79}, u'sex': 1, u'race': {u'white': 0.58}, u'boundingbox': {u'tl': {u'y': 48.46, u'x': 139.23}, u'size': {u'width': 376.15, u'height': 376.15}}, u'smile': 0, u'quality': {u'brn': 0.51, u'shn': 1.6}, u'mustache': 0, u'beard': 0}], u'ori_img_size': {u'width': 576, u'height': 576}, u'usage': {u'status': u'Succeed.', u'quota': 19968, u'api_id': u'yHvz5xQExIxdKT1M'}}
                print "Done"
                print jsondata

        except Exception as ex:
            print ex

    return "Hello World!"


@app.route('/pictures/<path:path>')
def get_picture(path):
    return send_from_directory(app.config['UPLOAD_FOLDER'], path)


if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
