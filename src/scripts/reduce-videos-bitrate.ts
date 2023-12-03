/** Uses ffmpeg to reduce the bitrate of all videos matched by a glob */

const filesGlob = await ask.text("source,s", "Where are the video files to compress?", "**/*.mp4");
const outputTemplate = await ask.text(
  "dest,d",
  "Where should the files be stored?",
  "{{folder}}/compressed/{{name}}.mp4"
);
const crf = await ask.number("crf", "What CRF value should be used (0=lossless, 51=worst)?", "24");

const files = glob.sync(filesGlob);

for (const file of files) {
  const vars = {
    folder: path.dirname(file),
    name: path.basename(file, path.extname(file)),
    ext: path.extname(file),
  };
  const newTarget = utils.replaceTemplateText(outputTemplate, vars);
  utils.assert(!(await fs.exists(newTarget)), `Output file ${newTarget} already exist!`);
  await fs.ensureDir(path.dirname(newTarget));
  await $({ stdio: "inherit" })`ffmpeg -i ${file} -vcodec libx265 -crf ${crf} ${newTarget}`;
}
