/** Converts all flac files matched by a glob to mp3. */

const filesGlob = await ask.text("source,s", "Where are the music files to compress?", "**/*.flac");

if (!(await ask.confirm("Matched flac files will be removed, and the mp3's will be placed in-place. Are you sure?"))) {
  process.exit(0);
}

const files = glob.sync(filesGlob);

for (const file of files) {
  log.info(`Converting ${file}`);
  const basename = path.join(path.dirname(file), path.basename(file, path.extname(file)));
  await $`ffmpeg -i ${file} -ab 320k -map_metadata 0 -id3v2_version 3 ${basename}.mp3`;
  await fs.unlink(file);
}

log.info(`Converted ${files.length} files`);
