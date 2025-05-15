from models.dipendenti import get_employees
from database import get_db

db = get_db()

def test_connection():
    try:
        employees = get_employees()
        print("Connessione riuscita. Dipendenti trovati:")
        for employee in employees:
            print(employee)
        
        # Verifica i documenti nella collezione dipendenti_logi
        print("Documenti nella collezione dipendenti_logi:")
        for doc in db.dipendenti_logi.find():
            print(doc)
    except Exception as e:
        print("Errore nella connessione a MongoDB Atlas:", str(e))

if __name__ == "__main__":
    test_connection()