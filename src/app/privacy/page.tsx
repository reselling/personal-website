import type { Metadata } from "next";
import { TrackingPreference } from "@/components/analytics/tracking-preference";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How visitor analytics work on this website and how to change your preference.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Privacy</h1>
      <section className="space-y-3 text-foreground/70 leading-relaxed">
        <h2 className="text-xl font-semibold text-foreground">Visitor analytics</h2>
        <p>
          When configured, this website uses PostHog to understand visits and return visits.
          It records the pages viewed, visit times, referring website, browser, operating system,
          device type, and public IP address. These records are available to the site owner in
          a private analytics dashboard.
        </p>
        <p>
          A random visitor ID is stored in this browser’s cookies and local storage to connect
          visits. The cookie is configured for up to one year; browser settings may shorten
          that period. Different browsers or cleared storage can produce separate IDs.
          An ID represents a browser, rather than an identified person.
        </p>
        <p>
          This integration records page visits, with query strings and URL fragments removed.
          It does not record your screen, capture form entries, or associate visits with a name,
          email address, or Instagram account. Retention is controlled by the PostHog project’s
          settings and plan.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your preference</h2>
        <TrackingPreference />
        <p className="text-sm text-foreground/60 leading-relaxed">
          This preference applies to this browser and takes effect on reload. Previously
          collected visits are not removed by changing it. The website also uses Vercel Web
          Analytics for anonymous aggregate traffic counts; the preference above controls
          PostHog’s detailed visitor tracking.
        </p>
      </section>
      <p className="text-sm text-foreground/60">
        Questions about visitor data? <a href="mailto:owner@mariobarraza.com" className="underline">Email me</a>.
      </p>
    </div>
  );
}
