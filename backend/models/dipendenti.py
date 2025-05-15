from database import get_db

db = get_db()

# Modello per i dipendenti
def create_employee(data):
    return db.employees.insert_one(data)

def get_employees(filter={}):
    divisione = filter.get("divisione")
    if divisione == "logi":
        return list(db.dipendenti_logi.find(filter))
    elif divisione == "nova":
        return list(db.dipendenti_nova.find(filter))
    else:
        # Se vuoi tutti i dipendenti da entrambe le collezioni
        return list(db.dipendenti_logi.find(filter)) + list(db.dipendenti_nova.find(filter))

def update_employee(employee_id, update_data):
    return db.employees.update_one({'_id': employee_id}, {'$set': update_data})

def delete_employee(employee_id):
    return db.employees.delete_one({'_id': employee_id})