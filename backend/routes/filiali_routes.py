from flask import Blueprint, request, jsonify
from database import db
from bson.objectid import ObjectId

filiali_blueprint = Blueprint('filiali_routes', __name__)

@filiali_blueprint.route('/', methods=['GET'])
def get_filiali():
    divisione = request.args.get('divisione')

    if not divisione:
        return jsonify({"error": "Divisione non specificata"}), 400

    try:
        # Determina la collection corretta in base alla divisione
        collection_name = f"filiali_{divisione}"
        filiali_collection = db[collection_name]

        # Recupera tutte le filiali dalla collection
        filiali = list(filiali_collection.find({}, {"_id": 0}))

        return jsonify(filiali), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@filiali_blueprint.route("/<collezione>", methods=["GET"])
def get_filiali_by_collection(collezione):
    try:
        # Determina la collezione da utilizzare
        if collezione == "nova":
            collection = db.filiali_nova
        elif collezione == "logi":
            collection = db.filiali_logi
        else:
            return jsonify({"error": "Collezione non valida"}), 400

        # Recupera tutte le filiali dalla collezione specificata
        filiali = list(collection.find())
        response = [
            {
                "id": str(filiale["_id"]),
                "filiale_id": filiale.get("filiale_id"),
                "filiale_nome": filiale.get("filiale_nome"),
                "filiale_cantiere": filiale.get("filiale_cantiere"),
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
        if collezione == "nova":
            collection = db.filiali_nova
            other_collection = db.filiali_logi
        elif collezione == "logi":
            collection = db.filiali_logi
            other_collection = db.filiali_nova
        else:
            return jsonify({"error": "Collezione non valida"}), 400

        # Ottieni i dati dal corpo della richiesta
        data = request.get_json()
        if not data:
            return jsonify({"error": "Dati mancanti"}), 400

        # Calcola il nuovo filiale_id univoco tra entrambe le collezioni
        last_nova = db.filiali_nova.find_one(sort=[("filiale_id", -1)])
        last_logi = db.filiali_logi.find_one(sort=[("filiale_id", -1)])
        max_id = 0
        if last_nova and last_nova.get("filiale_id"):
            try:
                max_id = max(max_id, int(last_nova["filiale_id"]))
            except Exception:
                pass
        if last_logi and last_logi.get("filiale_id"):
            try:
                max_id = max(max_id, int(last_logi["filiale_id"]))
            except Exception:
                pass
        nuovo_id = str(max_id + 1)
        data["filiale_id"] = nuovo_id

        # Inserisci la nuova filiale nella collezione
        filiale_id = collection.insert_one(data).inserted_id
        return jsonify({"message": "Filiale creata", "id": str(filiale_id), "filiale_id": nuovo_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@filiali_blueprint.route("/<collezione>/<id>", methods=["PUT"])
def update_filiale(collezione, id):
    if collezione == "nova":
        collection = db.filiali_nova
    elif collezione == "logi":
        collection = db.filiali_logi
    else:
        return jsonify({"error": "Collezione non valida"}), 400
    data = request.get_json()
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "Filiale aggiornata"}), 200
    return jsonify({"error": "Filiale non trovata"}), 404

@filiali_blueprint.route("/<collezione>/<id>", methods=["DELETE"])
def delete_filiale(collezione, id):
    if collezione == "nova":
        collection = db.filiali_nova
    elif collezione == "logi":
        collection = db.filiali_logi
    else:
        return jsonify({"error": "Collezione non valida"}), 400
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Filiale eliminata"}), 200
    return jsonify({"error": "Filiale non trovata"}), 404