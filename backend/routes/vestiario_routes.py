from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from database import db

# Crea un'istanza di Blueprint
vestiario_blueprint = Blueprint("vestiario", __name__)

# Funzione per ottenere la collezione MongoDB
def get_vestiario_collection():
    from app import mongo
    return mongo.db.vestiario

def get_magazzino_collection():
    from app import mongo
    return mongo.db.magazzino

# Inserire più capi alla volta
@vestiario_blueprint.route("/bulk-insert", methods=["POST"])
def bulk_insert_vestiario():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"error": "Devi fornire un array di capi"}), 400

    vestiario_collection = get_vestiario_collection()
    magazzino_collection = get_magazzino_collection()

    try:
        for item in data:
            # Validazione dei campi
            if "tipo" not in item or "taglia" not in item or "quantita" not in item:
                return jsonify({"error": "Ogni capo deve avere tipo, taglia e quantita"}), 400

            # Inserisce nel vestiario
            vestiario_id = vestiario_collection.insert_one(item).inserted_id

            # Aggiorna il magazzino
            magazzino_collection.update_one(
                {"tipo": item["tipo"], "taglia": item["taglia"]},
                {"$inc": {"quantita": item["quantita"]}},
                upsert=True,
            )
        return jsonify({"message": "Capi inseriti con successo"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Visualizzare e filtrare il magazzino
@vestiario_blueprint.route("/magazzino", methods=["GET"])
def view_magazzino():
    try:
        magazzino_collection = get_magazzino_collection()

        # Filtri opzionali
        tipo = request.args.get("tipo")
        taglia = request.args.get("taglia")

        query = {}
        if tipo:
            query["tipo"] = tipo
        if taglia:
            query["taglia"] = taglia

        items = magazzino_collection.find(query)
        result = []
        for item in items:
            item["_id"] = str(item["_id"])
            result.append(item)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Assegnare un capo a un destinatario
@vestiario_blueprint.route("/assegna", methods=["POST"])
def assegna_capo():
    data = request.get_json()
    if not data or "tipo" not in data or "taglia" not in data or "quantita" not in data or "destinatario" not in data:
        return jsonify({"error": "Fornisci tipo, taglia, quantita e destinatario"}), 400

    magazzino_collection = get_magazzino_collection()

    try:
        # Controlla se ci sono abbastanza capi nel magazzino
        capo = magazzino_collection.find_one({"tipo": data["tipo"], "taglia": data["taglia"]})
        if not capo or capo["quantita"] < data["quantita"]:
            return jsonify({"error": "Quantità insufficiente in magazzino"}), 400

        # Aggiorna il magazzino
        magazzino_collection.update_one(
            {"tipo": data["tipo"], "taglia": data["taglia"]},
            {"$inc": {"quantita": -data["quantita"]}}
        )

        # Registra l'assegnazione (puoi creare una collezione per tracciare le assegnazioni)
        from app import mongo
        assegnazioni_collection = mongo.db.assegnazioni
        assegnazioni_collection.insert_one({
            "tipo": data["tipo"],
            "taglia": data["taglia"],
            "quantita": data["quantita"],
            "destinatario": data["destinatario"]
        })

        return jsonify({"message": "Capo assegnato con successo"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Aggiungere un nuovo capo
@vestiario_blueprint.route('/api/vestiario', methods=['POST'])
def add_vestiario():
    data = request.get_json()

    tipo = data.get('tipo')
    taglia = data.get('taglia')
    quantita = data.get('quantita')

    if not tipo or not taglia or not quantita:
        return jsonify({'error': 'Dati mancanti'}), 400

    # Inserimento nel database
    nuovo_vestiario = {
        'tipo': tipo,
        'taglia': taglia,
        'quantita': quantita
    }

    db.vestiario.insert_one(nuovo_vestiario)

    return jsonify({'message': 'Vestiario aggiunto con successo!'}), 201