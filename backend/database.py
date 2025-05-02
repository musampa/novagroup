from pymongo import MongoClient

# Configura la connessione a MongoDB
def get_db():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['nuova']
    return db