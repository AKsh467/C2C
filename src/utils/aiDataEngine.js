export const generateAiRoadmap = async (formData, token) => {
    try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/generate-roadmap`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ formData })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorData.details || errorData.error}`);
        }

        const data = await response.json();
        const raw = data.roadmap;

        // Normalize the AI response — it may return:
        // { phases: [...] }  ← expected format
        // [...]              ← bare array (phases are root)
        // { phases: { ... } } ← object instead of array (rare)
        let phases;
        if (Array.isArray(raw)) {
            // AI returned a bare array — treat it as phases directly
            phases = raw;
        } else if (raw && Array.isArray(raw.phases)) {
            // Standard format
            phases = raw.phases;
        } else if (raw && typeof raw === 'object') {
            // Try to find any array value in the root object
            const firstArray = Object.values(raw).find(v => Array.isArray(v));
            if (firstArray) {
                phases = firstArray;
            } else {
                throw new Error('AI returned an unexpected JSON structure. Please try again.');
            }
        } else {
            throw new Error('AI returned an empty or invalid response. Please try again.');
        }

        if (!phases || phases.length === 0) {
            throw new Error('AI returned no phases. Please try again.');
        }

        // Calculate metadata dynamically
        const allTasks = phases.flatMap(p => p.tasks || []);
        const totalEstimatedHours = allTasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0);

        const { idea, timeline, category, budget, creatorName } = formData;

        return {
            id: Date.now().toString(),
            ideaName: idea,
            category: category,
            totalWeeks: parseInt(timeline),
            teamMembers: [creatorName || 'Builder'],
            budget: budget,
            totalEstimatedHours: totalEstimatedHours,
            milestones: phases.map((phase, index) => ({
                id: `m${index + 1}`,
                title: phase.title || `Milestone ${index + 1}`,
                tasks: phase.tasks || [],
                progress: 0
            }))
        };

    } catch (error) {
        console.error('AI Generation Failed:', error);
        throw error;
    }
};
