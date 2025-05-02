from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/nuova"

mongo = PyMongo(app)

with app.app_context():
    print("Connessione al database:", mongo.db)
    print("Collezioni disponibili:", mongo.db.list_collection_names())