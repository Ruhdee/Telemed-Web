const fs = require('fs');
const https = require('https');

const API_KEY = "AIzaSyBYObpz_fIMZgULVeGiHHXiZd9sQimpcsM";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            let output = "Models:\n";
            if (json.models) {
                json.models.forEach(m => output += `- ${m.name} (${m.supportedGenerationMethods})\n`);
            } else {
                output += JSON.stringify(json, null, 2);
            }
            fs.writeFileSync('clean_models.txt', output);
            console.log("Done");
        } catch (e) {
            console.error(e);
        }
    });
}).on('error', (e) => console.error(e));
