import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const BulkEmail = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext); // Get user and token from context

  // Check authentication on mount
  useEffect(() => {
    if (!user || !token) {
      toast.error("Please log in to send emails");
      navigate("/login");
    }
  }, [user, token, navigate]);

  const addRecipient = () => {
    if (
      recipientName &&
      recipientEmail &&
      !recipients.some(r => r.email === recipientEmail)
    ) {
      setRecipients([...recipients, { name: recipientName, email: recipientEmail }]);
      setRecipientName("");
      setRecipientEmail("");
    }
  };

  const removeRecipient = (email) => {
    setRecipients(recipients.filter((r) => r.email !== email));
  };

  const sendBulkEmails = async () => {
    // Validation
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!body.trim()) {
      toast.error("Please enter email content");
      return;
    }
    if (recipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
    }
    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        subject: subject.trim(),
        content: body.trim(),
        recipients: recipients.map(recipient => ({
          email: recipient.email,
          name: recipient.name
        }))
      };

      // Add Authorization header with token
      const response = await axios.post(
        "http://localhost:5000/api/email/send-bulk", 
        payload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token
          }
        }
      );

      if (response.data.success) {
        toast.success("Emails sent successfully!");
        // Reset form after successful send
        setSubject("");
        setBody("");
        setRecipients([]);
        setPdf(null);
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      
      if (error.response) {
        // Handle auth errors specifically
        if (error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
          navigate('/login');
          return;
        }
        
        // Other server errors
        const errorMessage = error.response.data?.message || "Failed to send emails. Please try again.";
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-10 px-2">
      <div className="w-full max-w-xl bg-white/30 border-4 border-transparent bg-clip-padding backdrop-blur-2xl rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-fade-in relative">
        <button onClick={() => navigate("/dashboard")} className="self-start mb-4 text-blue-600 hover:underline font-semibold">&larr; Back to Dashboard</button>

        {/* Show current user info */}
        {user && (
          <div className="w-full mb-4 bg-white/50 p-3 rounded-lg text-center">
            <p className="text-blue-700">
              Sending as: <span className="font-semibold">{user.name} ({user.email})</span>
            </p>
          </div>
        )}

        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg mb-2 animate-fade-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 8 8 0 1116 0 8 8 0 01-16 0z" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1 tracking-tight drop-shadow">Send Bulk Emails</h2>
          <p className="text-blue-900/80 text-center text-sm">Send personalized emails to many recipients. Add name & email or upload a PDF to extract them.</p>
        </div>

        <form className="space-y-5 w-full">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            disabled={loading}
          />
          <textarea
            placeholder="Email Body (use {{name}} for personalization)"
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] bg-white/80 shadow-sm"
            disabled={loading}
          />
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Recipients</label>
            <div className="flex gap-2 flex-col sm:flex-row mb-2">
              <input
                type="text"
                placeholder="Recipient name"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="flex-1 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/80 shadow-sm"
                disabled={loading}
              />
              <input
                type="email"
                placeholder="Recipient email"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/80 shadow-sm"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addRecipient}
                disabled={loading}
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipients.map(({ name, email }) => (
                <span key={email} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm shadow hover:bg-pink-200 transition-all">
                  <span>{name} &lt;{email}&gt;</span>
                  <button 
                    type="button" 
                    onClick={() => removeRecipient(email)} 
                    disabled={loading}
                    className="text-pink-500 hover:text-pink-700 focus:outline-none disabled:opacity-50"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-semibold text-blue-700 mb-1">Or upload PDF to extract emails:</label>
            <div className="flex items-center gap-3 bg-white/60 border-2 border-dashed border-blue-300 rounded-lg p-3 shadow-inner">
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setPdf(e.target.files[0])}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              {pdf && <div className="text-xs text-blue-700">{pdf.name}</div>}
            </div>
          </div>

          <button
            type="button"
            onClick={sendBulkEmails}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-pink-500 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Send Bulk Emails"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BulkEmail;