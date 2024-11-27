// bump patch version
const json = await Bun.file("./package.json").json()
const [major, minor, patch] = json.version.split(".").map((s: string) => Number.parseInt(s));
json.version = `${major}.${minor}.${patch + 1}`;
await Bun.write("./package.json", JSON.stringify(json, null, 2));