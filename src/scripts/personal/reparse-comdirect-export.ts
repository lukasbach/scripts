/**
 * @internal
 */

const csvPath = await ask.path("_", "CSV Export");
const contents = (await fs.readFile(csvPath, "utf-8")).replaceAll("\r", "");

// const blocks = /"Ums.tze (.+)";"Zeitraum.+\n\n([^(?:\n\n)]+)\n\n/g.exec(contents);
const blocks = contents.matchAll(/"Ums.tze (.+)";"Zeitraum.+\s.+\s\s((?:.+\s)*)/gi);
const parsed = [...blocks]
  .map((match) => ({ title: match[1], content: match[2] }))
  .filter((block) => !block.content.includes("Keine Ums"));

const reparseGiro = (line: string) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [date, _1, _2, text, amount] = line.split(";").map((v) => v.replaceAll('"', ""));
  if (/Auftraggeber: (.+) Buchungstext: (.+)/.test(text)) {
    const [, from, reason] = /Auftraggeber: (.+) Buchungstext: (.+)/.exec(text) ?? [];
    return `${date};${from};${reason};${amount}`;
  }
  if (/Empf.nger: (.+) Buchungstext: (.+)/.test(text)) {
    const [, from, reason] = /Empf.nger: (.+) Buchungstext: (.+)/.exec(text) ?? [];
    return `${date};${from};${reason};${amount}`;
  }
  return `${date};;${text};${amount}`;
};
const reparseVisa = (line: string) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [date, _1, _2, _3, text, amount] = line.split(";").map((v) => v.replaceAll('"', ""));
  return `${date};;${text};${amount}`;
};

for (const block of parsed) {
  const filename = path.win32.join(path.win32.dirname(csvPath), utils.getSafeFilename(block.title, "csv"));
  const lines = block.content
    .split("\n")
    .slice(1)
    .filter((line) => !line.startsWith('"offen') && line.length > 0)
    .map((line) => {
      if (block.content.startsWith('"Buchungstag";"Wertstellung (Valuta)";"Vorgang";"Buchungstext";"Umsatz in EUR";')) {
        return reparseGiro(line);
      }
      if (block.content.startsWith('"Buchungstag";"Umsatztag";"Vorgang";"Referenz";"Buchungstext";"Umsatz in EUR";')) {
        return reparseVisa(line);
      }
      throw new Error("Unknown block type");
    });
  await fs.writeFile(filename, `Date;From;Reason;Amount\n${lines.join("\n")}`);
  log.success(`Wrote ${filename}`);
}
