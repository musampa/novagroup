from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

# Crea un'istanza di Blueprint
mezzi_blueprint = Blueprint("mezzi", __name__)

# Funzione per ottenere la collezione MongoDB
def get_mezzi_collection():
    from app import mongo
    return mongo.db.mezzi

# Creazione di un nuovo mezzo
@mezzi_blueprint.route("/", methods=["POST"])
def create_mezzo():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Dati non forniti"}), 400

    # Validazione dei campi richiesti
    required_fields = ["tipo", "matricola", "stato", "filiale"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Campi mancanti: {', '.join(missing_fields)}"}), 400

    if data["stato"] not in ["Funzionante", "Non Funzionante"]:
        return jsonify({"error": "Il campo 'stato' deve essere 'Funzionante' o 'Non Funzionante'"}), 400

    try:
        mezzo_id = get_mezzi_collection().insert_one(data).inserted_id
        return jsonify({"message": "Mezzo creato con successo", "id": str(mezzo_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Cancellazione di un mezzo tramite ID
@mezzi_blueprint.route("/<id>", methods=["DELETE"])
def delete_mezzo(id):
    try:
        result = get_mezzi_collection().delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Mezzo non trovato"}), 404
        return jsonify({"message": "Mezzo cancellato con successo"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Visualizzazione di tutti i mezzi
@mezzi_blueprint.route("/", methods=["GET"])
def get_mezzi():
    try:
        mezzi = get_mezzi_collection().find()
        result = []
        for mezzo in mezzi:
            mezzo["_id"] = str(mezzo["_id"])
            result.append(mezzo)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Visualizzazione di un mezzo tramite ID
@mezzi_blueprint.route("/<id>", methods=["GET"])
def get_mezzo_by_id(id):
    try:
        mezzo = get_mezzi_collection().find_one({"_id": ObjectId(id)})
        if not mezzo:
            return jsonify({"error": "Mezzo non trovato"}), 404
        mezzo["_id"] = str(mezzo["_id"])
        return jsonify(mezzo), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500