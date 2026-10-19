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
Never commit `.env.local` or add a `NEXT_PUBLIC_` prefix to API keys.

Monthly listening stats refresh every five minutes. Errors display an unavailable
message instead of partial rankings or an empty activity list. Last.fm artwork
hosts are allowed explicitly in `next.config.ts`.
