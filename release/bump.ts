import { $ } from 'bun'

// Check for uncommitted changes
const status = await $`git status --porcelain`.quiet();
if (!!status.text() && !process.env.FORCE) {
    console.error("There are uncommitted changes. Commit them before releasing or run with FORCE=true.");
    process.exit(1);
}

// Bump version
const semverPart = Bun.argv[3] || 'patch';
const json = await Bun.file("./package.json").json()
const [major, minor, patch] = json.version.split(".").map((s: string) => Number.parseInt(s));
json.version = bump([major, minor, patch], semverPart);
await Bun.write("./package.json", JSON.stringify(json, null, 2));

// Commit, tag and push
await $`git add package.json`;
await $`git commit -m v${json.version}`;
await $`git tag v${json.version}`;
await $`git push`;
await $`git push origin v${json.version}`;

function bump(semver: [number, number, number], semverPart = 'patch') {
    switch (semverPart) {
        case 'major':
            semver[0]++;
            semver[1] = 0;
            semver[2] = 0;
            break;
        case 'minor':
            semver[1]++;
            semver[2] = 0;
            break;
        case 'patch':
            semver[2]++;
            break;
        default:
            throw new Error(`Invalid semver part: ${semverPart}`);
    }

    return semver.join('.');
}