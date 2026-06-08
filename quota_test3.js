// Native fetch is available

const API_KEY = "AIzaSyDjuOLjqojSOTRCKiGRCK0qTgxeyBH13k4";
const modelsToTest = [
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
    "gemini-2.5-flash",
    "gemini-pro"
];

async function testModel(modelName) {
    const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
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
        if (!response.ok) {
            console.log("Status:", response.status, "Error:", data.error.message.substring(0, 50));
            return false;
        } else {
            console.log("SUCCESS! Model is reachable and quota is ok.");
            return true;
        }
    } catch (e) {
         console.error("Failed:", e.message);
         return false;
    }
}

async function run() {
    console.log("Using API Key ending in:", API_KEY.slice(-6));
    for (const model of modelsToTest) {
        const works = await testModel(model);
        if (works) {
            console.log(`\nWe should use THIS model: ${model}`);
            break;
        }
    }
}

run();
