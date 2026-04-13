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

        // Validate URL format and extract owner/repo
        const match = repo_url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
        if (!match) {
          return json({ error: 'URL invalida. Debe ser un repo de GitHub (https://github.com/usuario/repo)' }, 400);
        }
        const fullName = `${match[1]}/${match[2].replace(/\.git$/, '')}`;
        const normalizedUrl = `https://github.com/${fullName}`;

        // Check duplicate in repos table (case-insensitive)
        const existingRepo = await env.DB.prepare(
          'SELECT repo FROM repos WHERE LOWER(repo) = LOWER(?)'
        ).bind(fullName).first();
        if (existingRepo) {
          return json({ error: 'Este repo ya existe en la galaxia: ' + existingRepo.repo }, 409);
        }

        // Check duplicate in submissions (any status)
        const existingSub = await env.DB.prepare(
          "SELECT id, status FROM submissions WHERE LOWER(repo_url) LIKE LOWER(?)"
        ).bind('%' + fullName + '%').first();
        if (existingSub) {
          const msg = existingSub.status === 'pending'
            ? 'Este repo ya fue enviado y esta en revision'
            : existingSub.status === 'approved'
            ? 'Este repo ya fue aprobado anteriormente'
            : 'Este repo ya fue rechazado anteriormente';
          return json({ error: msg }, 409);
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
          return json({ error: 'Verificacion Turnstile fallida' }, 403);
        }

        await env.DB.prepare(
          'INSERT INTO submissions (repo_url, submitter_name, reason) VALUES (?, ?, ?)'
        ).bind(normalizedUrl, submitter_name || 'Anon', reason || '').run();

        return json({ ok: true, message: 'Repo enviado, pendiente de revision' });
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

    // ── POST /api/approve — approve a submission (admin) ──
    // Also adds the owner to devs table and scans all their repos
    if (url.pathname === '/api/approve' && request.method === 'POST') {
      const body = await request.json();
      const { id, admin_key } = body;
      if (!admin_key || admin_key !== env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
      if (!id) return json({ error: 'id required' }, 400);

      const sub = await env.DB.prepare('SELECT * FROM submissions WHERE id = ?').bind(id).first();
      if (!sub) return json({ error: 'Submission not found' }, 404);

      const repoPath = sub.repo_url.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      const ghHeaders = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'CubaCodeGalaxy/1.0' };
      if (env.GITHUB_TOKEN) ghHeaders['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;

      try {
        // 1. Fetch the submitted repo
        const ghRes = await fetch(`https://api.github.com/repos/${repoPath}`, { headers: ghHeaders });
        if (!ghRes.ok) return json({ error: 'GitHub repo not found: ' + repoPath }, 404);
        const repo = await ghRes.json();

        // 2. Insert the repo
        await env.DB.prepare(
          'INSERT INTO repos (repo, lang, stars, forks, pushed, description) VALUES (?, ?, ?, ?, ?, ?) ' +
          'ON CONFLICT(repo) DO UPDATE SET stars=excluded.stars, forks=excluded.forks, pushed=excluded.pushed, description=excluded.description, lang=excluded.lang'
        ).bind(
          repo.full_name, repo.language || 'Unknown', repo.stargazers_count,
          repo.forks_count, (repo.pushed_at || '').slice(0, 10), repo.description || ''
        ).run();

        // 3. Check if owner is a User (not an Organization)
        // Organizations may contain repos from non-Cuban contributors,
        // so we only auto-scan personal user accounts.
        const ownerLogin = repo.owner.login;
        const ownerType = repo.owner.type; // "User" or "Organization"
        const profileRes = await fetch(`https://api.github.com/users/${ownerLogin}`, { headers: ghHeaders });
        let ownerInfo = { login: ownerLogin, name: ownerLogin, followers: 0, public_repos: 0, bio: '' };
        if (profileRes.ok) ownerInfo = { ...ownerInfo, ...(await profileRes.json()) };

        const isUser = ownerType === 'User';

        // Only add individual users to devs table, not organizations
        if (isUser) {
          await env.DB.prepare(
            'INSERT INTO devs (login, name, followers, repos_count, bio) VALUES (?, ?, ?, ?, ?) ' +
            'ON CONFLICT(login) DO UPDATE SET name=excluded.name, followers=excluded.followers, repos_count=excluded.repos_count, bio=excluded.bio'
          ).bind(
            ownerLogin,
            ownerInfo.name || ownerLogin,
            ownerInfo.followers || 0,
            ownerInfo.public_repos || 0,
            ownerInfo.bio || ''
          ).run();
        }

        // 4. Scan all of this owner's repos in background — only for Users
        let scanningOwnerRepos = false;
        if (isUser) {
          scanningOwnerRepos = true;
          ctx.waitUntil((async () => {
            try {
              const reposRes = await fetch(
                `https://api.github.com/users/${ownerLogin}/repos?per_page=100&sort=updated`,
                { headers: ghHeaders }
              );
              if (!reposRes.ok) return;
              const allRepos = await reposRes.json();
              const stmt = env.DB.prepare(
                'INSERT INTO repos (repo, lang, stars, forks, pushed, description) VALUES (?, ?, ?, ?, ?, ?) ' +
                'ON CONFLICT(repo) DO UPDATE SET stars=excluded.stars, forks=excluded.forks, pushed=excluded.pushed, description=excluded.description, lang=excluded.lang'
              );
              const batch = [];
              for (const r of allRepos) {
                if (!r.language || r.fork) continue;
                batch.push(stmt.bind(
                  r.full_name, r.language, r.stargazers_count, r.forks_count,
                  (r.pushed_at || '').slice(0, 10), r.description || ''
                ));
              }
              if (batch.length > 0) await env.DB.batch(batch);
            } catch (e) {}
          })());
        }

        await env.DB.prepare("UPDATE submissions SET status = 'approved' WHERE id = ?").bind(id).run();
        return json({
          ok: true, repo: repo.full_name, owner: ownerLogin,
          owner_type: ownerType,
          scanning_owner_repos: scanningOwnerRepos,
          skipped_org_scan: !isUser ? `${ownerLogin} is an Organization — only the submitted repo was added` : undefined,
        });
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

    // ── GET /api/admin/stats — full stats for admin dashboard ──
    if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
      const stats = await env.DB.batch([
        env.DB.prepare('SELECT COUNT(*) as c FROM repos'),
        env.DB.prepare('SELECT COUNT(*) as c FROM devs'),
        env.DB.prepare('SELECT COUNT(DISTINCT lang) as c FROM repos'),
        env.DB.prepare('SELECT SUM(stars) as s, SUM(forks) as f FROM repos'),
        env.DB.prepare('SELECT COUNT(*) as c FROM submissions WHERE status = ?').bind('pending'),
        env.DB.prepare('SELECT COUNT(*) as c FROM submissions'),
        env.DB.prepare('SELECT COUNT(DISTINCT LOWER(SUBSTR(repo,1,INSTR(repo,\'/\')-1))) as c FROM repos'),
        env.DB.prepare('SELECT lang, COUNT(*) as c FROM repos GROUP BY lang ORDER BY c DESC LIMIT 10'),
        env.DB.prepare('SELECT repo, stars FROM repos ORDER BY stars DESC LIMIT 5'),
      ]);
      return json({
        repos: stats[0].results[0].c,
        devs: stats[1].results[0].c,
        langs: stats[2].results[0].c,
        stars: stats[3].results[0].s || 0,
        forks: stats[3].results[0].f || 0,
        pending_submissions: stats[4].results[0].c,
        total_submissions: stats[5].results[0].c,
        unique_owners: stats[6].results[0].c,
        top_langs: stats[7].results,
        top_repos: stats[8].results,
      });
    }

    // ── GET /api/admin/repos — paginated repos with search ──
    if (url.pathname === '/api/admin/repos' && request.method === 'GET') {
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
      const perPage = Math.min(100, parseInt(url.searchParams.get('per_page') || '25'));
      const q = url.searchParams.get('q') || '';
      const offset = (page - 1) * perPage;

      let countSql, listSql, params = [];
      if (q) {
        const like = '%' + q + '%';
        countSql = 'SELECT COUNT(*) as c FROM repos WHERE repo LIKE ? OR description LIKE ? OR lang LIKE ?';
        listSql = 'SELECT id, repo, lang, stars, forks, pushed, description FROM repos WHERE repo LIKE ? OR description LIKE ? OR lang LIKE ? ORDER BY stars DESC LIMIT ? OFFSET ?';
        params = [like, like, like];
      } else {
        countSql = 'SELECT COUNT(*) as c FROM repos';
        listSql = 'SELECT id, repo, lang, stars, forks, pushed, description FROM repos ORDER BY stars DESC LIMIT ? OFFSET ?';
      }

      const total = (await env.DB.prepare(countSql).bind(...params).first()).c;
      const { results } = await env.DB.prepare(listSql).bind(...params, perPage, offset).all();

      return json({ total, page, per_page: perPage, total_pages: Math.ceil(total / perPage), repos: results });
    }

    // ── DELETE /api/admin/repo — delete a repo (admin) ──
    if (url.pathname === '/api/admin/repo' && request.method === 'POST') {
      const body = await request.json();
      const { id, admin_key } = body;
      if (!admin_key || admin_key !== env.ADMIN_KEY) return json({ error: 'Unauthorized' }, 401);
      if (!id) return json({ error: 'id required' }, 400);
      await env.DB.prepare('DELETE FROM repos WHERE id = ?').bind(id).run();
      return json({ ok: true });
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
  let totalRepos = 0, scanned = 0, skippedOrgs = 0, errors = 0;

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
      // First fetch profile to check if it's a User or Organization
      const profileRes = await fetch(`https://api.github.com/users/${dev.login}`, { headers });
      if (!profileRes.ok) { errors++; continue; }
      const profile = await profileRes.json();

      // Skip organizations — only scan individual users' repos
      // Orgs may have repos from non-Cuban contributors
      if (profile.type === 'Organization') {
        skippedOrgs++;
        continue;
      }

      // Fetch repos only for Users
      const reposRes = await fetch(
        `https://api.github.com/users/${dev.login}/repos?per_page=100&sort=updated`,
        { headers }
      );
      if (!reposRes.ok) { errors++; continue; }
      const repos = await reposRes.json();
      scanned++;

      // Build batch of statements for this dev
      const batch = [];

      batch.push(devStmt.bind(
        profile.name || dev.login,
        profile.followers || 0,
        profile.public_repos || 0,
        profile.bio || '',
        dev.login
      ));

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

  return { scanned, repos_processed: totalRepos, skipped_orgs: skippedOrgs, errors, total_devs: devs.length };
}
