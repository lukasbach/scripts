import { execa } from "execa";

export const verifyExiftool = async () => {
  try {
    await $`exiftool -h`;
  } catch {
    log.exit("Make sure to place the exiftool binary in your PATH");
  }
};

export const readValue = async (file: string, tag: string) => {
  const { stdout } = await execa("exiftool", [`-${tag}`, file]);
  return /: (.*)/.exec(stdout.trim())?.[1];
};

export const writeValues = async (file: string, values: Record<string, string>) => {
  const valuesString = Object.entries(values)
    .map(([tag, value]) => `-${tag}="${value}"`)
    .join(" ");

  if (args.dryrun) {
    log.dryrun(`exiftool -overwrite_original ${valuesString} "${file}"`);
  }

  const { stdout, exitCode } = await execa("exiftool", ["-overwrite_original", valuesString, `"${file}"`], {
    windowsVerbatimArguments: true,
  });
  log.muted(stdout);
  if (exitCode !== 0) {
    log.error(stdout);
    log.exit("Failed to write exif values");
  }
};
