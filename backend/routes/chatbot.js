require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

/* Gemini Init */
// Initialize only if API key is present
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

router.post("/chat", async (req, res) => {
    try {
        if (!genAI) {
            return res.status(500).json({ error: "Chatbot service not configured. Please set GEMINI_API_KEY." });
        }

        const { message, history, language = "English" } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Valid models to try in order (validated via debug script)
        const MODELS = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-pro"];

        let lastError = null;
        let responseText = null;

        for (const modelName of MODELS) {
            try {
                // Initialize model with system instruction
                // systemInstruction is supported in newer SDK versions
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: `You are a helpful and knowledgeable medical AI assistant named MediBot. 
                    Your role is to help users with their symptoms and medical questions.
                    IMPORTANT: You MUST reply in ${language} language ONLY.
                    Keep your responses concise, empathetic, and professional. 
                    Disclaimer: Always remind users that you are an AI and they should consult a doctor for serious issues.`
                });

                // Construct chat history for Gemini
                // Filter out initial bot greeting if it's the first message
                // Gemini requires history to start with 'user' role
                let formattedHistory = (history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));

                // Ensure history starts with user
                if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
                    formattedHistory.shift();
                }

                const chat = model.startChat({
                    history: formattedHistory,
                    generationConfig: {
                        maxOutputTokens: 500,
                    },
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                responseText = response.text();

                // If successful, break the loop
                break;

            } catch (err) {
                console.warn(`Model ${modelName} failed:`, err.message);
                lastError = err;
                continue;
            }
        }

        if (!responseText) {
            throw lastError || new Error("All models failed");
        }

        res.json({ reply: responseText });

    } catch (err) {
        console.error("Chatbot Error:", err);
        res.status(500).json({
            error: "Failed to process chat message",
            details: err.message
        });
    }
});

module.exports = router;
