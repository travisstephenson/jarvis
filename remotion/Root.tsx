import { Composition } from "remotion";
import { z } from "zod";
import { ShortVideo } from "./ShortVideo";
import type { ShortVideoProps } from "./ShortVideo";

const FPS = 30;

const shortVideoSchema = z.object({
  script: z.object({
    hook: z.string(),
    beats: z.array(z.object({
      text: z.string(),
      visualDirection: z.string(),
      durationSec: z.number(),
    })),
    cta: z.string(),
    totalDurationSec: z.number(),
    caption: z.string(),
    hashtags: z.array(z.string()),
  }),
  shotPlan: z.object({
    shots: z.array(z.object({
      kind: z.enum(["screencap", "title_card", "graphic", "broll"]),
      description: z.string(),
      captureUrl: z.string().optional(),
      captureSelector: z.string().optional(),
      text: z.string().optional(),
      startSec: z.number(),
      endSec: z.number(),
    })),
  }),
  voiceoverPath: z.string(),
  shotImagePaths: z.record(z.string()),
});

const defaultProps: ShortVideoProps = {
  script: {
    hook: "Your site has a leak. You can't see it.",
    beats: [
      { text: "Most analytics tools tell you what users did.", visualDirection: "dashboard scroll", durationSec: 3 },
      { text: "They never tell you what to change.", visualDirection: "highlight stat", durationSec: 3 },
      { text: "siteamoeba scans your site and shows you the exact fixes.", visualDirection: "scan in progress", durationSec: 4 },
      { text: "Ranked by expected lift. In plain English.", visualDirection: "results table", durationSec: 3 },
    ],
    cta: "Scan your site free at siteamoeba.com",
    totalDurationSec: 15,
    caption: "Your site has a leak you can't see — find it free at siteamoeba.com",
    hashtags: ["#indiehacker", "#saas", "#cro", "#websiteaudit", "#siteamoeba"],
  },
  shotPlan: { shots: [] },
  voiceoverPath: "",
  shotImagePaths: {},
};

export const Root: React.FC = () => {
  const durationInFrames = Math.max(1, Math.round(defaultProps.script.totalDurationSec * FPS));

  return (
    <Composition
      id="ShortVideo"
      component={ShortVideo}
      schema={shortVideoSchema}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={async ({ props }) => {
        const seconds = props.script.totalDurationSec;
        return { durationInFrames: Math.max(1, Math.round(seconds * FPS)) };
      }}
    />
  );
};
