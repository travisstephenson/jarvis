import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  anthropicApiKey: () => required("ANTHROPIC_API_KEY"),
  elevenlabsApiKey: () => optional("ELEVENLABS_API_KEY"),
  voiceJarvis: () => optional("ELEVENLABS_VOICE_ID_JARVIS"),
  voiceNarration: () => optional("ELEVENLABS_VOICE_ID_NARRATION"),
  productProfile: () => optional("PRODUCT_PROFILE", "siteamoeba"),
};
