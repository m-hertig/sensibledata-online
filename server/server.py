# -*- coding: utf-8 -*-
import os

from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from flask import request
from werkzeug.utils import secure_filename

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
                filename = secure_filename(webcam_file.filename)
                webcam_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                # here comes the Rekognition request: mit tstmp filename

                # here comes the elasticsearch index command

                print 'saved? %s ' % filename
        except Exception as ex:
            print ex

    return "Hello World!"


@app.route('/pictures/<path:path>')
def get_picture(path):
    return send_from_directory(app.config['UPLOAD_FOLDER'], path)


if __name__ == "__main__":
    app.run(debug=True)
