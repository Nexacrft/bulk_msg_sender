import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-4 py-10">
      <div className="max-w-4xl w-full bg-white/30 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl flex flex-col md:flex-row items-center p-8 md:p-16 animate-fade-in">
        {/* Illustration */}
        <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0 md:mr-12">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg mb-6">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 8 8 0 1116 0 8 8 0 01-16 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4 text-center md:text-left">Bulk Email Sender & Group Manager</h1>
          <p className="text-white/90 text-lg mb-6 text-center md:text-left max-w-lg">Send personalized emails to hundreds of recipients in one go, manage your contacts with groups, and streamline your communication—all with a beautiful, easy-to-use interface.</p>
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 rounded-lg bg-white/80 text-pink-700 font-bold shadow-lg hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg border border-pink-200"
            >
              Sign Up
            </button>
          </div>
        </div>
        {/* Features List */}
        <div className="flex-1 flex flex-col items-center md:items-start mt-8 md:mt-0">
          <div className="bg-white/60 rounded-2xl shadow-inner p-6 w-full max-w-xs">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Key Features</h2>
            <ul className="space-y-3 text-blue-900/90 text-base">
              <li className="flex flex-row items-center gap-3">
                <span className="inline-flex min-w-[1.5rem] min-h-[1.5rem] bg-gradient-to-br from-blue-400 to-pink-400 rounded-full items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 8 8 0 1116 0 8 8 0 01-16 0z" /></svg>
                </span>
                <span>Send bulk personalized emails</span>
              </li>
              <li className="flex flex-row items-center gap-3">
                <span className="inline-flex min-w-[1.5rem] min-h-[1.5rem] bg-gradient-to-br from-pink-400 to-blue-400 rounded-full items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87" /></svg>
                </span>
                <span>Create and manage contact groups</span>
              </li>
              <li className="flex flex-row items-center gap-3">
                <span className="inline-flex min-w-[1.5rem] min-h-[1.5rem] bg-gradient-to-br from-blue-400 to-pink-400 rounded-full items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </span>
                <span>Add recipients one by one or via PDF</span>
              </li>
              <li className="flex flex-row items-center gap-3">
                <span className="inline-flex min-w-[1.5rem] min-h-[1.5rem] bg-gradient-to-br from-pink-400 to-blue-400 rounded-full items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 013-3.87" /></svg>
                </span>
                <span>Beautiful, modern, and easy to use</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
