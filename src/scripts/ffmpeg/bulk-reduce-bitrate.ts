/** Uses ffmpeg to reduce the bitrate of all videos matched by a glob. Videos are copied, not replaced. */

import path from "path";

const filesGlob = await ask.text("source,s", "Where are the video files to compress?", "**/*.mp4");
const outputTemplate = await ask.text(
  "dest,d",
  "Where should the files be stored?",
  "{{folder}}/compressed/{{name}}.mp4"
);
const crf = await ask.number("crf", "What CRF value should be used (0=lossless, 51=worst)?", "24");
const framerate = await ask.number("r", "What framerate (0 = undefined)?", "0");
const frString = framerate && framerate !== 0 ? ` -r ${framerate} ` : "";

const files = glob.sync(filesGlob);

log.info("Found files:", files);
if (!(await ask.confirm("Run on the matched files?"))) {
  process.exit(0);
}

for (const file of files) {
  const vars = {
    folder: path.dirname(file),
    name: path.basename(file, path.extname(file)),
    ext: path.extname(file),
  };
  const newTarget = utils.replaceTemplateText(outputTemplate, vars);
  log.verbose(`Compressing ${file} to ${newTarget}`);
  utils.assert(!(await fs.exists(newTarget)), `Output file ${newTarget} already exist!`);
  await fs.ensureDir(path.dirname(newTarget));
  const command = `ffmpeg -i "${file}" -vcodec libx265 -crf ${crf} ${frString} "${newTarget}"`;
  log.verbose("running", command);
  await $({ stdio: "inherit" })`${command}`;
}
