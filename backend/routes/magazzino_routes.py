from flask import Flask
from flask_pymongo import PyMongo
from bson.json_util import dumps
from routes.filiali_routes import filiali_blueprint
from routes.dipendenti_routes import dipendenti_blueprint
from routes.vestiario_routes import vestiario_blueprint
from routes.mezzi_routes import mezzi_blueprint
from flask import Blueprint
from exstensions import mongo

from flask import Blueprint

# Definizione del blueprint
magazzino_blueprint = Blueprint('magazzino', __name__)

# Esempio di rotta nel blueprint
@magazzino_blueprint.route('/example')
def example_endpoint():
    return {"message": "Esempio di endpoint per il magazzino"}

@magazzino_blueprint.route('/inserisci', methods=['POST'])
def inserisci_magazzino():
    from flask import request
    try:
        # Recupera i dati dal corpo della richiesta
        dati = request.get_json()
        if not dati:
            return {"message": "Dati mancanti"}, 400

        # Inserisce i dati nella collezione "magazzino"
        mongo.db.magazzino.insert_many(dati)
        return {"message": "Dati inseriti con successo"}, 201
    except Exception as e:
        return {"message": "Errore durante l'inserimento", "error": str(e)}, 500

app = Flask(__name__)

# Configurazione MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/nuova"  # Modifica in base alla tua configurazione
mongo = PyMongo(app)

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