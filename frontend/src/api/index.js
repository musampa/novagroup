import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/magazzino";

export const inserisciMagazzino = async (dati) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/inserisci`, dati);
    return response.data;
  } catch (error) {
    console.error("Errore durante l'inserimento nel magazzino:", error);
    throw error;
  }
};