import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ setUser, setError, setSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.target);
        const user_name = formData.get('user_name');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:8000/signin/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ user_name });
                setSuccess('Signed in successfully!');
                // Navigation will be handled by App.jsx route protection
            } else {
                setError(data.detail || 'Sign-in failed.');
            }
        } catch (err) {
            console.error('Sign-in error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold text-center mb-6 neon-glow">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="user_name"
                        placeholder="Username"
                        className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <motion.button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded font-semibold disabled:opacity-50"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </motion.button>
            </form>

            <div className="mt-6 text-center space-y-2">
                <p>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-cyan-400 hover:underline font-semibold"
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </p>
                
                <p>
                    Forgot password?{' '}
                    <button
                        onClick={() => navigate('/reset-request')}
                        className="text-cyan-400 hover:underline font-semibold"
                        disabled={isLoading}
                    >
                        Reset Password
                    </button>
                </p>
            </div>
        </motion.div>
    );
};

export default SignIn;