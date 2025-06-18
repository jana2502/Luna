// ResetRequest.jsx
import { motion } from 'framer-motion';

const ResetRequest = ({ setError, setSuccess }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted"); // 👈 Debug
        const email = e.target.reset_email.value;

        try {
            const response = await fetch('http://localhost:8000/password-reset-request/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Password reset link sent.');
                setError('');
            } else {
                setError(data.detail || 'Failed to send reset link.');
                setSuccess('');
            }
        } catch (err) {
            console.error("Request failed:", err);
            setError('Server error.');
            setSuccess('');
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4"
        >
            <h2 className="text-2xl">Reset Password</h2>
            <input
                type="email"
                name="reset_email"
                placeholder="Enter your email"
                className="w-full p-2 border rounded"
                required
            />
            <motion.button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
            >
                Send Reset Link
            </motion.button>
        </motion.form>
    );
};

export default ResetRequest;
