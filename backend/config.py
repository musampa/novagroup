from dotenv import load_dotenv
import os

# Carica le variabili d'ambiente dal file .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Log per verificare il valore di MONGO_URI
print(f"MONGO_URI caricato: {MONGO_URI}")