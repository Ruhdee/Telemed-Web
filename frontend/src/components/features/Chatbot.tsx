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

    const LANGUAGES = ["English", "Hindi", "Spanish", "Punjabi", "Marathi"];
    const [language, setLanguage] = useState("English");
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const API_BASE = 'http://localhost:5001/api';

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                text: m.text
            }));

            const res = await fetch(`${API_BASE}/chatbot/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.text,
                    history: history,
                    language: language
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to get response");
            }

            setMessages(prev => [...prev, { role: "bot", text: data.reply }]);

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
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
                        <div className="p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur rounded-t-2xl flex justify-between items-center relative z-50">
                            <div>
                                <h3 className="font-bold text-[var(--gold-dark)]">MediBot AI</h3>
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                    ● Online • {language}
                                </span>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-[var(--gold-primary)] transition-colors"
                                    title="Change Language"
                                >
                                    <Languages size={18} />
                                </button>

                                {showLanguageMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-[60]">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => {
                                                    setLanguage(lang);
                                                    setShowLanguageMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${language === lang ? 'text-[var(--gold-dark)] font-medium bg-[var(--gold-light)]/10' : 'text-gray-600'
                                                    }`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white shadow-sm rounded-2xl rounded-bl-none border border-gray-100 p-3 max-w-[80%]">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                placeholder={isLoading ? "Thinking..." : "Type your symptoms..."}
                                disabled={isLoading}
                                className="flex-1 bg-transparent outline-none text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading}
                                className={`p-2 text-[var(--gold-dark)] transition-transform ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
