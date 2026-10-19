import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

// Existing shell/hosting variables take precedence over the local file.
if (existsSync(".env.local")) loadEnvFile(".env.local");

const env = process.env;
const checks = [
  {
    name: "Last.fm",
    required: ["LASTFM_API_KEY", "LASTFM_USERNAME"],
    url: () => "https://ws.audioscrobbler.com/2.0/?" + new URLSearchParams({
      method: "user.getrecenttracks", user: env.LASTFM_USERNAME,
      api_key: env.LASTFM_API_KEY, format: "json", limit: "1",
    }),
    validate: data => !data.error && Array.isArray(data.recenttracks?.track),
    help: "Check LASTFM_API_KEY, LASTFM_USERNAME, and Last.fm listening privacy.",
  },
  {
    name: "Trakt",
    required: ["TRAKT_CLIENT_ID", "TRAKT_USERNAME"],
    url: () => `https://api.trakt.tv/users/${encodeURIComponent(env.TRAKT_USERNAME)}/history?limit=1`,
    headers: () => ({
      "Content-Type": "application/json", "trakt-api-version": "2",
      "trakt-api-key": env.TRAKT_CLIENT_ID,
      "User-Agent": "mariobarraza-personal-site/1.0",
    }),
    validate: Array.isArray,
    help: "403: invalid Client ID or unapproved app; check https://developer.trakt.tv/apps. 401: OAuth required for this account.",
  },
  {
    name: "TMDB artwork",
    required: ["TMDB_API_KEY"],
    url: () => "https://api.themoviedb.org/3/configuration?" + new URLSearchParams({ api_key: env.TMDB_API_KEY }),
    validate: data => Boolean(data.images?.secure_base_url),
    help: "Check TMDB_API_KEY in your TMDB account settings.",
  },
];

let failed = false;
for (const check of checks) {
  const missing = check.required.filter(key => !env[key]?.trim());
  if (missing.length) {
    console.error(`${check.name}: missing ${missing.join(", ")}`);
    failed = true;
    continue;
  }
  try {
    const res = await fetch(check.url(), {
      headers: check.headers?.(), signal: AbortSignal.timeout(10000),
    });
    let data;
    try { data = await res.json(); } catch { /* Some errors return plain text. */ }
    if (!res.ok || !data || !check.validate(data)) {
      console.error(`${check.name}: failed (HTTP ${res.status}${data?.error ? `, API code ${data.error}` : ""}). ${check.help}`);
      failed = true;
    } else {
      console.log(`${check.name}: OK (HTTP ${res.status})`);
    }
  } catch {
    // Never print raw errors or request URLs: they can contain credentials.
    console.error(`${check.name}: connection failed or timed out. Check connectivity and retry.`);
    failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
