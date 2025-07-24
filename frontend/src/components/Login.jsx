import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed. Try again."
      );
    }
    setLoading(false);
  };

  // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg mb-2">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm0 0c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm0 0v2m0 4h.01" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow mb-1 tracking-tight">Sign In</h2>
          <p className="text-white/80 text-sm">Welcome back! Please login to your account.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            className="w-full px-4 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-500 text-gray-800 shadow-sm transition"
          />
          <input
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            type="password"
            className="w-full px-4 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-500 text-gray-800 shadow-sm transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            {loading ? (
              <span className="animate-pulse">Logging in...</span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
          <span className="mx-3 text-white/70 font-semibold">or</span>
          <div className="flex-grow h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
        </div>
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={handleGoogleSuccess}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 transition border border-gray-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.99 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.49l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.6c-2.01 1.35-4.6 2.16-8.71 2.16-6.44 0-11.87-4.49-13.33-10.49l-7.98 6.2C6.71 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            <span>Sign in with Google</span>
          </button>
        </div>
        <div className="text-center text-sm text-white/80">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pink-200 hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
