import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await API.post("/auth/login", { email, password });
      const userData = { name: response.data.name, email: response.data.email };
      const token = response.data.token;
      
      login(userData, token);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Check your email and password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Login</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white bg-gray-700 placeholder-gray-400"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white bg-gray-700 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition mt-6"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-pink-400 hover:text-pink-300 font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}