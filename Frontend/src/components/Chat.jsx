import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypingAnimation = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [text]);
    return <span>{displayedText}</span>;
};

const Chat = ({ user, setView, setError }) => {
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const userMessage = { role: 'user', content: chatInput };
        setMessages([...messages, userMessage]);
        setChatInput('');
        try {
            const response = await fetch('http://localhost:8000/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content, conversation_id: null }),
            });
            const data = await response.json();
            if (response.ok) {
                const botReply = data.Bot.message || data.Bot;
                setMessages((prev) => [...prev, { role: 'Luna', content: botReply }]);
            } else {
                setError(data.detail || 'Failed to send message.');
            }
        } catch (err) {
            setError('Failed to send message.');
        }
    };

    return (
        <motion.div
            className="w-full max-w-2xl flex flex-col h-[70vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        className={`chat-bubble ${msg.role === 'user' ? 'user' : ''}`}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {msg.role === 'Luna' ? (
                            <TypingAnimation text={msg.content.message || msg.content} />
                        ) : (
                            msg.content
                        )}
                    </motion.div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex p-4">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 bg-gray-800 rounded-l text-white"
                />
                <motion.button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-r"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Send
                </motion.button>
            </form>
            <div className="flex justify-center space-x-4 mt-4">
                <motion.button
                    onClick={() => setView('profile')}
                    className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Profile
                </motion.button>
                <motion.button
                    onClick={() => setView('signin')}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Sign Out
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Chat;