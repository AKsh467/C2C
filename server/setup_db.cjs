// Run this ONCE to set up the Supabase tables
// Usage: node setup_db.cjs

require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function setup() {
    console.log('🔧 Setting up Supabase tables...');

    // Create users table
    const { error: usersErr } = await supabase.rpc('exec_sql', {
        sql: `
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            bio TEXT DEFAULT '',
            avatar TEXT DEFAULT '',
            role TEXT DEFAULT 'Builder',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });

    // Create roadmaps table
    const { error: roadmapsErr } = await supabase.rpc('exec_sql', {
        sql: `
        CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
            idea_name TEXT,
            category TEXT,
            data JSONB NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );`
    });

    if (usersErr) console.error('Users table error:', usersErr.message);
    else console.log('✅ users table ready');

    if (roadmapsErr) console.error('Roadmaps table error:', roadmapsErr.message);
    else console.log('✅ roadmaps table ready');
}

setup();
