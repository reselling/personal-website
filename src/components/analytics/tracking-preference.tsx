"use client";

import { useState, useSyncExternalStore } from "react";
import { isVisitorTrackingExcluded, setVisitorTrackingExcluded } from "@/lib/visitor-analytics";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function TrackingPreference() {
  const excluded = useSyncExternalStore(subscribe, isVisitorTrackingExcluded, () => null);
  const [error, setError] = useState("");

  function toggle() {
    try {
      setVisitorTrackingExcluded(!excluded);
      window.location.reload();
    } catch {
      setError("Your browser could not save this preference. Detailed tracking stays disabled when browser storage is unavailable.");
    }
  }

  return (
    <div className="rounded-lg border border-foreground/10 p-4 space-y-3">
      <p className="text-sm text-foreground/70" role="status">
        {excluded === null ? "Checking this browser’s preference…" : excluded
          ? "Detailed visitor tracking is disabled for this browser."
          : "Detailed visitor tracking is allowed for this browser when configured. Your browser’s Do Not Track setting is also respected."}
      </p>
      <button
        type="button"
        disabled={excluded === null}
        onClick={toggle}
        className="text-sm underline hover:text-foreground disabled:opacity-50"
      >
        {excluded ? "Allow detailed visitor tracking" : "Disable detailed visitor tracking"}
      </button>
      {error && <p role="alert" className="text-sm text-foreground/70">{error}</p>}
    </div>
  );
}
