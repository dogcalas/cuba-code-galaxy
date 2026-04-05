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
  async fetch(request, env) {
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

    // ── POST /api/scan — Scan all known Cuban devs for new repos ──
    if (url.pathname === '/api/scan' && request.method === 'POST') {
      const result = await scanCubanDevs(env);
      return json(result);
    }

    return json({ error: 'Not found' }, 404);
  },

  // Cron trigger: scan every 6 hours
  async scheduled(event, env, ctx) {
    ctx.waitUntil(scanCubanDevs(env));
  },
};

// ── Scanner: fetch repos from all known Cuban devs via GitHub API ─────────
async function scanCubanDevs(env) {
  const token = env.GITHUB_TOKEN;
  if (!token) return { error: 'GITHUB_TOKEN not set' };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'CubaCodeGalaxy/1.0',
  };

  // Get all known devs
  const { results: devs } = await env.DB.prepare('SELECT login FROM devs').all();
  let added = 0, scanned = 0, errors = 0;

  for (const dev of devs) {
    try {
      // Fetch dev's repos (up to 100)
      const res = await fetch(
        `https://api.github.com/users/${dev.login}/repos?per_page=100&sort=updated`,
        { headers }
      );
      if (!res.ok) { errors++; continue; }
      const repos = await res.json();
      scanned++;

      // Also update dev profile
      const profileRes = await fetch(`https://api.github.com/users/${dev.login}`, { headers });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        await env.DB.prepare(
          'UPDATE devs SET name = ?, followers = ?, repos_count = ?, bio = ? WHERE login = ?'
        ).bind(
          profile.name || dev.login,
          profile.followers || 0,
          profile.public_repos || 0,
          profile.bio || '',
          dev.login
        ).run();
      }

      for (const repo of repos) {
        if (!repo.language || repo.fork) continue; // skip forks and language-less repos
        const fullName = repo.full_name;
        const pushed = repo.pushed_at ? repo.pushed_at.slice(0, 10) : '';

        const existing = await env.DB.prepare('SELECT id FROM repos WHERE repo = ?').bind(fullName).first();
        if (existing) {
          // Update existing repo stats
          await env.DB.prepare(
            'UPDATE repos SET stars = ?, forks = ?, pushed = ?, description = ?, lang = ? WHERE repo = ?'
          ).bind(
            repo.stargazers_count, repo.forks_count, pushed,
            repo.description || '', repo.language, fullName
          ).run();
        } else {
          // Insert new repo
          await env.DB.prepare(
            'INSERT OR IGNORE INTO repos (repo, lang, stars, forks, pushed, description) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(
            fullName, repo.language, repo.stargazers_count,
            repo.forks_count, pushed, repo.description || ''
          ).run();
          added++;
        }
      }
    } catch (e) {
      errors++;
    }
  }

  return { scanned, added, errors, total_devs: devs.length };
}
