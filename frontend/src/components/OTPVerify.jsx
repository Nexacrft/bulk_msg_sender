import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const OTPVerify = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (!email) {
      toast.error("Email information missing. Please try signing up again.");
      navigate("/signup");
    } else {
      // Focus on first input when component loads
      inputRefs[0].current?.focus();
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 6) {
          newOtpValues[i] = pasteData[i];
        }
      }
      setOtpValues(newOtpValues);
      // Focus on the next empty field or the last field
      const focusIndex = Math.min(pasteData.length, 5);
      inputRefs[focusIndex].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMsg = error.response?.data?.message || "OTP verification failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/resend-otp",
        {
          email,
        }
      );

      toast.success(response.data.message);
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMsg = error.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Verify Your Email
        </h1>
        <p className="text-center text-white/90 mb-8">
          We've sent a verification code to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-3 text-center">
              Enter 6-digit OTP
            </label>
            <div
              className="flex justify-center space-x-2"
              onPaste={handlePaste}
            >
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/70 border border-white/50 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/80 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className={`text-blue-200 hover:text-white font-medium transition-colors ${
              resendLoading || countdown > 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {countdown > 0
              ? `Resend OTP in ${countdown}s`
              : resendLoading
              ? "Sending..."
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
