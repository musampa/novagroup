from pymongo import MongoClient
from config import MONGO_URI

# Configura la connessione a MongoDB Atlas
print(f"MongoDB URI: {MONGO_URI}")
client = MongoClient(MONGO_URI)
db = client['nuova']

def get_db():
        return db