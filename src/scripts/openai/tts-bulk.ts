/**
 * Generate many audio files with OpenAI TTS.
 *
 * This needs a config file to run on, as a yaml file in the form of:
 *
 * ```yaml
 * apiKey: "your api key"
 * model: "tts-1-hd"
 * voice: "alloy"
 * lines:
 *   prefix1: Line 1 content
 *   prefix2: Line 2 content
 * ```
 */

import OpenAI from "openai";
import YAML from "yaml";

type Config = {
  apiKey: string;
  model: string;
  voice: string;
  lines: Record<string, string>;
};

const config = YAML.parse(
  await fs.readFile(await ask.path("c,config", "Config file for bulk generation", "./config.yml"), "utf-8")
) as Config;

const openai = new OpenAI({ apiKey: config.apiKey });

for (const [key, input] of Object.entries(config.lines)) {
  const cleanedInput = input.replace(/[^a-zA-Z0-9]/g, "_");
  const speechFile = `${key}_${cleanedInput}.mp3`;

  if (fs.existsSync(speechFile)) {
    log.info(`Skipping ${speechFile}, already exists`);
    continue;
  }

  const mp3 = await openai.audio.speech.create({
    model: config.model,
    voice: config.voice as any,
    input,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.writeFile(speechFile, buffer);
  log.success(`Generated ${speechFile}`);
}
