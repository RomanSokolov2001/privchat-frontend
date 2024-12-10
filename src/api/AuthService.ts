import axios from "axios";
import { IP } from "../types";

const BASE_URL = `http://${IP}`;
axios.defaults.withCredentials = true;

export interface LoginUserDto {
  nickname: string;
  password: string;
}

export interface RegisterUserDto {
  nickname: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export const AuthService = {
  async enterPool() {
    const response = await axios.get(`${BASE_URL}/pool/enter`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data; 
  },

  async getAuthenticatedUser() {
    const response = await axios.get(`${BASE_URL}/messenger/me`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });
    return response.data;
  }
};
