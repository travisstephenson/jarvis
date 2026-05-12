import { AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import type { ShotPlan, VideoScript } from "../src/agents/types";

export type ShortVideoProps = {
  script: VideoScript;
  shotPlan: ShotPlan;
  voiceoverPath: string;
  shotImagePaths: Record<string, string>;
} & Record<string, unknown>;

const COLOR_BG = "#04060B";
const COLOR_ACCENT = "#5BE3FF";
const COLOR_TEXT = "#E8F4FF";

export const ShortVideo: React.FC<ShortVideoProps> = ({ script, shotPlan, voiceoverPath, shotImagePaths }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const hasAudio = voiceoverPath && voiceoverPath.endsWith(".mp3");

  const beatDurations = script.beats.map((b) => Math.max(1, Math.round(b.durationSec * fps)));
  let cursor = 0;
  const beatRanges = beatDurations.map((d) => {
    const range = { from: cursor, duration: d };
    cursor += d;
    return range;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR_BG, color: COLOR_TEXT }}>
      {hasAudio ? <Audio src={voiceoverPath} /> : null}

      <HexGrid />

      {script.beats.map((beat, i) => {
        const range = beatRanges[i];
        const shot = shotPlan.shots[i];
        const shotKey = `shot-${String(i).padStart(2, "0")}`;
        const imagePath = shotImagePaths[shotKey];
        return (
          <Sequence from={range.from} durationInFrames={range.duration} key={i}>
            <BeatScene beat={beat} kind={shot?.kind ?? "title_card"} imagePath={imagePath} cardText={shot?.text} />
          </Sequence>
        );
      })}

      <Sequence from={Math.max(0, durationInFrames - Math.round(2 * fps))} durationInFrames={Math.round(2 * fps)}>
        <CtaCard text={script.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};

const HexGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = 0.06 + 0.04 * Math.sin(frame / 20);
  return (
    <AbsoluteFill style={{
      backgroundImage: `radial-gradient(${COLOR_ACCENT}33 1px, transparent 1px)`,
      backgroundSize: "44px 44px",
      opacity,
    }} />
  );
};

const BeatScene: React.FC<{
  beat: VideoScript["beats"][number];
  kind: "screencap" | "title_card" | "graphic" | "broll";
  imagePath?: string;
  cardText?: string;
}> = ({ beat, kind, imagePath, cardText }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn, display: "flex", justifyContent: "center", alignItems: "center", padding: 80 }}>
      {kind === "screencap" && imagePath ? (
        <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Img src={imagePath} style={{
            maxWidth: "90%", maxHeight: "70%", border: `2px solid ${COLOR_ACCENT}55`, borderRadius: 24,
          }} />
        </AbsoluteFill>
      ) : (
        <TitleCardText text={cardText ?? beat.text} />
      )}
      <CaptionStrip text={beat.text} />
    </AbsoluteFill>
  );
};

const TitleCardText: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    fontSize: 92, fontWeight: 800, textAlign: "center", letterSpacing: -1,
    color: COLOR_TEXT, textShadow: `0 0 24px ${COLOR_ACCENT}66`, maxWidth: "85%", lineHeight: 1.05,
  }}>{text}</div>
);

const CaptionStrip: React.FC<{ text: string }> = ({ text }) => (
  <div style={{
    position: "absolute", left: 0, right: 0, bottom: 220,
    display: "flex", justifyContent: "center", padding: "0 60px",
  }}>
    <div style={{
      background: "rgba(0,0,0,0.78)", color: "white", borderRadius: 18,
      padding: "20px 28px", fontSize: 48, fontWeight: 700, lineHeight: 1.2,
      textAlign: "center", maxWidth: "90%",
      boxShadow: `0 0 28px ${COLOR_ACCENT}33`,
    }}>{text}</div>
  </div>
);

const CtaCard: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(4,6,11,0.85)" }}>
    <div style={{
      fontSize: 76, fontWeight: 800, textAlign: "center", color: COLOR_ACCENT,
      textShadow: `0 0 28px ${COLOR_ACCENT}88`, maxWidth: "85%", lineHeight: 1.1,
    }}>{text}</div>
  </AbsoluteFill>
);
