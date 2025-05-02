from flask import Blueprint, request, jsonify

# Crea un'istanza di Blueprint
vestiario_blueprint = Blueprint("vestiario", __name__)

# MongoDB collection (aggiungi la configurazione corretta)
def get_collection():
    from app import mongo
    return mongo.db.vestiario

# Endpoint di esempio per creare un articolo di vestiario
@vestiario_blueprint.route("/", methods=["POST"])
def create_vestiario():
    data = request.get_json()
    item_id = get_collection().insert_one(data).inserted_id
    return jsonify({"message": "Elemento di vestiario creato", "id": str(item_id)}), 201

# Endpoint di esempio per ottenere tutti gli articoli di vestiario
@vestiario_blueprint.route("/", methods=["GET"])
def get_vestiario():
    items = get_collection().find()
    return jsonify([item for item in items])