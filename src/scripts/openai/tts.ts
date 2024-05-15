/** Generate an audio file with OpenAI TTS */

import path from "path";
import OpenAI from "openai";

const apiKey = (await fs.readFile("./openai-token.txt", "utf-8")) || (await ask.text("t,token", "OpenAI API Token"));

const openai = new OpenAI({ apiKey });

const input = await ask.text("_", "Text to convert to speech");
const cleanedInput = input.replace(/[^a-zA-Z0-9]/g, "_");
const prefix = path.resolve(await ask.text("_", "Output file prefix", "speech"));
const speechFile = `${prefix}_${cleanedInput}.mp3`;

const mp3 = await openai.audio.speech.create({
  model: await ask.choice("m,model", "TTS Model", ["tts-1", "tts-1-hd"], "tts-1-hd"),
  voice: await ask.choice("voice", "Voice", ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]),
  input,
});
const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.writeFile(speechFile, buffer);
// append to text file

if (fs.existsSync("./results.txt")) {
  await fs.appendFile("./results.txt", `${speechFile}: ${input}\n`);
}
