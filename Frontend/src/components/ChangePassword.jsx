import { motion } from 'framer-motion';

const ChangePassword = ({ user, setError, setSuccess }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user_name = user.user_name;
        const old_password = e.target.old_password.value;
        const new_password = e.target.new_password.value;
        try {
            const response = await fetch('http://localhost:8000/change-password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_name, old_password, new_password }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Password changed successfully!');
            } else {
                setError(data.detail || 'Failed to change password.');
            }
        } catch (err) {
            setError('Failed to change password.');
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
                <h3 className="text-xl neon-glow">Change Password</h3>
                <input
                    type="password"
                    name="old_password"
                    placeholder="Old Password"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <input
                    type="password"
                    name="new_password"
                    placeholder="New Password"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <motion.button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Change Password
                </motion.button>
            </form>
        </motion.div>
    );
};

export default ChangePassword;