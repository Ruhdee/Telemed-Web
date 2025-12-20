"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, Languages } from "lucide-react";

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! Using AI, I can help diagnose symptoms or listen to your cough patterns." }
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input) return;
        setMessages([...messages, { role: "user", text: input }]);
        setInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "bot", text: "I'm analyzing your request... (Demo Mode)" }])
        }, 1000);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-white p-4 rounded-full shadow-2xl"
                >
                    {isOpen ? <X /> : <MessageCircle size={28} />}
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] glass-panel flex flex-col z-40 shadow-2xl border-2 border-[var(--gold-primary)]/20"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur rounded-t-2xl flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-[var(--gold-dark)]">MediBot AI</h3>
                                <span className="text-xs text-green-600 flex items-center gap-1">● Online • Multilingual</span>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-[var(--gold-primary)]" title="Change Language">
                                <Languages size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                            ? 'bg-[var(--gold-primary)] text-white rounded-br-none'
                                            : 'bg-white shadow-sm rounded-bl-none border border-gray-100'
                                        }`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-100 bg-white/30 backdrop-blur rounded-b-2xl flex gap-2">
                            <button className="p-2 hover:bg-[var(--gold-light)]/20 rounded-full text-[var(--gold-dark)]" title="Listen to Cough">
                                <Mic size={20} />
                            </button>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your symptoms..."
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                            <button onClick={handleSend} className="p-2 text-[var(--gold-dark)] hover:scale-110 transition-transform">
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
