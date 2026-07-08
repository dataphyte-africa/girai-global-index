import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Only initialize when a key is configured so local/preview builds without
// analytics credentials don't throw. Autocapture + pageviews are enabled via
// the `defaults` preset; SPA route changes are captured automatically.
if (key) {
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    person_profiles: "identified_only",
  });
}
