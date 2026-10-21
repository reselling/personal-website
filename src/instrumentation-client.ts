import {
  applyVisitorTrackingQueryPreference,
  isPublicWebsite,
  isVisitorTrackingExcluded,
  visitorAnalyticsConfig,
} from "@/lib/visitor-analytics";

applyVisitorTrackingQueryPreference();

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

// Local development and Vercel previews do not add visitors to the live project.
if (token && isPublicWebsite(window.location.hostname) && !isVisitorTrackingExcluded()) {
  void import("posthog-js").then(({ default: posthog }) => {
    if (!isVisitorTrackingExcluded()) {
      posthog.init(token, visitorAnalyticsConfig(apiHost));
    }
  }).catch(() => {
    // An analytics download failure must not prevent the website from loading.
  });
}
