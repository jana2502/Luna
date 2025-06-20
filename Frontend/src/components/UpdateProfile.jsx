import { useState } from 'react';
import { motion } from 'framer-motion';

const UpdateProfile = ({ user, setUser, setError, setSuccess }) => {
    const [formData, setFormData] = useState({
        new_user_name: '',
        password: '',
        name: '',
        age: '',
        designation: '',
        email: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmitUsername = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/update-username/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_user_name: user.user_name,
                    new_user_name: formData.new_user_name,
                    password: formData.password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setUser({ ...user, user_name: formData.new_user_name });
                setSuccess('Username updated successfully!');
                setFormData({ ...formData, new_user_name: '', password: '' });
            } else {
                setError(data.detail || 'Failed to update username.');
            }
        } catch (err) {
            setError('Failed to update username.');
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/update-profile/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: user.user_name,
                    name: formData.name || null,
                    age: formData.age ? parseInt(formData.age) : null,
                    designation: formData.designation || null,
                    email: formData.email,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Profile updated successfully!');
                setFormData({ ...formData, name: '', age: '', designation: '' });
            } else {
                setError(data.detail || 'Failed to update profile.');
            }
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    return (
        <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl mb-4 neon-glow">Profile</h2>
            <form onSubmit={handleSubmitUsername} className="space-y-4 mb-6">
                <h3 className="text-xl">Update Username</h3>
                <input
                    type="text"
                    name="new_user_name"
                    value={formData.new_user_name}
                    onChange={handleInputChange}
                    placeholder="New Username"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                    required
                />
                <motion.button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update Username
                </motion.button>
            </form>
            <form onSubmit={handleSubmitProfile} className="space-y-4">
                <h3 className="text-xl">Update Profile</h3>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name (optional)"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                />
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age (optional)"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                />
                <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Designation (optional)"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                />
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full p-2 bg-gray-800 rounded text-white"
                />
                <motion.button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update Profile
                </motion.button>
            </form>
        </motion.div>
    );
};

export default UpdateProfile;