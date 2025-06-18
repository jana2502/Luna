import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import Register from './components/Register';
import Chat from './components/Chat';
import UpdateProfile from './components/UpdateProfile';
import ChangePassword from './components/ChangePassword';
import ResetRequest from './components/ResetRequest';
import ResetPassword from './components/ResetPassword';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Check if user is stored in sessionStorage on app load
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Store user in sessionStorage when user state changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const handleSignOut = () => {
    setUser(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-glow mb-2">Luna Chatbot</h1>
          {user && (
            <p className="text-cyan-400">Welcome back, {user.user_name}!</p>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">
            {success}
          </div>
        )}

        {/* Main Content */}
        <div className="flex items-center justify-center">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                user ? <Navigate to="/chat" replace /> : 
                <SignIn 
                  setUser={setUser} 
                  setError={setError} 
                  setSuccess={setSuccess} 
                />
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? <Navigate to="/chat" replace /> : 
                <Register 
                  setError={setError} 
                  setSuccess={setSuccess} 
                />
              } 
            />
            <Route 
              path="/reset-request" 
              element={
                user ? <Navigate to="/chat" replace /> : 
                <ResetRequest 
                  setError={setError} 
                  setSuccess={setSuccess} 
                />
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                user ? <Navigate to="/chat" replace /> : 
                <ResetPassword />
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/chat" 
              element={
                user ? 
                <Chat 
                  user={user} 
                  setError={setError}
                  onSignOut={handleSignOut}
                /> : 
                <Navigate to="/" replace />
              } 
            />
            <Route 
              path="/profile" 
              element={
                user ? 
                <UpdateProfile 
                  user={user} 
                  setUser={setUser}
                  setError={setError} 
                  setSuccess={setSuccess} 
                /> : 
                <Navigate to="/" replace />
              } 
            />
            <Route 
              path="/change-password" 
              element={
                user ? 
                <ChangePassword 
                  user={user}
                  setError={setError} 
                  setSuccess={setSuccess} 
                /> : 
                <Navigate to="/" replace />
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;