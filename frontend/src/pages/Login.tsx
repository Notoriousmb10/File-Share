import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          Welcome Back
        </h2>
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 text-sm flex items-start"
            role="alert"
          >
            <span className="flex-1">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2 ml-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-200 outline-none text-gray-700 bg-gray-50 focus:bg-white"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2 ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors duration-200 outline-none text-gray-700 bg-gray-50 focus:bg-white"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex items-center justify-center mt-6">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
      <p className="fixed bottom-4 text-xs text-gray-400 text-center max-w-xs sm:max-w-none">
        Backend startup might take a moment.
      </p>
    </div>
  );
};

export default Login;
