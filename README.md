# JARVIS — Content Distribution Engine (Phase 0)

Multi-agent short-form video pipeline for product promotion. Local-first scaffold.

## Quick start

```sh
npm install
npx playwright install chromium
cp .env.example .env
# Add ANTHROPIC_API_KEY (required) and ELEVENLABS_API_KEY + voice IDs (optional)
npm run dev
```

Open http://localhost:3000 and click **GENERATE TODAY**.

## Pipeline

5 agents, orchestrated by `src/agents/orchestrator.ts`:

1. **Strategist** — proposes 3 daily hook concepts.
2. **Scriptwriter** — expands the chosen hook into a 30-45s vertical script.
3. **Visual Director** — turns the script into a shot list (screencaps vs. cards).
4. **Producer** — synthesizes voiceover (ElevenLabs), captures pages (Playwright), renders MP4 (Remotion).
5. **Reviewer** — scores the run against 5 criteria and decides ship/revise.

Events stream live to the HUD over SSE.

## Outputs

Each run drops into `output/run_<timestamp>_<uuid>/`:
- `hooks.json` — strategist candidates
- `script.json` — final voiceover script
- `shot-plan.json` — visual director output
- `voiceover.mp3` (or `.stub.json` if ElevenLabs not configured)
- `shot-XX.png` — Playwright screen captures
- `video.mp4` — final rendered vertical video
- `review.json` — reviewer scores

Pickup is manual: drag the MP4 + caption into TikTok / Reels / Shorts.

## Status

- ✅ Headless content engine (siteamoeba profile hardcoded)
- ✅ Web HUD with live event stream
- ⏳ Voice input (Web Speech API + ElevenLabs)
- ⏳ Multi-product profiles
- ⏳ Auto-posting (deliberately deferred — requires platform API approval)
