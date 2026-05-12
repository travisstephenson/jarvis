import { strategist } from "../src/agents/strategist";
import { getProfile } from "../src/agents/profiles";
import { db, schema } from "../src/lib/db/client";

const profile = getProfile("siteamoeba");

const runId = `smoke_${Date.now()}`;
db.insert(schema.runs).values({
  id: runId,
  productProfile: profile.id,
  status: "running",
  startedAt: new Date(),
}).run();

const ctx = {
  runId,
  product: profile,
  outputDir: "/tmp/jarvis-smoke",
};

console.log("Calling strategist against claude-opus-4-7…\n");
const hooks = await strategist(ctx);
console.log("\nReceived hooks:\n");
for (const [i, h] of hooks.entries()) {
  console.log(`${i + 1}. ${h.hook}`);
  console.log(`   angle: ${h.angle}`);
  console.log(`   cta:   ${h.cta}\n`);
}
