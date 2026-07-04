import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// Must match the root layout (`force-dynamic`); `force-static` here 500s at runtime.
export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
