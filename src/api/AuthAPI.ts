import axios from "axios";
import { BASE_URL } from "../config";
axios.defaults.withCredentials = true;


export const AuthAPI = {
  async enterPool() {
    const response = await axios.get(`${BASE_URL}/pool/enter`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data; 
  }
};