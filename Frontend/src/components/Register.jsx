import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = ({ setError, setSuccess }) => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user_name = e.target.user_name.value;
        const password = e.target.password.value;
        const email = e.target.email.value;

        try {
            const response = await fetch('http://localhost:8000/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('User created successfully! Please sign in.');
                navigate('/');
            } else {
                setError(data.detail || 'Sign-up failed.');
            }
        } catch (err) {
            setError('Sign-up failed.');
        }
    };

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="user_name"
                    placeholder="Username"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <motion.button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign Up
                </motion.button>
            </form>

            <p className="mt-4 text-center">
                Already have an account?{' '}
                <button
                    onClick={() => navigate('/')}
                    className="text-cyan-400 hover:underline"
                >
                    Sign In
                </button>
            </p>
            <p className="mt-2 text-center">
                Forgot password?{' '}
                <button
                    onClick={() => navigate('/reset-request')}
                    className="text-cyan-400 hover:underline"
                >
                    Reset Password
                </button>
            </p>
        </motion.div>
    );
};

export default Register;
