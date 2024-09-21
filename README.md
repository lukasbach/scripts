# @lukasbach/scripts

> Collection of easy-to-use scripts and tools

This is a collection of various small CLI scripts and tools, that I made available for easy use.
The scripts are deployed as NPM package, so you can call them with `npx` or install them globally with
`npm`.

Most of the scripts relate to repetitive tasks with NodeJS and React development, such as setting
up certain frameworks or scaffolding files, but there are other scripts such as ffmpeg tasks or
file system utilities. There are some that are specific to parts of my personal workflow, but also
quite a few that should be interesting to general use.

You can find a full list of available scripts on [scripts.lukasbach.com](https://scripts.lukasbach.com).

## Usage

Use the command listed on each script page to run it:

```
npx @lukasbach/scripts react/fc
```

Alternatively, you can install the tool globally and run the scripts with `ldo`:

```
npm i -g @lukasbach/scripts
ldo react/fc
```

Some scripts also have shortcuts. For example, the `react/fc` script can also be run with `ldo fc`.
You can edit shortcuts with `ldo edit-shortcuts`. All shortcuts that are available by default
are listed in the [Shortcuts Page](https://scripts.lukasbach.com/shortcuts).

It is also possible to call the script without any parameters, and it will interactively search all
available scripts.

![Demo](https://raw.githubusercontent.com/lukasbach/scripts/main/assets/ldo.gif)

## Scripts

The following scripts are currently implemented:

<!-- scripts:start -->
- [update](https://scripts.lukasbach.com/update) - Update @lukasbach/scripts to the latest version
- [template](https://scripts.lukasbach.com/template) - 
- [pr](https://scripts.lukasbach.com/pr) - Checks your GitHub events to find branches you recently pushed to, anddisplays a link to create a PR from that branch.Must be logged into GitHub CLI.
- [normalize-json](https://scripts.lukasbach.com/normalize-json) - Runs JSON.stringify(JSON.parse()) on a file to normalize it. Normalizes with two spaces.
- [help](https://scripts.lukasbach.com/help) - Prints help information for the tool. Append a script name to get help for that script.
- [find](https://scripts.lukasbach.com/find) - Search a script by name
- [edit-shortcuts](https://scripts.lukasbach.com/edit-shortcuts) - Edit shortcuts for any scripts supported by @lukasbach/scripts that can later be used instead ofthe full script name. If the shortcuts file doesn't exist yet, it will be offered to be created.
- [deduplicate-gitignore](https://scripts.lukasbach.com/deduplicate-gitignore) - Removes duplicate entries in a gitignore file
- [compare-folders](https://scripts.lukasbach.com/compare-folders) - Compares two folders and lists missing items and files that are different. Supportscomparing files based on either file size, file size and edit date or file hash. Forhashing, SHA1 is used which is fa...
- [compare-files](https://scripts.lukasbach.com/compare-files) - Compares two files to check if they are different. Supportscomparing files based on either file size, file size and edit date or file hash. For hashing, SHA1 is usedwhich is fast and works well for la...
- [react/vitest-logic](https://scripts.lukasbach.com/react/vitest-logic) - Template for a vitest test suite file for a logic component.
- [react/vitest-hook](https://scripts.lukasbach.com/react/vitest-hook) - Template for a react-based vitest test suite file for testing a react hook.
- [react/vitest-component](https://scripts.lukasbach.com/react/vitest-component) - Template for a react-based vitest test suite file for testing a component.
- [react/forwardref](https://scripts.lukasbach.com/react/forwardref) - Creates a React Functional Component using forwardRef.
- [react/fcsimple](https://scripts.lukasbach.com/react/fcsimple) - Creates a React Functional Component without any props.
- [react/fcprops](https://scripts.lukasbach.com/react/fcprops) - Creates a React Functional Component with dedicated props type.
- [react/fcchildren](https://scripts.lukasbach.com/react/fcchildren) - Creates a React Functional Component with a PropsWithChildren prop type.
- [react/fc](https://scripts.lukasbach.com/react/fc) - Creates a React Functional Component.
- [node/yarn-nodemodules](https://scripts.lukasbach.com/node/yarn-nodemodules) - Configures the .yarnrc.yml file to use the node-modules linker, and adds the necessary items to .gitignore.
- [node/volta](https://scripts.lukasbach.com/node/volta) - Pins the LTS version of Node.js and latest version of the currently active package manager in use with Volta.
- [node/test](https://scripts.lukasbach.com/node/test) - Runs various npm scripts that typically exist for verification purposes, such as build, test and lint.
- [node/setup-tsconfig](https://scripts.lukasbach.com/node/setup-tsconfig) - Set's up a build configuration with Typescript by configuring the tsconfig.json file and adjusting package.jsonand supporting files.
- [node/setup-publish-fast](https://scripts.lukasbach.com/node/setup-publish-fast) - Sets up a NPM package release configuration with the package publish-fast.
- [node/setup-esm](https://scripts.lukasbach.com/node/setup-esm) - Set's up ESM builds for a TS project. This includes updating the tsconfig, package.json, and file imports.
- [node/setup-eslint](https://scripts.lukasbach.com/node/setup-eslint) - Adds my personal ESLint config with @lukasbach/eslint-config-deps to the package setup.
- [node/setup-empty-yarn](https://scripts.lukasbach.com/node/setup-empty-yarn) - Creates a new empty yarn repository.
- [node/setup-crowdin](https://scripts.lukasbach.com/node/setup-crowdin) - Sets up a crowdin-based translation configuration for the current project.
- [node/setup-commander](https://scripts.lukasbach.com/node/setup-commander) - Configures a Typescript project to include dependencies and scaffolding setup for a commander CLI
- [node/normalize-package-json](https://scripts.lukasbach.com/node/normalize-package-json) - Normalizes a package.json file and reorderes its properties in a way that is typical.
- [node/kill-jest-locks](https://scripts.lukasbach.com/node/kill-jest-locks) - Kills active jest lock files under Windows. Can help in case that jest refuses to run because it can't access active locks
- [node/kill-all](https://scripts.lukasbach.com/node/kill-all) - Kills all node processes. Only works under windows.
- [node/create-index-file](https://scripts.lukasbach.com/node/create-index-file) - Create an index.ts file that reexports from all files in the directory
- [node/configure-npm-repo](https://scripts.lukasbach.com/node/configure-npm-repo) - Configures the package.json based on user input. Some settings, like description, are also synced to the Github repo.Also fixes the repo url in the package.json based on the git remote.
- [node/add-js-extensions-in-imports](https://scripts.lukasbach.com/node/add-js-extensions-in-imports) - Replaces all imports in the nodejs package to include .js file extensions. Ignores imports of packages (i.e.non-relative imports), and imports of non-code files. This is part of the the adoption proce...
- [init/react-app](https://scripts.lukasbach.com/init/react-app) - Scaffolds a new React app with Vite.
- [init/obsidian-plugin](https://scripts.lukasbach.com/init/obsidian-plugin) - Initializes a Obsidian Plugin project.
- [init/node-cli](https://scripts.lukasbach.com/init/node-cli) - Initializes a NodeJS based CLI project
- [github/setup-node-verify-action](https://scripts.lukasbach.com/github/setup-node-verify-action) - Sets up a GitHub Action to verify a NodeJS Project
- [github/create-from-local](https://scripts.lukasbach.com/github/create-from-local) - Creates a new Github repository and pushes the local git folder to that repo, configuring the repo asgit origin in the local repository in the process.
- [git/new-branch](https://scripts.lukasbach.com/git/new-branch) - Stash the currently changed files, go to main branch, update main, create a new branch, pop changes.
- [fs/tidy-movies](https://scripts.lukasbach.com/fs/tidy-movies) - 
- [fs/refactor-repos-into-year-folders](https://scripts.lukasbach.com/fs/refactor-repos-into-year-folders) - Go through a folder of repos, and move them into year folders based on their first-commit date. If a folderhas no git repo, it is ignored. Needs to run in the folder containing the repos.This will mov...
- [fs/fix-number-prefixes](https://scripts.lukasbach.com/fs/fix-number-prefixes) - Takes a set of files with numbers, and prefixes the numbers with zeros so they are all the same length.
- [fs/7zip-subfolders](https://scripts.lukasbach.com/fs/7zip-subfolders) - Move a list of folders into 7zip archives with the same name as the folders.
- [ffmpeg/to-gif](https://scripts.lukasbach.com/ffmpeg/to-gif) - Generates a gif file from a video file.
- [ffmpeg/bulk-reduce-bitrate](https://scripts.lukasbach.com/ffmpeg/bulk-reduce-bitrate) - Uses ffmpeg to reduce the bitrate of all videos matched by a glob. Videos are copied, not replaced.
- [ffmpeg/bulk-flac-to-mp3](https://scripts.lukasbach.com/ffmpeg/bulk-flac-to-mp3) - Converts all flac files matched by a glob to mp3.
<!-- scripts:end -->
