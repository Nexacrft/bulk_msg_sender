import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      toast.success("Email verified! You can now login.");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "OTP verification failed."
      );
    }
    setLoading(false);
  };

  if (!email) {
    return <div className="text-center text-lg text-red-500 mt-10">No email provided for verification.</div>;
  }

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg mb-2">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow mb-1 tracking-tight">Verify OTP</h2>
          <p className="text-white/80 text-sm text-center">Enter the OTP sent to <span className="font-semibold text-pink-200">{email}</span></p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-500 text-gray-800 shadow-sm transition text-center tracking-widest text-lg"
            maxLength={6}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            {loading ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              "Verify"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;
