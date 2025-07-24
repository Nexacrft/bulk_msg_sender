import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
          <p className="text-white text-center">Please login to access the dashboard</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-4 w-full py-2 bg-white text-blue-600 font-medium rounded-lg shadow hover:bg-blue-50 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Emails Sent</p>
                    <p className="text-xl font-bold text-gray-800">0</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/bulk-email')}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Send New Emails
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Groups</p>
                    <p className="text-xl font-bold text-gray-800">0</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/group-email')}
                  className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  Manage Groups
                </button>
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/bulk-email')}
                  className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Send Bulk Emails
                </button>
                <button 
                  onClick={() => navigate('/group-email')}
                  className="p-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  Send Group Emails
                </button>
              </div>
            </div>
          </div>
        );
      case 'bulk':
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Bulk Email</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 mb-4">Use this feature to send personalized emails to multiple recipients at once.</p>
              <button 
                onClick={() => navigate('/bulk-email')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all hover:scale-105"
              >
                Go to Bulk Email
              </button>
            </div>
          </div>
        );
      case 'group':
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Group Email</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-600 mb-4">Create email groups and send messages to all members at once with everyone in CC.</p>
              <button 
                onClick={() => navigate('/group-email')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg transition-all hover:scale-105"
              >
                Go to Group Email
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Profile</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-gray-600 mb-2">Account Type: {user.role || 'Standard'}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-purple-700 text-white py-8 px-4 hidden md:flex flex-col justify-between">
        <div>
          <div className="mb-8 px-4">
            <h1 className="text-2xl font-bold">Bulk Mail Sender</h1>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveSection('overview')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'overview' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('bulk')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'bulk' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>Bulk Email</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('group')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'group' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Group Email</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('profile')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Profile</span>
            </button>
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 mt-auto rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Bulk Mail Sender</h1>
          <button className="p-2" id="mobile-menu-button">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="md:hidden fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-20 transform transition-transform duration-300 translate-x-full" id="mobile-menu">
        <div className="bg-gradient-to-b from-blue-600 to-purple-700 h-full w-64 ml-auto p-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold text-white">Menu</h1>
            <button className="p-2 text-white" id="close-menu-button">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveSection('overview')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'overview' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>Overview</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('bulk')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'bulk' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>Bulk Email</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('group')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'group' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Group Email</span>
            </button>
            
            <button 
              onClick={() => setActiveSection('profile')}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeSection === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Profile</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
