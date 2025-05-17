from flask import Flask
from flask_pymongo import PyMongo
from routes.filiali_routes import filiali_blueprint
from routes.dipendenti_routes import dipendenti_blueprint
from routes.vestiario_routes import vestiario_blueprint
from routes.magazzino_routes import magazzino_blueprint
from routes.mezzi_routes import mezzi_blueprint
from exstensions import mongo  # Importa mongo correttamente dal modulo extensions
from flask_cors import CORS  # Importa CORS
from config import MONGO_URI  # <--- Usa la variabile d'ambiente

app = Flask(__name__)

# Permetti richieste da http://localhost:5173
CORS(app, origins=["http://localhost:5173"])

# Configurazione MongoDB: usa sempre la variabile d'ambiente (Atlas se .env è configurato)
app.config["MONGO_URI"] = MONGO_URI

# Inizializza mongo
mongo.init_app(app)

# Log per verificare la connessione
with app.app_context():
    print("MongoDB URI:", app.config["MONGO_URI"])
    print("Database attivo:", mongo.db)

# Inizializza i blueprint per ogni entità
app.register_blueprint(filiali_blueprint, url_prefix="/api/filiali")
app.register_blueprint(dipendenti_blueprint, url_prefix="/api/dipendenti")
app.register_blueprint(vestiario_blueprint, url_prefix="/api/vestiario")
app.register_blueprint(magazzino_blueprint, url_prefix="/api/magazzino")
app.register_blueprint(mezzi_blueprint, url_prefix="/api/mezzi")

@app.route("/test-connessione")
def test_connessione():
    try:
        # Esegui una semplice operazione sul database
        mongo.db.command("ping")
        return {"message": "Connessione al database riuscita!"}, 200
    except Exception as e:
        return {"message": "Errore di connessione al database", "error": str(e)}, 500

# Endpoint di test
@app.route("/")
def index():
    return {"message": "API azienda attiva"}

if __name__ == "__main__":
    app.run(debug=True)