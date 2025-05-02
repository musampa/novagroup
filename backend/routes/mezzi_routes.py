from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

mezzi_blueprint = Blueprint("mezzi", __name__)

# MongoDB collection
def get_collection():
    from app import mongo
    return mongo.db.mezzi

# Crea un nuovo mezzo
@mezzi_blueprint.route("/", methods=["POST"])
def create_mezzo():
    data = request.get_json()
    mezzo_id = get_collection().insert_one(data).inserted_id
    return jsonify({"message": "Mezzo creato", "id": str(mezzo_id)}), 201

# Ottieni tutti i mezzi
@mezzi_blueprint.route("/", methods=["GET"])
def get_mezzi():
    mezzi = get_collection().find()
    return jsonify([mezzo for mezzo in mezzi])

# Aggiorna un mezzo
@mezzi_blueprint.route("/<id>", methods=["PUT"])
def update_mezzo(id):
    data = request.get_json()
    result = get_collection().update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count:
        return jsonify({"message": "Mezzo aggiornato"}), 200
    return jsonify({"error": "Mezzo non trovato"}), 404

# Elimina un mezzo
@mezzi_blueprint.route("/<id>", methods=["DELETE"])
def delete_mezzo(id):
    result = get_collection().delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Mezzo eliminato"}), 200
    return jsonify({"error": "Mezzo non trovato"}), 404