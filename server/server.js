require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_me';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// ─── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.warn('⚠️  WARNING: Supabase credentials missing. Check your .env file.');
} else {
    console.log('✅ Supabase client initialized.');
}

if (!GROQ_API_KEY) {
    console.warn('⚠️  WARNING: GROQ_API_KEY is not defined. AI routes will fail.');
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided.' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' })); // large limit for base64 avatars

// ─── Socket.IO ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log('⚡ User connected:', socket.id);

    socket.on('join_roadmap', (roadmapId) => {
        socket.join(roadmapId);
        console.log(`User ${socket.id} joined room: ${roadmapId}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.roadmapId).emit('receive_message', data);
    });

    socket.on('update_roadmap', async (data) => {
        socket.to(data.roadmapId).emit('roadmap_updated', data.roadmap);
        // Persist roadmap update to Supabase
        try {
            await supabase
                .from('roadmaps')
                .update({ data: data.roadmap, updated_at: new Date().toISOString() })
                .eq('id', data.roadmapId);
        } catch (err) {
            console.error('Failed to persist roadmap update:', err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// REGISTER
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });

        // Check if user exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (existing)
            return res.status(409).json({ error: 'An account with this email already exists.' });

        const password_hash = await bcrypt.hash(password, 12);

        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password_hash,
            })
            .select('id, name, email')
            .single();

        if (error) throw error;

        const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '30d' });
        console.log(`✅ New user registered: ${newUser.email}`);
        res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required.' });

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, password_hash')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (error || !user)
            return res.status(401).json({ error: 'Invalid email or password.' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(401).json({ error: 'Invalid email or password.' });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
        console.log(`🔓 User logged in: ${user.email}`);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// GET PROFILE
app.get('/api/auth/me', requireAuth, async (req, res) => {
    const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, bio, role, avatar')
        .eq('id', req.user.id)
        .maybeSingle();

    if (error || !user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user });
});

// UPDATE PROFILE
app.put('/api/auth/me', requireAuth, async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;
        const updates = {};
        if (name) updates.name = name.trim();
        if (bio !== undefined) updates.bio = bio.trim();
        if (avatar !== undefined) updates.avatar = avatar;

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.user.id)
            .select('id, name, email, bio, role, avatar')
            .single();

        if (error) throw error;
        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// DELETE ACCOUNT
app.delete('/api/auth/me', requireAuth, async (req, res) => {
    try {
        const { error } = await supabase.from('users').delete().eq('id', req.user.id);
        if (error) throw error;
        res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account.' });
    }
});

// ─── Roadmap Routes ───────────────────────────────────────────────────────────

// GET all roadmaps for logged-in user
app.get('/api/roadmaps', requireAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        // Return the data column (the full roadmap JSON) for each row
        const roadmaps = data.map(row => row.data);
        res.json({ roadmaps });
    } catch (error) {
        console.error('Fetch roadmaps error:', error);
        res.status(500).json({ error: 'Failed to fetch roadmaps.' });
    }
});

// SAVE a new roadmap
app.post('/api/roadmaps', requireAuth, async (req, res) => {
    try {
        const { roadmap } = req.body;
        if (!roadmap || !roadmap.id) return res.status(400).json({ error: 'Invalid roadmap.' });

        const { error } = await supabase.from('roadmaps').insert({
            id: roadmap.id,
            user_id: req.user.id,
            idea_name: roadmap.ideaName,
            category: roadmap.category,
            data: roadmap,
        });

        if (error) throw error;
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Save roadmap error:', error);
        res.status(500).json({ error: 'Failed to save roadmap.' });
    }
});

// UPDATE a roadmap (Kanban drag, task completion, etc.)
app.put('/api/roadmaps/:id', requireAuth, async (req, res) => {
    try {
        const { roadmap } = req.body;
        const { error } = await supabase
            .from('roadmaps')
            .update({ data: roadmap, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Update roadmap error:', error);
        res.status(500).json({ error: 'Failed to update roadmap.' });
    }
});

// DELETE a roadmap
app.delete('/api/roadmaps/:id', requireAuth, async (req, res) => {
    try {
        const { error } = await supabase
            .from('roadmaps')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        console.error('Delete roadmap error:', error);
        res.status(500).json({ error: 'Failed to delete roadmap.' });
    }
});

// ─── AI Roadmap Generation ────────────────────────────────────────────────────

app.post('/api/generate-roadmap', async (req, res) => {
    try {
        const { formData } = req.body;
        if (!formData || !formData.idea) {
            return res.status(400).json({ error: "Missing required project idea." });
        }

        const { idea, timeline, category, budget, teamSize, creatorName, scope } = formData;
        const sizeInt = parseInt(teamSize) || 1;

        const systemPrompt = `
        You are an expert CTO and AI Product Strategist. Your primary mission is to transform raw user ideas into HYPER-SPECIFIC, high-technical-density Execution Roadmaps.
        
        USER IDEA: "${idea}"
        CATEGORY: "${category}"
        TIMELINE: "${timeline} weeks"
        TEAM SIZE: ${sizeInt} people
        CREATOR: "${creatorName}"
        SCOPE: ${scope}
        BUDGET: ${budget ? '$' + budget : 'Unknown/N/A'}
        
        CRITICAL NEGATIVE CONSTRAINTS (FORBIDDEN TERMS):
        - DO NOT USE the words "Discovery", "Research", "Testing", "Deployment", "Phase 1", "Phase 2", "Launch", or "Marketing" in your Titles.
        - DO NOT provide generic steps like "Define Requirements" or "Final Testing".
        - DO NOT use placeholders like "Set up database" without specifying a tech (e.g. "Configure Prisma migrate with PostgreSQL").
        
        CRITICAL POSITIVE CONSTRAINTS (MANDATORY):
        1. EVERY task title must contain at least TWO nouns specific to the ACTUAL idea.
        2. Phase titles MUST NOT be generic. You must invent highly creative, domain-specific milestones based entirely on the user's specific product idea.
        3. For the given Category, use industry-standard technical terms that an expert engineer would use.
        4. Tasks must be realistically executable by ${sizeInt} people in ${timeline} weeks.
        
        CRITICAL OUTPUT INSTRUCTIONS:
        You must output a valid JSON object. 
        DO NOT output the exact placeholder strings shown in the example below. You MUST generate real, highly specific technical content based on the user's idea!
        
        Expected JSON Schema:
        {
          "phases": [
            { 
              "title": "<Generate a real, domain-specific phase title here>", 
              "tasks": [
                { 
                    "id": "t1", 
                    "title": "<Generate a highly specific technical action here>", 
                    "estimatedHours": 10,
                    "completed": false,
                    "assignee": "${creatorName}",
                    "cost": "$0",
                    "prereqs": "None",
                    "details": {
                        "whatThisMeans": "<Explain why this specific step is critical for ${idea}>",
                        "whatThisMeansExample": ["<Generate a real concrete example>", "<Generate another real example>"],
                        "whyItMatters": ["<Generate a real reason>", "<Generate another real reason>"],
                        "whatYouNeedToDo": ["<Generate specific step 1>", "<Generate specific step 2>", "<Generate specific step 3>"],
                        "output": "<Describe the specific technical deliverable>",
                        "outputExample": "<Provide a real example of the output>"
                    }
                }
              ]
            }
          ]
        }
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: systemPrompt }],
                temperature: 0.1,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            return res.status(response.status).json({
                error: 'Groq API failed.',
                details: errData?.error?.message || 'Unknown error'
            });
        }

        const data = await response.json();
        let responseText = data.choices[0].message.content.trim();
        if (responseText.startsWith('```json')) responseText = responseText.substring(7);
        else if (responseText.startsWith('```')) responseText = responseText.substring(3);
        if (responseText.endsWith('```')) responseText = responseText.substring(0, responseText.length - 3);

        const generatedRoadmap = JSON.parse(responseText.trim());
        console.log(`📦 AI response keys (model: Groq Llama 3):`, Object.keys(generatedRoadmap));
        res.json({ roadmap: generatedRoadmap });


    } catch (error) {
        console.error("Backend AI Generation Failed:", error);
        res.status(500).json({ error: "Failed to generate AI roadmap", details: error.message });
    }
});

