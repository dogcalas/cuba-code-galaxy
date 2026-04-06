// Cuba Code Galaxy — Cloudflare Worker API
// Endpoints:
//   GET  /api/repos        — all repos as JSON
//   GET  /api/devs         — all devs as JSON
//   POST /api/submit       — submit a new repo (Turnstile-protected)
//   POST /api/scan         — trigger scan of Cuban devs' repos (cron or manual)
//   GET  /api/submissions  — list pending submissions

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // ── GET /api/repos ──
    if (url.pathname === '/api/repos' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT repo, lang, stars, forks, pushed, description as desc FROM repos ORDER BY stars DESC'
      ).all();
      return json(results);
    }

    // ── GET /api/devs ──
    if (url.pathname === '/api/devs' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT login, name, followers, repos_count as repos, bio FROM devs ORDER BY followers DESC'
      ).all();
      return json(results);
    }

    // ── POST /api/submit — Turnstile-protected repo submission ──
    if (url.pathname === '/api/submit' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { repo_url, submitter_name, reason, turnstile_token } = body;

        if (!repo_url || !turnstile_token) {
          return json({ error: 'repo_url and turnstile_token are required' }, 400);
        }

        // Verify Turnstile
        const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: env.TURNSTILE_SECRET,
            response: turnstile_token,
            remoteip: request.headers.get('CF-Connecting-IP'),
          }),
        });
        const tsData = await tsRes.json();
        if (!tsData.success) {
          return json({ error: 'Turnstile verification failed' }, 403);
        }

        await env.DB.prepare(
          'INSERT INTO submissions (repo_url, submitter_name, reason) VALUES (?, ?, ?)'
        ).bind(repo_url, submitter_name || 'Anon', reason || '').run();

        return json({ ok: true, message: 'Submission received — pending review' });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── GET /api/submissions ──
    if (url.pathname === '/api/submissions' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM submissions ORDER BY created_at DESC LIMIT 100'
      ).all();
      return json(results);
    }

    // ── POST /api/approve — approve a submission (admin, secret-protected) ──
    if (url.pathname === '/api/approve' && request.method === 'POST') {
      const body = await request.json();
      const { id, admin_key } = body;
      if (!admin_key || admin_key !== env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
      if (!id) return json({ error: 'id required' }, 400);

      const sub = await env.DB.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first();
      if (!sub) return json({ error: 'Submission not found' }, 404);

      // Fetch repo info from GitHub
      const repoPath = sub.repo_url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      try {
        const ghHeaders = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'CubaCodeGalaxy/1.0' };
        if (env.GITHUB_TOKEN) ghHeaders['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
        const ghRes = await fetch(`https://api.github.com/repos/${repoPath}`, { headers: ghHeaders });
        if (!ghRes.ok) return json({ error: 'GitHub repo not found: ' + repoPath }, 404);
        const repo = await ghRes.json();

        await env.DB.prepare(
          'INSERT OR IGNORE INTO repos (repo, lang, stars, forks, pushed, description) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
          repo.full_name, repo.language || 'Unknown', repo.stargazers_count,
          repo.forks_count, (repo.pushed_at || '').slice(0, 10), repo.description || ''
        ).run();

        await env.DB.prepare("UPDATE submissions SET status = 'approved' WHERE id = ?").bind(id).run();
        return json({ ok: true, repo: repo.full_name });
      } catch (e) {
        return json({ error: e.message }, 500);
      }
    }

    // ── POST /api/reject — reject a submission (admin) ──
    if (url.pathname === '/api/reject' && request.method === 'POST') {
      const body = await request.json();
      const { id, admin_key } = body;
      if (!admin_key || admin_key !== env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
      if (!id) return json({ error: 'id required' }, 400);
      await env.DB.prepare("UPDATE submissions SET status = 'rejected' WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }

    // ── POST /api/scan — Scan all known Cuban devs for new repos ──
    // Returns immediately, processes in background to avoid 30s CPU limit
    if (url.pathname === '/api/scan' && request.method === 'POST') {
      ctx.waitUntil(scanCubanDevs(env));
      return json({ ok: true, message: 'Scan started in background', estimated_seconds: 30 });
    }

    // ── GET /api/scan/status — count devs/repos ──
    if (url.pathname === '/api/scan/status' && request.method === 'GET') {
      const r = await env.DB.prepare('SELECT COUNT(*) as c FROM repos').first();
      const d = await env.DB.prepare('SELECT COUNT(*) as c FROM devs').first();
      return json({ repos: r.c, devs: d.c });
    }

    return json({ error: 'Not found' }, 404);
  },

  // Cron trigger: scan every 6 hours
  async scheduled(event, env, ctx) {
    ctx.waitUntil(scanCubanDevs(env));
  },
};

// ── Scanner: fetch repos from all known Cuban devs via GitHub API ─────────
// Optimized: batch D1 writes, parallel GitHub fetches per dev
async function scanCubanDevs(env) {
  const token = env.GITHUB_TOKEN;
  if (!token) return { error: 'GITHUB_TOKEN not set' };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'CubaCodeGalaxy/1.0',
  };

  const { results: devs } = await env.DB.prepare('SELECT login FROM devs').all();
  let totalRepos = 0, scanned = 0, errors = 0;

  // Prepared statement reused for all repo upserts
  const repoStmt = env.DB.prepare(
    'INSERT INTO repos (repo, lang, stars, forks, pushed, description) VALUES (?, ?, ?, ?, ?, ?) ' +
    'ON CONFLICT(repo) DO UPDATE SET stars=excluded.stars, forks=excluded.forks, pushed=excluded.pushed, ' +
    'description=excluded.description, lang=excluded.lang'
  );
  const devStmt = env.DB.prepare(
    'UPDATE devs SET name = ?, followers = ?, repos_count = ?, bio = ? WHERE login = ?'
  );

  for (const dev of devs) {
    try {
      // Parallel fetch: profile + repos
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${dev.login}`, { headers }),
        fetch(`https://api.github.com/users/${dev.login}/repos?per_page=100&sort=updated`, { headers }),
      ]);
      if (!reposRes.ok) { errors++; continue; }
      const repos = await reposRes.json();
      scanned++;

      // Build batch of statements for this dev
      const batch = [];

      if (profileRes.ok) {
        const profile = await profileRes.json();
        batch.push(devStmt.bind(
          profile.name || dev.login,
          profile.followers || 0,
          profile.public_repos || 0,
          profile.bio || '',
          dev.login
        ));
      }

      for (const repo of repos) {
        if (!repo.language || repo.fork) continue;
        batch.push(repoStmt.bind(
          repo.full_name,
          repo.language,
          repo.stargazers_count,
          repo.forks_count,
          (repo.pushed_at || '').slice(0, 10),
          repo.description || ''
        ));
        totalRepos++;
      }

      if (batch.length > 0) await env.DB.batch(batch);
    } catch (e) {
      errors++;
    }
  }

  return { scanned, repos_processed: totalRepos, errors, total_devs: devs.length };
}
