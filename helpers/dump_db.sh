./node_modules/elasticdump/bin/elasticdump \
  --input=https://search-sensibledata-mnmvjeckzqxbuqjpnrlamqgxhu.eu-central-1.es.amazonaws.com/faces \
  --output=my_index_mapping.json \
  --type=mapping
./node_modules/elasticdump/bin/elasticdump \
  --input=https://search-sensibledata-mnmvjeckzqxbuqjpnrlamqgxhu.eu-central-1.es.amazonaws.com/faces \
  --output=my_index.json \
  --type=data
