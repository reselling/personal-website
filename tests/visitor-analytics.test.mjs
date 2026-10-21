import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const code = ts.transpileModule(fs.readFileSync("src/lib/visitor-analytics.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function loadAnalytics({ search = "", storage = new Map(), unavailable = false } = {}) {
  const api = {};
  vm.runInNewContext(code, {
    exports: api, URL, URLSearchParams,
    window: {
      location: { search },
      localStorage: {
        getItem(key) { if (unavailable) throw Error("Storage unavailable"); return storage.get(key) ?? null; },
        setItem(key, value) { if (unavailable) throw Error("Storage unavailable"); storage.set(key, value); },
      },
    },
  });
  return api;
}

const event = () => ({
  uuid: "event-1", event: "$pageview",
  properties: {
    distinct_id: "browser-12345678", $session_id: "session-1",
    $current_url: "https://mariobarraza.com/now?email=private#secret",
    $pathname: "/now", $referrer: "https://l.instagram.com/?token=private",
    $browser: "Safari", $os: "iOS", $device_type: "Mobile",
  },
  $set_once: { $initial_current_url: "https://mariobarraza.com/?token=private", $initial_referring_domain: "l.instagram.com" },
});

test("preview, localhost, and lookalike domains cannot collect production visitors", () => {
  const api = loadAnalytics();
  for (const host of ["localhost", "127.0.0.1", "personal-website.vercel.app", "mariobarraza.com.example.org"]) {
    assert.equal(api.isPublicWebsite(host), false);
  }
  assert.equal(api.isPublicWebsite("mariobarraza.com"), true);
  assert.equal(api.isPublicWebsite("www.mariobarraza.com"), true);
});

test("test exclusion persists across visits and can be reversed", () => {
  const storage = new Map();
  let api = loadAnalytics({ search: "?analytics=off", storage });
  api.applyVisitorTrackingQueryPreference();
  assert.equal(api.visitorAnalyticsConfig("https://us.i.posthog.com").before_send(event()), null);
  api = loadAnalytics({ storage });
  assert.equal(api.isVisitorTrackingExcluded(), true);
  api = loadAnalytics({ search: "?analytics=on", storage });
  api.applyVisitorTrackingQueryPreference();
  assert.equal(api.isVisitorTrackingExcluded(), false);
});

test("unavailable storage fails closed without crashing the site", () => {
  const api = loadAnalytics({ unavailable: true, search: "?analytics=off" });
  api.applyVisitorTrackingQueryPreference();
  assert.equal(api.isVisitorTrackingExcluded(), true);
  assert.equal(api.visitorAnalyticsConfig("https://us.i.posthog.com").before_send(event()), null);
});

test("page visits preserve identity, session, referrer domain, and browser details", () => {
  const api = loadAnalytics();
  const prepared = api.prepareVisitorEvent(event());
  assert.equal(prepared.properties.distinct_id, "browser-12345678");
  assert.equal(prepared.properties.$session_id, "session-1");
  assert.equal(prepared.$set_once.name, "Visitor 12345678");
  assert.equal(prepared.$set_once.$initial_referring_domain, "l.instagram.com");
  assert.equal(prepared.$set.operating_system, "iOS");
  assert.equal(prepared.$set.last_pathname, "/now");
});

test("private URL details are removed from both events and person properties", () => {
  const api = loadAnalytics();
  const input = event();
  input.properties.$set = { last_url: "https://mariobarraza.com/projects?key=private#secret" };
  input.$set = { previous_url: "https://mariobarraza.com/?token=private" };
  const prepared = api.prepareVisitorEvent(input);
  assert.equal(prepared.properties.$current_url, "https://mariobarraza.com/now");
  assert.equal(prepared.properties.$referrer, "https://l.instagram.com/");
  assert.equal(prepared.$set_once.$initial_current_url, "https://mariobarraza.com/");
  assert.equal(prepared.$set.last_url, "https://mariobarraza.com/projects");
  assert.equal(prepared.$set.previous_url, "https://mariobarraza.com/");
  assert.equal(JSON.stringify(prepared).includes("private"), false);
  assert.ok(input.properties.$current_url.includes("private"), "does not mutate the SDK input");
});

test("unexpected interaction events and events missing identity are dropped", () => {
  const api = loadAnalytics();
  assert.equal(api.prepareVisitorEvent({ ...event(), event: "$autocapture" }), null);
  const noId = event();
  delete noId.properties.distinct_id;
  assert.equal(api.prepareVisitorEvent(noId), null);
});
