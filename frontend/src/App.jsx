import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OTPVerify from "./components/OTPVerify";
import Dashboard from "./components/Dashboard";
import BulkEmail from "./components/BulkEmail";
import GroupEmail from "./components/GroupEmail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<OTPVerify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bulk-email" element={<BulkEmail />} />
          <Route path="/group-email" element={<GroupEmail />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </UserProvider>
  );
}

export default App;

