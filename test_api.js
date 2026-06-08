
const API_KEY = "AIzaSyA88xsUv_ep5HT9EGW7pfMSdgHCCthhktE"; // Hardcoded for diagnostic run
const BASE_URL = "https://generativelanguage.googleapis.com/v1"; // Correct Production URL

async function testGemini(model) {
    console.log(`--- Testing Gemini API (v1) with model: ${model} ---`);
    try {
        const response = await fetch(`${BASE_URL}/models/${model}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Respond with 'Connected successfully' if you can read this." }] }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        if (!response.ok) {
            console.error("Error Message:", data?.error?.message || "Unknown error");
            console.error("Full Error Details:", JSON.stringify(data, null, 2));
        } else {
            console.log("Response:", data.candidates[0].content.parts[0].text);
            console.log("✅ API IS FULLY FUNCTIONAL");
        }
    } catch (error) {
        console.error("Fetch failed entirely:", error.message);
    }
}

testGemini("gemini-1.5-flash");
