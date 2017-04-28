import pprint

import boto3

# Set this to whatever percentage of 'similarity'
# you'd want
SIMILARITY_THRESHOLD = 75.0

if __name__ == '__main__':
    client = boto3.client('rekognition')

    # Our source image: http://i.imgur.com/OK8aDRq.jpg
    with open('source.jpg', 'rb') as source_image:
        source_bytes = source_image.read()

    response = client.detect_faces(
                   Image={ 'Bytes': source_bytes },
		   Attributes=['ALL'],
    )

    pprint.pprint(response)


