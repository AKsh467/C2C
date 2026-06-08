// Tests the full Supabase backend integration
// node test_supabase.cjs

require('dotenv').config({ path: './.env' });

const BASE = 'http://localhost:5000';
const TEST_EMAIL = `test_${Date.now()}@c2c.dev`;
const TEST_PASS = 'Test@12345';
const TEST_NAME = 'Supabase Tester';

async function run() {
    console.log('🧪 Testing Supabase Integration...\n');

    // 1. Register
    console.log('1️⃣  Registering user:', TEST_EMAIL);
    const regRes = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASS })
    });
    const reg = await regRes.json();
    if (!reg.token) { console.error('❌ Register failed:', reg); return; }
    console.log('   ✅ Registered. Token received.');
    const token = reg.token;
    const userId = reg.user.id;

    // 2. Fetch profile
    console.log('2️⃣  Fetching profile from Supabase...');
    const meRes = await fetch(`${BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    const me = await meRes.json();
    if (!me.user) { console.error('❌ Profile fetch failed:', me); return; }
    console.log('   ✅ Profile:', me.user.name, '|', me.user.email);

    // 3. Save a roadmap
    console.log('3️⃣  Saving roadmap to Supabase...');
    const fakeRoadmap = {
        id: Date.now().toString(),
        ideaName: 'Supabase Test Roadmap',
        category: 'App',
        totalWeeks: 4,
        teamMembers: [TEST_NAME],
        milestones: []
    };
    const saveRes = await fetch(`${BASE}/api/roadmaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ roadmap: fakeRoadmap })
    });
    const save = await saveRes.json();
    if (!save.success) { console.error('❌ Save roadmap failed:', save); return; }
    console.log('   ✅ Roadmap saved to Supabase DB.');

    // 4. Fetch roadmaps
    console.log('4️⃣  Fetching roadmaps from Supabase...');
    const fetchRes = await fetch(`${BASE}/api/roadmaps`, { headers: { Authorization: `Bearer ${token}` } });
    const fetched = await fetchRes.json();
    if (!fetched.roadmaps || fetched.roadmaps.length === 0) { console.error('❌ Fetch roadmaps failed:', fetched); return; }
    console.log(`   ✅ ${fetched.roadmaps.length} roadmap(s) fetched. Name: "${fetched.roadmaps[0].ideaName}"`);

    // 5. Delete account (cleanup)
    console.log('5️⃣  Cleaning up test account...');
    const delRes = await fetch(`${BASE}/api/auth/me`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const del = await delRes.json();
    console.log('   ✅ Account deleted:', del.message);

    console.log('\n🎉 ALL TESTS PASSED! Supabase is fully connected.');
}

run().catch(console.error);
