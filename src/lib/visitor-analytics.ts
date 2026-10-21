import type { CaptureResult, PostHogConfig } from "posthog-js";

export const ANALYTICS_EXCLUSION_KEY = "website_detailed_analytics_excluded";

export function isPublicWebsite(hostname: string): boolean {
  return hostname === "mariobarraza.com" || hostname === "www.mariobarraza.com";
}

export function isVisitorTrackingExcluded(): boolean {
  try {
    return window.localStorage.getItem(ANALYTICS_EXCLUSION_KEY) === "true";
  } catch {
    // Without storage we cannot reliably persist a preference or visitor ID.
    return true;
  }
}

export function setVisitorTrackingExcluded(excluded: boolean): void {
  window.localStorage.setItem(ANALYTICS_EXCLUSION_KEY, String(excluded));
}

export function applyVisitorTrackingQueryPreference(): void {
  const preference = new URLSearchParams(window.location.search).get("analytics");
  if (preference === "off" || preference === "on") {
    try {
      setVisitorTrackingExcluded(preference === "off");
    } catch {
      // Tracking stays disabled when the browser does not permit storage.
    }
  }
}

function stripUrlDetails(value: string): string {
  try {
    const url = new URL(value);
    return url.origin + url.pathname;
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
}

function cleanProperties(properties: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(properties).map(([key, value]) => {
    if (typeof value === "string" && /(?:url|referrer|pathname)$/i.test(key)) {
      return [key, stripUrlDetails(value)];
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return [key, cleanProperties(value as Record<string, unknown>)];
    }
    return [key, value];
  }));
}

export function prepareVisitorEvent(event: CaptureResult): CaptureResult | null {
  // This integration records page visits only, including client-side navigation.
  if (event.event !== "$pageview") return null;

  const properties = cleanProperties(event.properties);
  const distinctId = String(properties.distinct_id ?? "");
  if (!distinctId) return null;
  const now = new Date().toISOString();
  const firstProperties = cleanProperties({
    ...event.$set_once,
    ...(properties.$set_once as Record<string, unknown> | undefined),
  });
  const latestProperties = cleanProperties({
    ...event.$set,
    ...(properties.$set as Record<string, unknown> | undefined),
  });
  delete properties.$set;
  delete properties.$set_once;

  return {
    ...event,
    properties,
    $set_once: {
      ...firstProperties,
      name: `Visitor ${distinctId.slice(-8)}`,
      first_seen_at: now,
    },
    $set: {
      ...latestProperties,
      last_seen_at: now,
      last_pathname: properties.$pathname,
      browser: properties.$browser,
      operating_system: properties.$os,
      device_type: properties.$device_type,
    },
  };
}

export function visitorAnalyticsConfig(apiHost: string): Partial<PostHogConfig> {
  return {
    api_host: apiHost,
    defaults: "2026-08-30",
    persistence: "localStorage+cookie",
    cookie_expiration: 365,
    secure_cookie: true,
    cross_subdomain_cookie: true,
    person_profiles: "always",
    capture_pageview: "history_change",
    capture_pageleave: false,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    capture_exceptions: false,
    capture_heatmaps: false,
    capture_performance: false,
    enable_recording_console_log: false,
    advanced_disable_feature_flags: true,
    disable_external_dependency_loading: true,
    disable_capture_url_hashes: true,
    save_campaign_params: false,
    respect_dnt: true,
    before_send: (event) => isVisitorTrackingExcluded() ? null : prepareVisitorEvent(event),
  };
}
