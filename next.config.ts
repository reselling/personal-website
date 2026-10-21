import type { NextConfig } from "next";

const analyticsToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
if (analyticsToken && !/^phc_[A-Za-z0-9_-]+$/.test(analyticsToken)) {
  throw new Error("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN must be a public PostHog project token (phc_), never a personal API key.");
}
if (analyticsToken && process.env.NEXT_PUBLIC_POSTHOG_HOST && ![
  "https://us.i.posthog.com", "https://eu.i.posthog.com",
].includes(process.env.NEXT_PUBLIC_POSTHOG_HOST)) {
  throw new Error("NEXT_PUBLIC_POSTHOG_HOST must match the project's US or EU PostHog ingestion host.");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
      { protocol: "https", hostname: "lastfm-img.freetls.fastly.net" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "assets.hardcover.app" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "www.notion.so" },
    ],
  },
};

export default nextConfig;
