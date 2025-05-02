from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId

filiali_blueprint = Blueprint("filiali", __name__)

# MongoDB collection
def get_collection():
    from app import mongo
    return mongo.db.filiali

# Crea una nuova filiale
@filiali_blueprint.route("/", methods=["POST"])
def create_filiale():
    data = request.get_json()
    filiale_id = get_collection().insert_one(data).inserted_id
    return jsonify({"message": "Filiale creata", "id": str(filiale_id)}), 201

# Ottieni tutte le filiali
@filiali_blueprint.route("/", methods=["GET"])
def get_filiali():
    filiali = get_collection().find()
    return jsonify([filiale for filiale in filiali])

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