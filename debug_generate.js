
const URL = "http://localhost:5000/api/generate-roadmap";

async function run() {
    console.log("Sending request to", URL);
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                formData: {
                    idea: "A specialized app for tracking artisanal coffee roasting profiles",
                    category: "App / Software Development",
                    timeline: "4",
                    teamSize: "1",
                    creatorName: "Test User",
                    scope: "Medium",
                    budget: ""
                }
            })
        });

        console.log("Status:", response.status);
        if (!response.ok) {
            const err = await response.text();
            console.log("Error:", err);
            return;
        }

        const data = await response.json();
        console.log("Success! Roadmap:");
        console.log(JSON.stringify(data, null, 2).substring(0, 500) + "... (truncated)");
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

run();
