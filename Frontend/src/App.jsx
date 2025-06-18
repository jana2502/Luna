import { useState } from 'react';
import SignIn from './components/SignIn';
import Register from './components/Register';
import ResetRequest from './components/ResetRequest';
import ResetPassword from './components/ResetPassword';
import Chat from './components/Chat';

function App() {
  const [view, setView] = useState('signin'); // default view
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Status Messages */}
        {error && <p className="bg-red-500 text-white p-2 mb-4 rounded">{error}</p>}
        {success && <p className="bg-green-500 text-white p-2 mb-4 rounded">{success}</p>}

        {/* Conditional Views */}
        {view === 'signin' && (
          <SignIn
            setView={setView}
            setUser={setUser}
            setError={setError}
            setSuccess={setSuccess}
          />
        )}
        {view === 'signup' && (
          <Register
            setView={setView}
            setUser={setUser}
            setError={setError}
            setSuccess={setSuccess}
          />
        )}
        {view === 'reset-request' && (
          <ResetRequest
            setView={setView}
            setError={setError}
            setSuccess={setSuccess}
          />
        )}
        {view === 'reset-password' && (
          <ResetPassword
            setView={setView}
          />
        )}
        {view === 'chat' && (
          <Chat
            user={user}
            setView={setView}
            setUser={setUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;
