import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResetRequest = ({ setError, setSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.target);
        const email = formData.get('reset_email');

        try {
            const response = await fetch('http://localhost:8000/password-reset-request/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setSuccess('Password reset link sent to your email!');
                // Clear the form
                e.target.reset();
            } else {
                setError(data.detail || 'Failed to send reset link.');
            }
        } catch (err) {
            console.error('Reset request error:', err);
            setError('Network error. Please try again.');
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
            <h2 className="text-3xl font-bold text-center mb-6 neon-glow">Reset Password</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="email"
                        name="reset_email"
                        placeholder="Enter your email address"
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
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
            </form>

            <div className="mt-6 text-center">
                <p>
                    Remember your password?{' '}
                    <button
                        onClick={() => navigate('/')}
                        className="text-cyan-400 hover:underline font-semibold"
                        disabled={isLoading}
                    >
                        Back to Sign In
                    </button>
                </p>
            </div>
        </motion.div>
    );
};

export default ResetRequest;