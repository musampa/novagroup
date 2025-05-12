from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

filiali_blueprint = Blueprint("filiali", __name__)

# MongoDB collection
def get_collection():
    from app import mongo
    return mongo.db.filiali


@filiali_blueprint.route("/", methods=["GET"])
def get_filiali():
    try:
        # Ottieni il parametro 'divisione' dalla query string
        divisione = request.args.get("divisione")
        query = {}

        # Filtra per divisione se specificato
        if divisione:
            query["divisione"] = divisione

        # Recupera le filiali dal database
        filiali = list(get_collection().find(query))
        response = [
            {
                "id": str(filiale["_id"]),
                "filiale_id": filiale.get("filiale_id"),
                "filiale_nome": filiale.get("filiale_nome"),
                "filiale_indirizzo": filiale.get("filiale_indirizzo"),
                "filiale_citta": filiale.get("filiale_citta"),
                "divisione": filiale.get("divisione"),
            }
            for filiale in filiali
        ]

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@filiali_blueprint.route("/<collezione>", methods=["GET"])
def get_filiali_by_collection(collezione):
    try:
        # Determina la collezione da utilizzare
        from app import mongo
        if collezione == "nova":
            collection = mongo.db.filiali_nova
        elif collezione == "logi":
            collection = mongo.db.filiali_logi
        else:
            return jsonify({"error": "Collezione non valida"}), 400

        # Recupera tutte le filiali dalla collezione specificata
        filiali = list(collection.find())
        response = [
            {
                "id": str(filiale["_id"]),
                "filiale_id": filiale.get("filiale_id"),
                "filiale_nome": filiale.get("filiale_nome"),
                "filiale_indirizzo": filiale.get("filiale_indirizzo"),
                "filiale_citta": filiale.get("filiale_citta"),
            }
            for filiale in filiali
        ]

        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@filiali_blueprint.route("/<collezione>", methods=["POST"])
def create_filiale(collezione):
    try:
        # Determina la collezione da utilizzare
        from app import mongo
        if collezione == "nova":
            collection = mongo.db.filiali_nova
        elif collezione == "logi":
            collection = mongo.db.filiali_logi
        else:
            return jsonify({"error": "Collezione non valida"}), 400

        # Ottieni i dati dal corpo della richiesta
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dati mancanti"}), 400

        # Inserisci la nuova filiale nella collezione
        filiale_id = collection.insert_one(data).inserted_id
        return jsonify({"message": "Filiale creata", "id": str(filiale_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Aggiorna una filiale
@filiali_blueprint.route("/<id>", methods=["PUT"])
def update_filiale(id):
    data = request.get_json()
    result = get_collection().update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "Filiale aggiornata"}), 200
    return jsonify({"error": "Filiale non trovata"}), 404

# Elimina una filiale
@filiali_blueprint.route("/<id>", methods=["DELETE"])
def delete_filiale(id):
    result = get_collection().delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Filiale eliminata"}), 200
    return jsonify({"error": "Filiale non trovata"}), 404