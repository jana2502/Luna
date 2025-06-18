import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const Chat = ({ user, setError, onSignOut }) => {
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Add welcome message on first load
    useEffect(() => {
        setMessages([
            { 
                role: 'Luna', 
                content: `Hello ${user.user_name}! I'm Luna, your AI assistant. How can I help you today?` 
            }
        ]);
    }, [user.user_name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = { role: 'user', content: chatInput };
        setMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMessage.content, 
                    conversation_id: null 
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.Bot?.message || data.Bot || 'Sorry, I could not process that.';
            
            setMessages(prev => [...prev, { role: 'Luna', content: botReply }]);
        } catch (err) {
            console.error('Chat error:', err);
            setError('Failed to send message. Please try again.');
            setMessages(prev => [...prev, { 
                role: 'Luna', 
                content: 'Sorry, I encountered an error. Please try again.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = () => {
        onSignOut();
        navigate('/');
    };

    return (
        <motion.div
            className="w-full max-w-4xl flex flex-col h-[80vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800 rounded-t-lg">
                <h2 className="text-2xl font-bold neon-glow">Chat with Luna</h2>
                <div className="flex space-x-2">
                    <motion.button
                        onClick={() => navigate('/profile')}
                        className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Profile
                    </motion.button>
                    <motion.button
                        onClick={() => navigate('/change-password')}
                        className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Change Password
                    </motion.button>
                    <motion.button
                        onClick={handleSignOut}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Out
                    </motion.button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-800 space-y-4">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.role === 'user' 
                                ? 'bg-cyan-500 text-white' 
                                : 'bg-gray-700 text-gray-100'
                        }`}>
                            <div className="text-xs font-bold mb-1 opacity-70">
                                {msg.role === 'user' ? user.user_name : 'Luna'}
                            </div>
                            <div>
                                {msg.role === 'Luna' && index === messages.length - 1 && !isLoading ? (
                                    <TypingAnimation text={msg.content} />
                                ) : (
                                    msg.content
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                {isLoading && (
                    <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="bg-gray-700 text-gray-100 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                            <div className="text-xs font-bold mb-1 opacity-70">Luna</div>
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="flex p-4 bg-gray-800 rounded-b-lg">
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 bg-gray-700 rounded-l-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={isLoading}
                />
                <motion.button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-r-lg disabled:opacity-50"
                    disabled={isLoading || !chatInput.trim()}
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default Chat;