import { NextResponse } from "next/server";
import { startRun } from "@/agents/orchestrator";
import { getProfile } from "@/agents/profiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const profileId = (body?.profile as string) ?? "siteamoeba";
    const product = getProfile(profileId);
    const runId = await startRun({ product });
    return NextResponse.json({ runId, profile: profileId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
