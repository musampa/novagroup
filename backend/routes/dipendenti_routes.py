from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

dipendenti_blueprint = Blueprint("dipendenti", __name__)

# MongoDB collection
def get_collection():
    from app import mongo
    return mongo.db.dipendenti

# Crea un nuovo dipendente
@dipendenti_blueprint.route("/", methods=["POST"])
def create_dipendente():
    data = request.get_json()
    dipendente_id = get_collection().insert_one(data).inserted_id
    return jsonify({"message": "Dipendente creato", "id": str(dipendente_id)}), 201

# Ottieni tutti i dipendenti
@dipendenti_blueprint.route("/", methods=["GET"])
def get_dipendenti():
    dipendenti = get_collection().find()
    return jsonify([dipendente for dipendente in dipendenti])

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