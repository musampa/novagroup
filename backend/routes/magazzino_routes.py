from flask import Flask
from flask_pymongo import PyMongo
from bson.json_util import dumps
from routes.filiali_routes import filiali_blueprint
from routes.dipendenti_routes import dipendenti_blueprint
from routes.vestiario_routes import vestiario_blueprint
from routes.mezzi_routes import mezzi_blueprint
from flask import Blueprint
from exstensions import mongo
from datetime import datetime
from bson.objectid import ObjectId
from flask import jsonify

from flask import Blueprint

# Definizione del blueprint
magazzino_blueprint = Blueprint('magazzino', __name__)

# Esempio di rotta nel blueprint
@magazzino_blueprint.route('/example')
def example_endpoint():
    return {"message": "Esempio di endpoint per il magazzino"}

@magazzino_blueprint.route('/inserisci', methods=['POST'])
def inserisci_magazzino():
    from flask import request
    from datetime import datetime
    try:
        dati = request.get_json()
        if not dati:
            return {"message": "Dati mancanti"}, 400

        for record in dati:
            if "quantita" in record:
                try:
                    record["quantita"] = int(record["quantita"])
                except (ValueError, TypeError):
                    return {"message": "Errore: il campo 'quantita' deve essere un numero valido."}, 400
            record['dataInserimento'] = datetime.utcnow()

        # Inserisci in magazzino_logi o magazzino_nova in base alla divisione
        logi = [r for r in dati if r.get('divisione') == 'logi']
        nova = [r for r in dati if r.get('divisione') == 'nova']
        if logi:
            mongo.db.magazzino_logi.insert_many(logi)
        if nova:
            mongo.db.magazzino_nova.insert_many(nova)
        return {"message": "Dati inseriti con successo"}, 201
    except Exception as e:
        return {"message": "Errore durante l'inserimento", "error": str(e)}, 500

@magazzino_blueprint.route('/inserisci-vestiario', methods=['POST'])
def inserisci_vestiario():
    from flask import request
    from datetime import datetime
    try:
        print("Endpoint '/inserisci-vestiario' chiamato")  # Log per debug
        dati = request.get_json()
        if not dati:
            return {"message": "Dati mancanti"}, 400

        # Inserimento per divisione
        dati_logi = []
        dati_nova = []
        for record in dati:
            record["dataAssegnazione"] = datetime.utcnow()
            record['dataInserimento'] = datetime.utcnow()
            divisione = record.get("divisione")
            if divisione == "logi":
                dati_logi.append(record)
            elif divisione == "nova":
                dati_nova.append(record)
            else:
                return {"message": f"Divisione non valida: {divisione}"}, 400

        if dati_logi:
            mongo.db.magazzino_logi.insert_many(dati_logi)
        if dati_nova:
            mongo.db.magazzino_nova.insert_many(dati_nova)

        return {"message": "Vestiario inserito con successo"}, 201
    except Exception as e:
        return {"message": "Errore durante l'inserimento del vestiario", "error": str(e)}, 500

@magazzino_blueprint.route('/nova', methods=['GET'])
def get_magazzino_nova():
    try:
        dati_nova = list(mongo.db.magazzino_nova.find({}))
        for elemento in dati_nova:
            if "dataInserimento" in elemento:
                elemento["dataInserimento"] = elemento["dataInserimento"].isoformat() if isinstance(elemento["dataInserimento"], datetime) else elemento["dataInserimento"]
        return dumps(dati_nova), 200
    except Exception as e:
        return {"message": "Errore durante il recupero dei dati del magazzino Nova", "error": str(e)}, 500

@magazzino_blueprint.route('/logi', methods=['GET'])
def get_magazzino_logi():
    try:
        dati_logi = list(mongo.db.magazzino_logi.find({}))
        for elemento in dati_logi:
            if "dataInserimento" in elemento:
                elemento["dataInserimento"] = elemento["dataInserimento"].isoformat() if isinstance(elemento["dataInserimento"], datetime) else elemento["dataInserimento"]
        return dumps(dati_logi), 200
    except Exception as e:
        return {"message": "Errore durante il recupero dei dati del magazzino Logi", "error": str(e)}, 500

