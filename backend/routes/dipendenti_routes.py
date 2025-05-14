from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

dipendenti_blueprint = Blueprint("dipendenti", __name__)

# MongoDB collection
def get_collection():
    from app import mongo
    return mongo.db.dipendenti

@dipendenti_blueprint.route("/", methods=["POST"])
def create_dipendente():
    try:
        data = request.get_json()
        print("Dati ricevuti:", data)  # Log dei dati ricevuti


        # Controlla che i campi obbligatori siano presenti
        required_fields = ["cognome", "nome", "mansione", "divisione", "filiale_id"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Campo mancante: {field}"}), 400

        # Inserisci il dipendente
        dipendente_id = get_collection().insert_one(data).inserted_id
        print("Dipendente creato con ID:", dipendente_id)  # Log dell'ID creato
        return jsonify({"message": "Dipendente creato", "id": str(dipendente_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@dipendenti_blueprint.route("/", methods=["GET"])
def get_dipendenti():
    try:
        # Ottieni il parametro 'divisione' dalla query string
        divisione = request.args.get("divisione")

        from app import mongo

        # Seleziona la collezione appropriata in base alla divisione
        if divisione == "logi":
            collection = mongo.db.dipendenti_logi
        elif divisione == "nova":
            collection = mongo.db.dipendenti_nova
        else:
            return jsonify({"error": "Divisione non valida"}), 400

        # Recupera i dati direttamente dalla collezione
        dipendenti = list(collection.find({}, {"_id": 1, "cognome": 1, "nome": 1, "mansione": 1, "divisione": 1, "filiale_nome": 1}))

        # Prepara la risposta JSON
        response = [
            {
                "id": str(dipendente["_id"]),
                "cognome": dipendente.get("cognome"),
                "nome": dipendente.get("nome"),
                "mansione": dipendente.get("mansione"),
                "divisione": dipendente.get("divisione"),
                "filiale_nome": dipendente.get("filiale_nome", "Sconosciuta")
            }
            for dipendente in dipendenti
        ]

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Gestisci eventuali errori
    
# Aggiorna un dipendente
@dipendenti_blueprint.route("/<id>", methods=["PUT"])
def update_dipendente(id):
    data = request.get_json()
    result = get_collection().update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "Dipendente aggiornato"}), 200
    return jsonify({"error": "Dipendente non trovato"}), 404

# Elimina un dipendente
@dipendenti_blueprint.route("/<id>", methods=["DELETE"])
def delete_dipendente(id):
    result = get_collection().delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Dipendente eliminato"}), 200
    return jsonify({"error": "Dipendente non trovato"}), 404