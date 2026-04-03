import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Pro-Tasker</h1>

        <div className="flex gap-6 items-center">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-pink-100 transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/projects/new"
                className="text-white hover:text-pink-100 transition font-medium"
              >
                New Project
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-pink-100 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-pink-100 transition font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}