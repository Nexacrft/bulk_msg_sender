import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [dbStatus, setDbStatus] = useState('Checking...')

  useEffect(() => {
    checkServerConnection()
  }, [])

  const checkServerConnection = async () => {
    try {
      const response = await axios.get('/api/health')
      setServerStatus('Connected ✅')
      setDbStatus(response.data.database ? 'Connected ✅' : 'Disconnected ❌')
    } catch (error) {
      setServerStatus('Disconnected ❌')
      setDbStatus('Disconnected ❌')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Bulk Mail Sender
          </h1>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                System Status
              </h2>
              
              <div className="space-y-2 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Backend Server:</span>
                  <span className="font-medium">{serverStatus}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">{dbStatus}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={checkServerConnection}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Refresh Status
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            Ready for bulk mail sending functionality
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
