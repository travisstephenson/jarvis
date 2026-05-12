import type { ProductProfile } from "./types";

export const PROFILES: Record<string, ProductProfile> = {
  siteamoeba: {
    id: "siteamoeba",
    name: "siteamoeba",
    url: "https://siteamoeba.com",
    tagline: "Website analytics and improvement system for every website owner.",
    audience: "Indie founders, agency owners, and operators of small-to-mid traffic websites who know their site has problems but can't articulate which fixes will move signups.",
    valueProps: [
      "Scans any site in under a minute and ranks specific, prioritized fixes by expected lift.",
      "Catches issues most analytics tools miss: copy that doesn't sell, broken trust signals, conversion friction in the first 5 seconds.",
      "Tells you what to change AND what to change it to — not just a list of generic recommendations.",
      "Works on any stack, no install. You paste a URL and get a report.",
    ],
    primaryCTA: "Scan your site free at siteamoeba.com",
    brandVoice: "Direct, plain-English, slightly skeptical of standard analytics theater. Treats the viewer as a competent operator who's tired of dashboards full of vanity metrics.",
  },
};

export function getProfile(id: string): ProductProfile {
  const profile = PROFILES[id];
  if (!profile) throw new Error(`Unknown product profile: ${id}`);
  return profile;
}
