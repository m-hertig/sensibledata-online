# -*- coding: utf-8 -*-
import os, time
import uuid

from elasticsearch import Elasticsearch
from flask import Flask, send_from_directory, render_template, redirect, flash, session, url_for
from flask_cors import CORS, cross_origin
from flask import request
from werkzeug.utils import secure_filename
import requests, json, sys
from configobj import ConfigObj
import certifi

UPLOAD_FOLDER = './uploads'

application = Flask(__name__, static_url_path='')
application.secret_key = '\xc2\x10\xe9\xde\xfd\xe0Y\xad\x0e\xc8\x97\xd9y\x88\xb4\xe4q9,\xff!\x8b\xbd\x91'
CORS(application)
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@application.route("/")
def hello():
    return "Hello World!"


@application.route("/upload", methods=['GET'])
def uploadPage():
    flash("Photo Booth")
    return render_template('index.html')

@application.route("/upload", methods=['POST'])
def upload():
    configobj = ConfigObj('server.config')
    print configobj["rekognition_api_key"]
    print 'hallo uploader!!!!'
    flash("Trying to analyze your face!")
    moods = {"happy":0,"calm":0,"confused":0,"disgust":0,"surprised":0,"sad":0,"angry":0}
    req = request
    if request.method == 'POST':
        try:
            webcam_file = request.files['webcam']
            if webcam_file:
                randomtext = "Bla"
                filename = secure_filename(str(uuid.uuid4())+".jpg")
                webcam_file.save(os.path.join(application.config['UPLOAD_FOLDER'], filename))

		picture_url = configobj["pictures_url"]+filename
                #picture_url = "http://idowebsites.ch/sensibleData/imageToAnalyze.jpg";
                print 'saved? %s ' % picture_url
                print "api key: "+configobj["rekognition_api_key"];
                data = {'api_key':configobj["rekognition_api_key"], 'api_secret':configobj["rekognition_api_secret"], 'jobs':'face_gender_emotion_age_beauty', 'urls':picture_url}
                #Parse data
                try:
                    print "Trying to get Face Analysis from Rekognition"
                    r = requests.get(configobj["rekognition_url"], params=data)
                    jsondata =  r.json()
                    # sample jsondata = {u'url': u'https://www.dropbox.com/s/m8gkdlh6zdeea9e/2015-05-16%2016.13.08.jpg?dl=1', u'face_detection': [{u'emotion': {u'calm': 0.03, u'confused': 0.28, u'sad': 0.09}, u'confidence': 0.99, u'beauty': 0.12593, u'pose': {u'yaw': 0.08, u'roll': 0.1, u'pitch': 14.79}, u'sex': 1, u'race': {u'white': 0.58}, u'boundingbox': {u'tl': {u'y': 48.46, u'x': 139.23}, u'size': {u'width': 376.15, u'height': 376.15}}, u'smile': 0, u'quality': {u'brn': 0.51, u'shn': 1.6}, u'mustache': 0, u'beard': 0}], u'ori_img_size': {u'width': 576, u'height': 576}, u'usage': {u'status': u'Succeed.', u'quota': 19968, u'api_id': u'yHvz5xQExIxdKT1M'}}
                    print "Got it"
                    print jsondata

                    emotions = jsondata["face_detection"][0]["emotion"]
                    beauty = str(int(jsondata["face_detection"][0]["beauty"]*100))
                    # 0 = female, 1 = male
                    if jsondata["face_detection"][0]["sex"]==1:
                        sex = "M"
                    else:
                        sex = "F"
                    age = str(int(jsondata["face_detection"][0]["age"]))
                    smile = jsondata["face_detection"][0]["smile"]
                    highestVal = 0
                    highestAttr = ""
                    for att,val in emotions.iteritems():
                        moods[att] = val*100
                        print att,val
                        if val>highestVal:
                            highestVal = val
                            highestAttr = att
                    mood = str(highestAttr)

                except Exception as e:
                    print(e)
                    print "error parsing data"
                    return "Error analyzing your face! Please try again!"

                #calculate happiness
                happiness = 50+(moods['happy']/2)-(moods['sad']/2)

                # here comes the elasticsearch index command
                data = {'beauty':beauty, 'age':age, 'smile':smile, 'happiness':happiness, 'happy':moods['happy'],'calm':moods['calm'],'confused':moods['confused'],'disgust':moods['disgust'],'surprised':moods['surprised'],'sad':moods['sad'],'angry':moods['angry'],'gender':sex, 'mood':mood, 'file':configobj["pictures_url"]+filename, 'timestamp':time.time()}
                print data
                print "Trrrrying to put data into elasticsearch"

                es = Elasticsearch(
                    [configobj["elasticsearch_url"]],
                    #port=80,
                    use_ssl=True,
                    verify_certs=True,
                    ca_certs=certifi.where(),
                    request_timeout=1000
                )
                try:
                    es.index(index='faces', doc_type='face', body=data)
                except Exception as e:
                    print e
                    return "Error indexing your face! Please try again!"

                #target_url = config[config[elasticsearch_index_url]] % filename
                #r = requests.put(target_url, data=json.dumps(data))
                #jsondata =  r.json()
                # sample jsondata = {u'url': u'https://www.dropbox.com/s/m8gkdlh6zdeea9e/2015-05-16%2016.13.08.jpg?dl=1', u'face_detection': [{u'emotion': {u'calm': 0.03, u'confused': 0.28, u'sad': 0.09}, u'confidence': 0.99, u'beauty': 0.12593, u'pose': {u'yaw': 0.08, u'roll': 0.1, u'pitch': 14.79}, u'sex': 1, u'race': {u'white': 0.58}, u'boundingbox': {u'tl': {u'y': 48.46, u'x': 139.23}, u'size': {u'width': 376.15, u'height': 376.15}}, u'smile': 0, u'quality': {u'brn': 0.51, u'shn': 1.6}, u'mustache': 0, u'beard': 0}], u'ori_img_size': {u'width': 576, u'height': 576}, u'usage': {u'status': u'Succeed.', u'quota': 19968, u'api_id': u'yHvz5xQExIxdKT1M'}}
                print "Done"
                print jsondata
                return "Analyzed your face! Beauty: "+beauty+" %, Age: "+age+" yrs"

        except Exception as ex:
            print ex

@application.route('/pictures/<path:path>')
def get_picture(path):
    return send_from_directory(application.config['UPLOAD_FOLDER'], path)


if __name__ == "__main__":
    application.run(host='0.0.0.0',debug=True)
