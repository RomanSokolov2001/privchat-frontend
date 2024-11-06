import React, { useState } from "react";
import { AuthService } from "../api/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import DiffieHellmanService from "../api/DiffieHellmanService";

const Login: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { setUser, user } = useUser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credentials = await AuthService.login({ nickname, password });
      const {publicKey, secret} = DiffieHellmanService.handleGenerateKeys()
      setUser({ jwt: credentials.token, nickname, publicKey, secretKey: String(secret) });

      
      navigate("/messenger");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed, please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <div>
          <label className="block text-sm font-medium">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Nickname"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
          Login
        </button>
        <p className="text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;