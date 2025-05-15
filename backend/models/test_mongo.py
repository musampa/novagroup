from models.dipendenti import get_employees

def test_connection():
    try:
        employees = get_employees()
        print("Connessione riuscita. Dipendenti trovati:")
        for employee in employees:
            print(employee)
    except Exception as e:
        print("Errore nella connessione a MongoDB Atlas:", str(e))

if __name__ == "__main__":
    test_connection()