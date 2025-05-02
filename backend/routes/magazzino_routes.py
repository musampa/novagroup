from flask import Blueprint, request, jsonify
from exstensions import mongo  # Importa mongo da extensions.py
from flask import current_app   

# Blueprint per le rotte del magazzino
magazzino_blueprint = Blueprint("magazzino", __name__)

@magazzino_blueprint.route("/inserisci", methods=["POST"])
def inserisci_capi():
    try:
        # Debug: Verifica lo stato di mongo
        print("Stato di mongo:", mongo)
        print("Database attivo:", mongo.db)

        # Ottieni i dati dalla richiesta
        dati = request.get_json()
        print("Dati ricevuti:", dati)

        capi = dati.get("capi", [])
        if not capi:
            return jsonify({"message": "Nessun capo fornito per l'inserimento."}), 400

        for capo in capi:
            tipo = capo.get("tipo")
            taglia = capo.get("taglia")
            quantita = capo.get("quantita", 0)

            if not tipo or not taglia or quantita <= 0:
                return jsonify({"message": "Dati non validi per uno o più capi."}), 400

            capo_esistente = mongo.db.vestiario.find_one({"tipo": tipo, "taglia": taglia})
            print("Capo esistente nel database:", capo_esistente)

            if capo_esistente:
                mongo.db.vestiario.update_one(
                    {"_id": capo_esistente["_id"]},
                    {"$inc": {"quantita_disponibile": quantita}}
                )
                print("Quantità aggiornata per il capo:", tipo, taglia)
            else:
                mongo.db.vestiario.insert_one({
                    "tipo": tipo,
                    "taglia": taglia,
                    "quantita_disponibile": quantita
                })
                print("Nuovo capo inserito nel database:", tipo, taglia)

        return jsonify({"message": "Capi inseriti correttamente."}), 201

    except Exception as e:
        print("Errore durante l'inserimento:", str(e))
        return jsonify({"message": "Errore durante l'inserimento dei capi.", "error": str(e)}), 500

@magazzino_blueprint.route("/assegna", methods=["POST"])
def assegna_capi():
    try:
        dati = request.get_json()
        filiale_id = dati.get("filiale_id")
        tipo = dati.get("tipo")
        taglia = dati.get("taglia")
        quantita = dati.get("quantita", 0)

        if not filiale_id or not tipo or not taglia or quantita <= 0:
            return jsonify({"message": "Dati non validi per l'assegnazione."}), 400

        # Verifica se il capo esiste nella collezione "vestiario"
        capo_esistente = mongo.db.vestiario.find_one({"tipo": tipo, "taglia": taglia})

        if not capo_esistente or capo_esistente.get("quantita_disponibile", 0) < quantita:
            return jsonify({"message": "Quantità insufficiente nel magazzino."}), 400

        # Riduci la quantità nella collezione "vestiario"
        mongo.db.vestiario.update_one(
            {"_id": capo_esistente["_id"]},
            {"$inc": {"quantita_disponibile": -quantita}}
        )

        # Registra l'assegnazione nella collezione "magazzino"
        mongo.db.magazzino.insert_one({
            "filiale_id": filiale_id,
            "tipo": tipo,
            "taglia": taglia,
            "quantita": quantita
        })

        return jsonify({"message": "Capo assegnato correttamente."}), 201

    except Exception as e:
        return jsonify({"message": "Errore durante l'assegnazione dei capi.", "error": str(e)}), 500