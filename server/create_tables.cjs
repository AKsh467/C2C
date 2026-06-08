// Run once: node create_tables.cjs
require('dotenv').config({ path: './.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function runSQL(sql) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({ sql })
    });
    const data = await res.text();
    return { status: res.status, data };
}

async function createTablesViaSQL() {
    console.log('Creating tables via Supabase SQL API...\n');

    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            bio TEXT DEFAULT '',
            avatar TEXT DEFAULT '',
            role TEXT DEFAULT 'Builder',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS roadmaps (
            id TEXT PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
            idea_name TEXT,
            category TEXT,
            data JSONB NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps(user_id);
        CREATE INDEX IF NOT EXISTS roadmaps_share_id_idx ON roadmaps USING gin(data);
    `;

    const result = await runSQL(sql);
    console.log('Status:', result.status);
    console.log('Response:', result.data);

    if (result.status === 200 || result.status === 204) {
        console.log('\n✅ Tables created successfully!');
    } else {
        console.log('\n⚠️  The exec_sql RPC might not exist. Use the Supabase SQL Editor instead.');
        console.log('Go to: https://supabase.com/dashboard → SQL Editor → paste the SQL above');
    }
}

createTablesViaSQL();
