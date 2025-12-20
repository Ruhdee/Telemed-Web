const API_KEY = "AIzaSyBYObpz_fIMZgULVeGiHHXiZd9sQimpcsM";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching models from:", url);

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log("--- API RESPONSE ---");
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found. Full response:", JSON.stringify(data, null, 2));
        }
    })
    .catch(err => console.error("Fetch Error:", err));
