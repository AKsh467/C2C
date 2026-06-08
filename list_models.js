
const API_KEY = "AIzaSyA88xsUv_ep5HT9EGW7pfMSdgHCCthhktE";

async function listModels() {
    console.log("--- Fetching Available Gemini Models ---");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(", ")})`);
            });
        } else {
            console.error("No models found:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Failed to list models:", e.message);
    }
}

listModels();
