/* eslint-disable @typescript-eslint/no-use-before-define */
/** Tidy a folder of movies */

import * as path from "path";

const apiKey = await ask.text("api-key", "What is your TMDB API key? (https://www.themoviedb.org/settings/api)");
const rootSearch = await ask.text("root", "What is the root folder to search?", ".");
const extensions = await ask.text("extensions", "What are the file extensions to search for?", "mkv,mp4,iso");
const target = await ask.text("target", "What is the target folder?", "dist");

let files = await glob(`**/*.{${extensions}}`, { cwd: rootSearch, absolute: true });

const sampleFiles = files.filter((f) => f.toLowerCase().includes("sample"));

if (sampleFiles.length > 0) {
  log.info(`Sample files found: ${sampleFiles.join(", ")}`);
  if (await ask.confirm("Do you want to exclude these files?")) {
    files = files.filter((f) => !sampleFiles.includes(f));
  }
}

for (const file of files) {
  log.info(`Processing ${file}`);
  const searchString = toSearchString(path.basename(file));
  const result = await tryToResolveMovie(searchString, file);

  if (result === null) {
    continue;
  }

  const safeTitle = result.title.replace(/:\s+/g, " - ").replace(/[^a-z0-9\- ]/gi, "_");
  const dist = path.join(target, `${safeTitle} (${result.release_date})`);
  const associatedFiles = (await glob(`${path.dirname(file)}/**/*`, { absolute: true })).filter((f) => f !== file);
  let matchedAssociates: string[] = [];
  if (associatedFiles.length > 30) {
    log.warn(`More than 30 associated files found for ${file}, they will not be included...`);
  } else {
    matchedAssociates = await ask.multiChoice(
      null,
      `Found ${associatedFiles.length} associated files, which to include?`,
      associatedFiles.map((f) => ({
        value: path.relative(path.dirname(file), f),
        checked: true,
      }))
    );
  }

  await fs.ensureDir(dist);
  await fs.move(file, path.join(dist, path.basename(file)));
  for (const associate of matchedAssociates) {
    const from = path.join(path.dirname(file), associate);
    if (fs.lstatSync(from).isDirectory()) {
      continue;
    }
    await fs.move(from, path.join(dist, associate));
  }
  log.success(`Moved ${file} to ${dist}`);
}

function toSearchString(str: string) {
  return path
    .basename(str, path.extname(str))
    .toLowerCase()
    .replace(/[\s.,_-]/g, " ")
    .replace(/[^a-z0-9\s]/g, "");
}

async function searchMovie(query: string): Promise<TMDBResult> {
  return got(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`).json();
}

async function tryToResolveMovie(query: string, fileName: string): Promise<TMDBResult["results"][number] | null> {
  const result = await searchMovie(query);
  if (result.results.length === 0) {
    log.warn(`No results found for ${query}`);
    return tryToResolveMovie(await ask.text(null, `Search for ${fileName}`), fileName);
  }
  const askResult = await ask.choice(null, `Found ${result.results.length} results for ${query}`, [
    ...result.results.slice(0, 5).map((r) => ({ value: r.id, name: `${r.title} (${r.release_date})` })),
    { value: "retry", name: "Search again..." },
    { value: "cancel", name: "Skip file..." },
  ]);

  if (askResult === "retry") {
    return tryToResolveMovie(await ask.text(null, `Search for ${fileName}`), fileName);
  }

  if (askResult === "cancel") {
    return null;
  }

  const chosenResult = result.results.find((r) => `${r.id}` === `${askResult}`);
  if (!chosenResult) {
    log.error(`Could not find chosen result ${askResult}`);
    return tryToResolveMovie(await ask.text(null, `Search for ${fileName}`), fileName);
  }

  return chosenResult;
}

type TMDBResult = {
  results: { backdrop_path: string; title: string; vote_average: number; release_date: string; id: number }[];
};
