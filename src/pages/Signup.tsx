import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../api/AuthService"; // Import AuthService for API call
import axios from "axios";

const Signup: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null); // State for handling errors
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await AuthService.signup({ nickname, email, password }); // Call AuthService signup
            alert("Signup successful! Please log in.");
            navigate("/"); // Redirect to login page
        } catch (err) {
            console.error("Signup failed:", err);
            setError("Signup failed. Please try again.");
        }
    };

    const doTest = async () => {

        try {
            const response = await axios.get(`http://localhost:8080/auth/test`, {
                headers: {
                    'Content-Type': 'application/json',
            }});

            console.log(`Data: ${response.data}`)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
                {error && <p className="text-center text-red-500">{error}</p>}
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
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Email"
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
                    Sign Up
                </button>
                <p className="text-center">
                    Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
