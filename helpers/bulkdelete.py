import elasticsearch
es = elasticsearch.Elasticsearch(['https://search-sensibledata-mnmvjeckzqxbuqjpnrlamqgxhu.eu-central-1.es.amazonaws.com/'])

fileNames = {"https://faceatlas.co/uploads/4aa84896-14a9-4bac-8e78-e5f5eb43a25e.jpg",
"https://faceatlas.co/uploads/6fca90ff-22ed-4c61-a399-f4f58ef81f52.jpg",
"https://faceatlas.co/uploads/861de430-9133-4b44-bde7-e7d1d69c2d55.jpg",
"https://faceatlas.co/uploads/1bb5cf4a-dbd7-44f8-84f6-234e42cee92a.jpg",
"https://faceatlas.co/uploads/36889f7e-5b63-48cc-97f5-3485e39fc78a.jpg",
"https://faceatlas.co/uploads/abd234d4-15f7-4500-974d-7313474ea854.jpg",
"https://faceatlas.co/uploads/4af8ecb6-22f0-4d15-a9c1-d21a4f9c3365.jpg",
"https://faceatlas.co/uploads/05135d38-a424-45d0-ab5d-744c8664efcf.jpg",
"https://faceatlas.co/uploads/925698fc-56bd-4d07-878d-1cae7b1996b4.jpg",
"https://faceatlas.co/uploads/01c1e813-172a-463e-8845-1561be26d50a.jpg" }

for fileName in fileNames:
    q = {
    "query": {
        "match": {
            "file": fileName
            # find the docs those schould be deleted
        }
     },
    }
    result = es.delete_by_query(body=q, index=faces, doc_type='face')
    print('Result is : ', result)
