require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const { google } = require('googleapis');

const resend = new Resend(process.env.RESEND_API_KEY);

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

const { clerkMiddleware, requireAuth: ClerkExpressRequireAuth } = require('@clerk/express');

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const requireAuth = ClerkExpressRequireAuth();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(clerkMiddleware());
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

// ─── Auth Routes ──────────────────────────────────────────────────────────────
// Custom auth routes have been removed in favor of Clerk.

// ─── Roadmap Routes ───────────────────────────────────────────────────────────

// GET all roadmaps for logged-in user
app.get('/api/roadmaps', requireAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', req.auth.userId)
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
            user_id: req.auth.userId,
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
            .eq('user_id', req.auth.userId);

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
            .eq('user_id', req.auth.userId);

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
        You are a Staff-Level Software Engineer and elite CTO building an actionable execution roadmap for a new project.
        Your mission is to output a hyper-specific, technically accurate JSON roadmap.

        USER IDEA: "${idea}"
        CATEGORY: "${category}"
        TIMELINE: "${timeline} weeks"
        TEAM SIZE: ${sizeInt} people
        CREATOR: "${creatorName}"
        SCOPE: ${scope}
        BUDGET: ${budget ? '$' + budget : 'Unknown/N/A'}
        
        STRICT STRUCTURAL CONSTRAINTS:
        1. YOU MUST GENERATE EXACTLY 5 to 8 PHASES. 
        2. EVERY PHASE MUST HAVE EXACTLY 5 to 8 TASKS.
        3. Phase titles must be specific to the domain (e.g. "Core Audio Pipeline Infrastructure" instead of "Phase 1: Setup").
        4. Task titles MUST be descriptive (e.g. "Provision RDS PostgreSQL with pgvector for Semantic Search" instead of "Database Setup").
        5. You must suggest real technologies, file names, API endpoints, or shell commands in the details where appropriate.
        
        OUTPUT FORMAT (JSON SCHEMA):
        You must strictly adhere to the following JSON schema. Do not output anything outside of this JSON.
        
        {
          "type": "object",
          "properties": {
            "phases": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": { "type": "string", "description": "Highly specific phase title" },
                  "tasks": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string", "description": "Unique task ID, e.g., t1, t2" },
                        "title": { "type": "string", "description": "Descriptive task title" },
                        "estimatedHours": { "type": "number" },
                        "completed": { "type": "boolean", "default": false },
                        "assignee": { "type": "string", "description": "Defaults to creator name" },
                        "cost": { "type": "string" },
                        "prereqs": { "type": "string" },
                        "details": {
                          "type": "object",
                          "properties": {
                            "whatThisMeans": { "type": "string", "description": "Detailed 2-sentence explanation of the task." },
                            "whatThisMeansExample": { "type": "array", "items": { "type": "string" }, "description": "2 specific code/tool examples." },
                            "whyItMatters": { "type": "array", "items": { "type": "string" }, "description": "2 specific reasons why this task is critical." },
                            "whatYouNeedToDo": { "type": "array", "items": { "type": "string" }, "description": "3 highly actionable steps to complete this task." },
                            "output": { "type": "string", "description": "The exact technical deliverable (e.g., 'A running Docker container')." },
                            "outputExample": { "type": "string", "description": "A specific example of the output." }
                          },
                          "required": ["whatThisMeans", "whatThisMeansExample", "whyItMatters", "whatYouNeedToDo", "output", "outputExample"]
                        }
                      },
                      "required": ["id", "title", "estimatedHours", "completed", "assignee", "cost", "prereqs", "details"]
                    }
                  }
                },
                "required": ["title", "tasks"]
              }
            }
          },
          "required": ["phases"]
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
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Please generate the execution roadmap for: ${idea}` }
                ],
                temperature: 0.3,
                max_tokens: 8000,
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
            .eq('user_id', req.auth.userId);

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
        
        // Send Email Notification to Owner
        try {
            // 1. Get the roadmap owner's user_id from the database row
            // Note: we need the user_id column, so we should fetch it.
            const { data: rowData } = await supabase.from('roadmaps').select('user_id').eq('id', data.id).single();
            if (rowData && rowData.user_id) {
                // 2. Fetch the owner's email from Clerk
                const clerkResp = await fetch(`https://api.clerk.com/v1/users/${rowData.user_id}`, {
                    headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` }
                });
                if (clerkResp.ok) {
                    const clerkUser = await clerkResp.json();
                    const ownerEmail = clerkUser.email_addresses?.[0]?.email_address;
                    
                    // 3. Send email via Resend
                    if (ownerEmail && process.env.RESEND_API_KEY) {
                        await resend.emails.send({
                            from: 'Chaos2Clarity <onboarding@resend.dev>', // default resend sandbox domain
                            to: ownerEmail,
                            subject: `${name} joined your roadmap!`,
                            html: `<div style="font-family: sans-serif; padding: 20px;">
                                <h2 style="color: #6366f1;">New Team Member!</h2>
                                <p><strong>${name}</strong> has just joined your project roadmap: <em>${roadmap.ideaName}</em>.</p>
                                <p>Log in to Chaos2Clarity to chat with them and start executing your master plan.</p>
                            </div>`
                        });
                        console.log(`✉️ Email notification sent to ${ownerEmail}`);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to send join email notification:", err);
        }
    }

    res.json({ teamMembers: roadmap.teamMembers });
});

// ─── Google Calendar Sync ───────────────────────────────────────────────────────
app.post('/api/calendar/sync', requireAuth, async (req, res) => {
    try {
        const { roadmap } = req.body;
        if (!roadmap || !roadmap.milestones) return res.status(400).json({ error: "Invalid roadmap data." });

        // Fetch user's Google OAuth token from Clerk
        const clerkResp = await fetch(`https://api.clerk.com/v1/users/${req.auth.userId}/oauth_access_tokens/oauth_google`, {
            headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` }
        });
        
        if (!clerkResp.ok) {
            return res.status(401).json({ error: "Could not fetch Google OAuth token. Ensure Calendar scopes are enabled in Clerk." });
        }

        const tokens = await clerkResp.json();
        if (!tokens || tokens.length === 0) {
            return res.status(401).json({ error: "No Google OAuth token found. Have you signed in with Google?" });
        }

        const accessToken = tokens[0].token;

        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: accessToken });
        const calendar = google.calendar({ version: 'v3', auth });

        // 1. Check if Chaos2Clarity calendar exists, or create it
        const calendarList = await calendar.calendarList.list();
        let c2cCalendar = calendarList.data.items.find(c => c.summary === 'Chaos2Clarity');

        if (!c2cCalendar) {
            const created = await calendar.calendars.insert({
                requestBody: { summary: 'Chaos2Clarity', description: 'Technical Roadmaps from Chaos2Clarity' }
            });
            c2cCalendar = created.data;
        }

        // 2. Schedule events
        // We'll simulate a schedule starting tomorrow, adding tasks sequentially
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(9, 0, 0, 0); // start at 9am

        let eventsCreated = 0;

        for (const milestone of roadmap.milestones) {
            for (const task of milestone.tasks) {
                if (task.completed) continue;

                const hours = task.estimatedHours || 2;
                
                // If it's past 5pm, move to next day 9am
                if (currentDate.getHours() + hours > 17) {
                    currentDate.setDate(currentDate.getDate() + 1);
                    currentDate.setHours(9, 0, 0, 0);
                }

                const end = new Date(currentDate);
                end.setHours(currentDate.getHours() + hours);

                await calendar.events.insert({
                    calendarId: c2cCalendar.id,
                    requestBody: {
                        summary: `[C2C] ${task.title}`,
                        description: `Milestone: ${milestone.title}\n\nProject: ${roadmap.ideaName}\n\nDetails: ${task.details?.whatThisMeans || ''}`,
                        start: { dateTime: currentDate.toISOString() },
                        end: { dateTime: end.toISOString() }
                    }
                });

                eventsCreated++;
                // advance time
                currentDate = end;
            }
        }

        res.json({ success: true, message: `Successfully synced ${eventsCreated} tasks to Google Calendar!` });

    } catch (error) {
        console.error("Calendar Sync Error:", error);
        res.status(500).json({ error: "Failed to sync calendar", details: error.message });
    }
});

// ─── Error Handling Middleware ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack || err.message);
    res.status(err.status || 401).json({ 
        error: 'Authentication or Server Error', 
        details: err.message || 'Internal Server Error' 
    });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
