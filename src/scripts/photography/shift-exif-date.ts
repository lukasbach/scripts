/** Shift the date in EXIF data of many photos by a certain offset. */

await utils.exif.verifyExiftool();

const photosGlob = await ask.path("photos,p", "Glob for photos to be processed", "**/*.{jpg,png,nef}");
const photos = await glob(photosGlob, { cwd: process.cwd() });
log.success(`Found ${photos.length} photos`);

let offset = await ask.number(
  "offset,o",
  "Offset in days to shift the date by, in seconds. Set to 0 to interactively set two dates, to offset by the difference.",
  "0"
);

if (offset === 0) {
  log.info("Please enter two dates to calculate the offset.");
  const date1 = new Date(Date.parse(await ask.text("date1", "Sample (incorrect) date, YYYY-MM-DDTHH:mm:ss.sssZ")));
  const date2 = new Date(
    Date.parse(await ask.text("date2", "Reference (correct) date, YYYY-MM-DDTHH:mm:ss.sssZ", new Date().toString()))
  );
  offset = (date2.getTime() - date1.getTime()) / 1000;
  log.success(`Calculated offset: ${offset} seconds (${Math.floor(offset / 60 / 60 / 24)} days)`);
}

if (!(await ask.confirm(`Shift all ${photos.length} photos by ${offset} seconds?`))) {
  log.exit("Aborted.");
}

for (const photo of photos) {
  const x = (n: number) => n.toString().padStart(2, "0");

  log.info(`Processing ${photo}`);
  const date = await utils.exif.readValue(photo, "CreateDate");
  const [, year, month, day, hour, minute, second] =
    /(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/.exec(date ?? "") ?? log.exit(`Could not parse date ${date}`);
  const newDate = new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second));
  const shiftedDate = new Date(newDate.getTime() + offset * 1000);

  const stringifiedDate = `${shiftedDate.getUTCFullYear()}:${x(shiftedDate.getUTCMonth() + 1)}:${x(
    shiftedDate.getUTCDate()
  )} ${x(shiftedDate.getUTCHours())}:${x(shiftedDate.getUTCMinutes())}:${x(shiftedDate.getUTCSeconds())}`;
  log.muted(`  Shifting date from ${date} to ${stringifiedDate}`);
  await utils.exif.writeValues(photo, {
    CreateDate: stringifiedDate,
    ModifyDate: stringifiedDate,
    DateTimeOriginal: stringifiedDate,
  });
  // TODO still not working...
}
