require('dotenv').config({ path: './server/.env' });

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const URL2 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function testModel(modelName, fetchUrl) {
    console.log(`\n--- Testing ${modelName} ---`);
    try {
        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        if (!response.ok) {
            console.log("Error Output:", JSON.stringify(data.error.message, null, 2));
        } else {
            console.log("SUCCESS! Model is reachable and quota is ok.");
        }
    } catch (e) {
         console.error("Failed:", e.message);
    }
}

async function run() {
    console.log("Using API Key ending in:", API_KEY.slice(-6));
    await testModel("gemini-1.5-flash", URL);
    await testModel("gemini-2.0-flash", URL2);
}

run();
