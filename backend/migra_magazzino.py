# Script per migrare i documenti dalla collection 'magazzino' a 'magazzino_logi' e 'magazzino_nova' in base al campo 'divisione'.
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Carica variabili d'ambiente
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)
MONGO_URI = os.getenv('MONGO_URI')

client = MongoClient(MONGO_URI)
db = client.get_default_database()  # Usa il database specificato nella URI

magazzino = db['magazzino']
magazzino_logi = db['magazzino_logi']
magazzino_nova = db['magazzino_nova']

# Trova tutti i documenti nella collection magazzino
for doc in magazzino.find():
    divisione = doc.get('divisione')
    # Rimuovi l'_id per evitare duplicati
    doc.pop('_id', None)
    if divisione == 'logi':
        magazzino_logi.insert_one(doc)
    elif divisione == 'nova':
        magazzino_nova.insert_one(doc)
    else:
        print(f"Divisione non riconosciuta per il documento: {doc}")

print("Migrazione completata. I documenti sono stati spostati nelle rispettive collection.")