// ─── Share Routes (now persisted in Supabase) ─────────────────────────────────

app.post('/api/share', requireAuth, async (req, res) => {
    try {
        const { roadmap } = req.body;
        if (!roadmap || !roadmap.id) return res.status(400).json({ error: "Invalid roadmap payload." });

        const shareId = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Store shareId in the roadmap's data in Supabase
        await supabase.from('roadmaps')
            .update({ data: { ...roadmap, shareId } })
            .eq('id', roadmap.id)
            .eq('user_id', req.user.id);

        console.log(`📡 Created share link: ${shareId} for: ${roadmap.ideaName}`);
        res.json({ shareId, roadmap: { ...roadmap, shareId } });
    } catch (error) {
        console.error("Share link error:", error);
        res.status(500).json({ error: "Failed to generate share link" });
    }
});

app.get('/api/shared-roadmap/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('roadmaps')
        .select('data')
        .filter('data->>shareId', 'eq', id)
        .maybeSingle();

    if (error || !data) return res.status(404).json({ error: "Shared roadmap not found or expired." });
    res.json({ roadmap: data.data });
});

app.post('/api/shared-roadmap/:id/join', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Missing user name" });

    const { data, error } = await supabase
        .from('roadmaps')
        .select('id, data')
        .filter('data->>shareId', 'eq', id)
        .maybeSingle();

    if (error || !data) return res.status(404).json({ error: "Shared roadmap not found." });

    const roadmap = data.data;
    if (!roadmap.teamMembers) roadmap.teamMembers = [];
    if (!roadmap.teamMembers.includes(name)) {
        roadmap.teamMembers.push(name);
        await supabase.from('roadmaps').update({ data: roadmap }).eq('id', data.id);
        io.to(data.id).emit('roadmap_updated', roadmap);
    }

    res.json({ teamMembers: roadmap.teamMembers });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
