import { RunPanel } from "@/components/hud/RunPanel";
import { getProfile } from "@/agents/profiles";
import { env } from "@/lib/env";

export default function Page() {
  const profileId = env.productProfile();
  const profile = getProfile(profileId);
  return <RunPanel profileId={profile.id} profileLabel={profile.name.toUpperCase()} />;
}
