require('dotenv').config();
process.env.PORT = '5001';
const app = require('./server');
const http = require('http');

let token = '';
let pass = 0, fail = 0;

function req(method, path, body, auth) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (auth) headers['Authorization'] = 'Bearer ' + auth;
    const opts = { hostname: 'localhost', port: 5001, path, method, headers };
    const r = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    r.on('error', e => resolve({ status: 'ERR', body: e.message }));
    if (data) r.write(data);
    r.end();
  });
}

function log(label, r, expectStatus) {
  const expected = expectStatus || 200;
  const ok = expectStatus
    ? r.status === expectStatus
    : r.status >= 200 && r.status < 300;
  if (ok) { pass++; console.log('  ✅ PASS [' + r.status + '] ' + label); }
  else     { fail++; console.log('  ❌ FAIL [' + r.status + '] ' + label + ' — ' + JSON.stringify(r.body).slice(0, 100)); }
}

const server = app.listen(5001, async () => {
  await new Promise(r => setTimeout(r, 1500)); // wait for DB

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║     NEXORA API FULL TEST SUITE       ║');
  console.log('╚══════════════════════════════════════╝\n');

  // ── Health ──────────────────────────────
  console.log('── Health ──');
  log('GET /api/health', await req('GET', '/api/health'));

  // ── Auth ────────────────────────────────
  console.log('\n── Auth ──');
  const email = 'testuser_' + Date.now() + '@nexora.com';

  const reg = await req('POST', '/api/auth/register', {
    name: 'Test User', email, password: 'Test1234',
    targetRole: 'Software Engineer', college: 'MIT',
    branch: 'CSE', graduationYear: 2025
  });
  log('POST /api/auth/register', reg, 201);
  token = reg.body && reg.body.token ? reg.body.token : '';

  const login = await req('POST', '/api/auth/login', { email, password: 'Test1234' });
  log('POST /api/auth/login', login);
  token = login.body && login.body.token ? login.body.token : token;

  log('POST /api/auth/login (wrong pass → 401)', await req('POST', '/api/auth/login', { email, password: 'wrong' }), 401);
  log('GET  /api/auth/me', await req('GET', '/api/auth/me', null, token));
  log('GET  /api/auth/me (no token → 401)', await req('GET', '/api/auth/me', null, null), 401);
  log('PUT  /api/auth/profile', await req('PUT', '/api/auth/profile', { targetRole: 'Full Stack Engineer' }, token));

  // ── Coding ──────────────────────────────
  console.log('\n── Coding ──');
  log('GET /api/coding/problems', await req('GET', '/api/coding/problems', null, token));
  log('GET /api/coding/problems/climbing-stairs', await req('GET', '/api/coding/problems/climbing-stairs', null, token));
  log('GET /api/coding/problems/not-found → 404', await req('GET', '/api/coding/problems/not-found', null, token), 404);
  log('GET /api/coding/submissions', await req('GET', '/api/coding/submissions', null, token));
  log('POST /api/coding/run (missing fields → 400)', await req('POST', '/api/coding/run', { language: 'python' }, token), 400);
  log('POST /api/coding/submit (missing fields → 400)', await req('POST', '/api/coding/submit', { code: 'x' }, token), 400);

  // ── Tracker ─────────────────────────────
  console.log('\n── Tracker ──');
  log('GET /api/tracker/companies', await req('GET', '/api/tracker/companies', null, token));
  log('GET /api/tracker/progress', await req('GET', '/api/tracker/progress', null, token));
  log('GET /api/tracker/activity', await req('GET', '/api/tracker/activity', null, token));
  log('PUT /api/tracker/status', await req('PUT', '/api/tracker/status', { placementStatus: 'preparing' }, token));

  // ── Interview ───────────────────────────
  console.log('\n── Interview ──');
  log('GET  /api/interview/sessions', await req('GET', '/api/interview/sessions', null, token));
  log('POST /api/interview/message (no sessionId → 400)', await req('POST', '/api/interview/message', { message: 'hi' }, token), 400);
  log('POST /api/interview/message (too long → 400)', await req('POST', '/api/interview/message', { sessionId: 'x', message: 'x'.repeat(2001) }, token), 400);

  // ── Resume ──────────────────────────────
  console.log('\n── Resume ──');
  log('GET /api/resume/analysis', await req('GET', '/api/resume/analysis', null, token));

  // ── Roadmap ─────────────────────────────
  console.log('\n── Roadmap ──');
  log('GET /api/roadmap', await req('GET', '/api/roadmap', null, token));

  // ── Leaderboard ─────────────────────────
  console.log('\n── Leaderboard ──');
  log('GET /api/leaderboard', await req('GET', '/api/leaderboard', null, token));

  // ── Summary ─────────────────────────────
  const total = pass + fail;
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║  RESULTS: ' + pass + '/' + total + ' passed, ' + fail + ' failed' + '             ║'.slice(('' + pass + total + fail).length));
  console.log('╚══════════════════════════════════════╝\n');

  server.close();
  process.exit(fail > 0 ? 1 : 0);
});

server.on('error', e => { console.error('Server failed to start:', e.message); process.exit(1); });
setTimeout(() => { console.log('\nTIMEOUT after 30s'); server.close(); process.exit(1); }, 30000);
