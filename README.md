## Want to recreate?


Clone repo.
```bash
git clone https://github.com/reselling/personal-website
```

Navigate to where its stored (Recommend using VS Code)

Update your environment variables with your own API info.

Run development server in terminal.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) w/in your browser. 

Created with [Next.js](https://nextjs.org) and hosted with Vercel.

## Checking the Now integrations

Run `npm run check:integrations` with Node.js 20.12 or newer. It reads
`.env.local` and reports connection status without printing credentials.
Last.fm supplies listening activity, Trakt supplies watch history, and TMDB
supplies movie and TV artwork.

If Trakt returns 403, check the existing app's status and Client ID at
[Trakt Developer](https://developer.trakt.tv/apps). Trakt documents this as an
invalid API key or unapproved app; it does not establish that a token expired.
Use the app's Client ID for `TRAKT_CLIENT_ID`, not its Client Secret.

Credentials in `.env.local` only affect local development. Update the matching
server-side environment variables in Vercel and redeploy when changing them.
Never commit `.env.local` or add a `NEXT_PUBLIC_` prefix to private API keys.

Monthly listening stats refresh every five minutes. Errors display an unavailable
message instead of partial rankings or an empty activity list. Last.fm artwork
hosts are allowed explicitly in `next.config.ts`.

## Private visitor records in PostHog

Create a PostHog project and set these in `.env.local` and Vercel's **Production**
environment before deploying:

```env
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_your_public_project_token
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Use `https://eu.i.posthog.com` for an EU project. The project token is intentionally
public and only permits ingestion; never substitute a personal API key. The build
rejects personal keys in this variable. Without a token, detailed analytics stays off.

The browser SDK records initial page views and Next.js route changes. A random ID
persists in first-party cookies and local storage (cookie lifetime: up to 365 days,
subject to browser limits). Different browser profiles, private sessions, or cleared
storage can create new IDs. There is no device fingerprinting or login identification.

Open **People** in your private PostHog dashboard to find `Visitor …` profiles. Each
profile has a first-seen time, latest visit time, browser/OS/device type, and an event
timeline containing pages and referrers. Event timestamps show the precise visit times;
`$session_id` separates sessions while `distinct_id` connects returning visits.

IP addresses are captured by PostHog's ingestion service from the browser connection,
not supplied by browser JavaScript. Check **Settings → Project → IP data capture
configuration** and leave **Discard client IP data** off to retain the requested raw
IP. Inspect `$ip` on each page-view event; the same browser can have different IPs.
The website has no public endpoint for reading visitor records. PostHog account access
controls who can view them.

This integration only sends page views. Interaction autocapture, session recordings,
heatmaps, console logs, performance capture, and surveys are disabled. URL queries and
fragments are stripped from page and referrer URLs, including person properties.
Do Not Track is respected. A `/privacy` page explains the data and includes a browser
preference for detailed tracking; existing Vercel aggregate analytics is separate.

Localhost and Vercel preview domains are excluded. For production testing, visit
`https://mariobarraza.com/?analytics=off` once to exclude that browser persistently.
Use `?analytics=on` or the Privacy page to allow tracking again. Changes take effect
on reload. Test exclusions apply to PostHog, not existing Vercel aggregate counts.

Run `npm run test:analytics`, `npm run lint`, and `npm run build` before publishing.
After deployment, open the website in a browser with tracking allowed, navigate to
another page, reload, and confirm in PostHog that the events share a distinct ID.
In a separate browser, confirm a different distinct ID appears. Check `$ip` and
referring domain on the events to verify project ingestion settings.
