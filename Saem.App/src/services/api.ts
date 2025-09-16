// src/services/api.ts
import axios from "axios";
import type { Anexo1Data } from "../types";

// URL base de tu API .NET (ajusta según tu swagger o backend)
const API_URL = "http://172.5.20.5:5007/ServiciosSAEM/api/Anexo1"; 

export const saveAnexo1 = async (payload: Anexo1Data) => {
  try {
    const response = await axios.post(`${API_URL}/anexo1`, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error al guardar Anexo I", error);
    throw error;
  }
};
