import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-10 px-2">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl rounded-3xl p-8 flex flex-col items-center animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg mb-2">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white drop-shadow mb-1 tracking-tight">Welcome, {user.name || "User"}!</h2>
          <p className="text-white/80 text-sm">Manage your bulk email campaigns below.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Bulk Email Card */}
          <button
            className="bg-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer border border-white/40 focus:outline-none"
            onClick={() => navigate("/bulk-email")}
          >
            <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 8 8 0 1116 0 8 8 0 01-16 0z" /></svg>
            <h3 className="text-xl font-bold text-blue-700 mb-1">Send Bulk Emails</h3>
            <p className="text-blue-900/80 text-center text-sm">Send personalized emails to many recipients. Add emails one by one or upload a PDF to extract them.</p>
          </button>
          {/* Group Email Card */}
          <button
            className="bg-white/30 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer border border-white/40 focus:outline-none"
            onClick={() => navigate("/group-email")}
          >
            <svg className="w-10 h-10 text-pink-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-3.13a4 4 0 10-8 0 4 4 0 008 0zm-8 0a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
            <h3 className="text-xl font-bold text-pink-700 mb-1">Send in a Group</h3>
            <p className="text-pink-900/80 text-center text-sm">Create groups and send emails to all group members in one click (all in CC).</p>
          </button>
        </div>
        <button onClick={handleLogout} className="mt-10 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
