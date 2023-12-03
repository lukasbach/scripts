/** Generates a gif file from a video file. */

const input = await ask.text("input,i", "What is the input file?", "input.mp4");
const output = await ask.text("output,o", "What is the output file?", "output.gif");
const fps = await ask.number("fps,f", "What framerate should be used?", "15");
const scale = await ask.number("scale,s", "What scale should be used?", "320");
const script =
  `ffmpeg -i ${input} -vf ` +
  `"fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 ` +
  `${output}`;
await $({ stdio: "inherit" })`${script}`;
