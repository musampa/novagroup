/**
 * Recupera la lista dei dipendenti dal backend.
 * @param {string} divisione - Opzionale, specifica la divisione (es. "nova").
 * @returns {Promise<Array>} - Lista dei dipendenti.
 */
export async function fetchEmployees(divisione) {
    const url = divisione
      ? `/api/dipendenti?divisione=${divisione}`
      : `/api/dipendenti`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Errore nel recupero dei dipendenti");
    }
    return await response.json();
  }