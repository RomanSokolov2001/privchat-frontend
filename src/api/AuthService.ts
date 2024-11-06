import axios from "axios";

const BASE_URL = "http://localhost:8080";
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
  async signup(data: RegisterUserDto) {
    const response = await axios.post(`${BASE_URL}/auth/signup`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data; 
  },

  async login(data: LoginUserDto) {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const { token, expiresIn } = response.data;
    sessionStorage.setItem("authToken", token);
    return { token, expiresIn };
  },

  async getAuthenticatedUser() {
    const response = await axios.get(`${BASE_URL}/messenger/me`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
    });
    return response.data;
  }
};
