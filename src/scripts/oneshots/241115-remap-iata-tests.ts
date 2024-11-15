/** @internal */

for (const p of await ask.glob("p,path", "Paths to the files to remap", "./*.json")) {
  const file = await fs.readJSON(p);

  const remapped = utils.remapObject(file, z.object({ action: z.string(), params: z.any() }), (original) => ({
    id: "",
    [original.action]: original.params,
  }));

  // const remapped2 = utils.remapObject(remapped, z.object({ actionResult: z.string() }).passthrough(), (original) => ({
  //   ...original,
  //   actionResult: undefined,
  //   actionResults: [{ id: "", result: "success" }],
  // }));

  const remapped2 = utils.remapObject(remapped, z.object({ actionResult: z.string() }).passthrough(), (original) => ({
    ...original,
    actionResult: undefined,
    actionResults: [],
  }));

  await fs.writeJSON(p, remapped2, { spaces: 2 });
  log.success(`Remapped ${p}`);
}