@magazzino_blueprint.route('/assegna-vestiario', methods=['POST'])
def assegna_vestiario():
    from flask import request
    try:
        elemento = request.get_json()
        print("Dati ricevuti:", elemento)  # Log per debug
        if not elemento:
            return {"message": "Dati mancanti"}, 400

        tipo = elemento.get("tipo")
        taglia = elemento.get("taglia")
        quantita = int(elemento.get("quantita"))  # Converto la quantità in intero
        divisione = elemento.get("divisione")
        filiale = elemento.get("filiale")

        if not all([tipo, taglia, quantita, divisione, filiale]):
            return {"message": "Campi mancanti"}, 400

        # Verifica che il campo 'quantita' nel database sia numerico
        magazzino = mongo.db.magazzino
        documento = magazzino.find_one({"tipo": tipo, "taglia": taglia, "divisione": divisione})
        print("Documento trovato nel magazzino:", documento)  # Log per debug
        if documento:
            if not isinstance(documento.get("quantita"), (int, float)):
                try:
                    documento["quantita"] = int(documento["quantita"])
                    print("Convertito 'quantita' in intero:", documento["quantita"])  # Log per debug
                    # Aggiorna il campo 'quantita' nel database se necessario
                    magazzino.update_one(
                        {"_id": documento["_id"]},
                        {"$set": {"quantita": documento["quantita"]}}
                    )
                    print("Campo 'quantita' aggiornato nel database.")
                except ValueError:
                    print("Errore: impossibile convertire 'quantita' in intero. Valore:", documento["quantita"])  # Log per debug
                    return {"message": "Errore: il campo 'quantita' nel database non è numerico e non può essere convertito"}, 500

        # Controlla se la quantità richiesta è disponibile
        if documento.get("quantita", 0) < quantita:
            print("Errore: quantità insufficiente. Disponibile:", documento.get("quantita"), "Richiesta:", quantita)  # Log per debug
            return {"message": "Errore: quantità insufficiente nel magazzino"}, 400

        # Aggiorna la giacenza nel magazzino CORRETTO
        try:
            if divisione == "logi":
                magazzino = mongo.db.magazzino_logi
            elif divisione == "nova":
                magazzino = mongo.db.magazzino_nova
            else:
                return {"message": f"Divisione non valida: {divisione}"}, 400

            result = magazzino.update_one(
                {"tipo": tipo, "taglia": taglia},
                {"$inc": {"quantita": -quantita}}
            )
            print("Risultato dell'aggiornamento:", result.raw_result)  # Log per debug
        except Exception as update_error:
            print("Errore durante l'aggiornamento della giacenza:", str(update_error))  # Log per debug
            return {"message": "Errore durante l'aggiornamento della giacenza", "error": str(update_error)}, 500

        # Registra l'assegnazione
        assegnazione = {
            "tipo": tipo,
            "taglia": taglia,
            "quantita": quantita,
            "divisione": divisione,
            "filiale": filiale,
            "dataAssegnazione": datetime.utcnow()
        }

        # Inserisce l'assegnazione nella collezione `vestiario_assegnato`
        try:
            insert_result = mongo.db.vestiario_assegnato.insert_one(assegnazione)
            print("Risultato dell'inserimento:", insert_result.inserted_id)  # Log per debug
        except Exception as insert_error:
            print("Errore durante l'inserimento dell'assegnazione:", str(insert_error))  # Log per debug
            return {"message": "Errore durante l'inserimento dell'assegnazione", "error": str(insert_error)}, 500

        return {"message": "Assegnazione completata"}, 201
    except Exception as e:
        print("Errore durante l'assegnazione:", str(e))  # Log per debug
        return {"message": "Errore durante l'assegnazione", "error": str(e)}, 500

@magazzino_blueprint.route('/disponibilita', methods=['GET'])
def get_disponibilita_magazzino():
    from flask import request
    divisione = request.args.get('divisione')
    tipo = request.args.get('tipo')
    taglia = request.args.get('taglia')

    if not divisione:
        return {"error": "Divisione non specificata"}, 400

    try:
        # Filtra la collection corretta in base alla divisione
        query = {"divisione": divisione}
        if tipo:
            query["tipo"] = tipo
        if taglia:
            query["taglia"] = taglia

        magazzino_collection = mongo.db.magazzino
        disponibilita = list(magazzino_collection.find(query, {"_id": 0}))

        return dumps(disponibilita), 200
    except Exception as e:
        return {"error": str(e)}, 500

@magazzino_blueprint.route('/vestiario_assegnato', methods=['GET'])
def get_vestiario_assegnato():
    try:
        # Recupera tutte le assegnazioni dalla collezione `vestiario_assegnato` (includi _id)
        assegnazioni = list(mongo.db.vestiario_assegnato.find({}))

        # Formatta le date e l'_id come stringa
        for assegnazione in assegnazioni:
            if "dataAssegnazione" in assegnazione:
                assegnazione["dataAssegnazione"] = assegnazione["dataAssegnazione"].isoformat() if isinstance(assegnazione["dataAssegnazione"], datetime) else assegnazione["dataAssegnazione"]
            if "_id" in assegnazione:
                assegnazione["_id"] = str(assegnazione["_id"])

        return dumps(assegnazioni), 200
    except Exception as e:
        print("Errore durante il recupero delle assegnazioni:", str(e))  # Log per debug
        return {"message": "Errore durante il recupero delle assegnazioni", "error": str(e)}, 500

@magazzino_blueprint.route('/vestiario_assegnato/<id>', methods=['DELETE'])
def delete_vestiario_assegnato(id):
    from flask import request
    import traceback
    try:
        # Recupera l'assegnazione da eliminare
        assegnazione = mongo.db.vestiario_assegnato.find_one({'_id': ObjectId(id)})
        if not assegnazione:
            return jsonify({"message": "Assegnazione non trovata", "id": id}), 404

        # Recupera i dati necessari
        tipo = assegnazione.get('tipo')
        taglia = assegnazione.get('taglia')
        quantita = int(assegnazione.get('quantita', 0))
        divisione = assegnazione.get('divisione')

        # Cancella l'assegnazione
        mongo.db.vestiario_assegnato.delete_one({'_id': ObjectId(id)})

        # Aggiorna la giacenza nella collection corretta
        if divisione == 'logi':
            magazzino = mongo.db.magazzino_logi
        elif divisione == 'nova':
            magazzino = mongo.db.magazzino_nova
        else:
            return jsonify({"message": f"Divisione non valida: {divisione}", "id": id}), 400

        magazzino.update_one(
            {"tipo": tipo, "taglia": taglia},
            {"$inc": {"quantita": quantita}},
            upsert=True
        )

        return jsonify({"message": "Assegnazione eliminata e giacenza aggiornata", "id": id}), 200
    except Exception as e:
        print("[ERRORE DELETE]", traceback.format_exc())
        return jsonify({"message": "Errore durante la cancellazione dell'assegnazione", "error": str(e), "id": id}), 500