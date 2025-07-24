// import React, { useState, useEffect } from 'react'
// import axios from 'axios'

// function App() {
//   const [serverStatus, setServerStatus] = useState('Checking...')
//   const [dbStatus, setDbStatus] = useState('Checking...')

//   useEffect(() => {
//     checkServerConnection()
//   }, [])

//   const checkServerConnection = async () => {
//     try {
//       const response = await axios.get('/api/health')
//       setServerStatus('Connected ✅')
//       setDbStatus(response.data.database ? 'Connected ✅' : 'Disconnected ❌')
//     } catch (error) {
//       setServerStatus('Disconnected ❌')
//       setDbStatus('Disconnected ❌')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">
//             Bulk Mail Sender
//           </h1>
          
//           <div className="space-y-4">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h2 className="text-lg font-semibold text-gray-800 mb-2">
//                 System Status
//               </h2>
              
//               <div className="space-y-2 text-left">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Backend Server:</span>
//                   <span className="font-medium">{serverStatus}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Database:</span>
//                   <span className="font-medium">{dbStatus}</span>
//                 </div>
//               </div>
//             </div>
            
//             <button
//               onClick={checkServerConnection}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
//             >
//               Refresh Status
//             </button>
//           </div>
          
//           <div className="mt-8 text-sm text-gray-500">
//             Ready for bulk mail sending functionality
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App




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
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
  );
}

export default App;

