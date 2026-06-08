require('dotenv').config({ path: './.env' });

async function testQuality() {
    console.log('Testing roadmap quality for: "Build an AI interview preparation platform"\n');

    const res = await fetch('http://localhost:5000/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            formData: {
                idea: 'Build an AI interview preparation platform',
                category: 'App / Software Development',
                timeline: '12',
                teamSize: '2',
                creatorName: 'Founder',
                scope: 'Medium - Standard product',
                budget: '5000'
            }
        })
    });

    const data = await res.json();

    if (data.error) {
        console.log('ERROR:', data.error, data.details);
        return;
    }

    const raw = data.roadmap;
    let phases = null;

    if (Array.isArray(raw)) phases = raw;
    else if (raw && Array.isArray(raw.phases)) phases = raw.phases;
    else {
        console.log('Raw keys:', Object.keys(raw || {}));
        console.log('Full response:', JSON.stringify(raw, null, 2).substring(0, 800));
        return;
    }

    console.log('Total Phases:', phases.length, '\n');
    phases.forEach((phase, i) => {
        console.log('Phase ' + (i+1) + ': "' + phase.title + '"');
        (phase.tasks || []).forEach(t => {
            console.log('   -> [' + (t.estimatedHours || '?') + 'h] ' + t.title);
        });
        console.log('');
    });
}

testQuality().catch(console.error);
