from pymongo import MongoClient

# Configura la connessione a MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['nuova']

def get_db():
        return db