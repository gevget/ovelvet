import { access, rename } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const routePath = resolve(root, "src/app/api/leads/route.ts");
const parkedRoutePath = resolve(root, "src/app/api/leads/route.pages-disabled");

try {
  await access(parkedRoutePath);
  throw new Error("A previous Pages build did not restore the API route.");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

await rename(routePath, parkedRoutePath);

try {
  const nextCli = resolve(root, "node_modules/next/dist/bin/next");
  const result = spawnSync(process.execPath, [nextCli, "build"], {
    cwd: root,
    env: { ...process.env, GITHUB_PAGES: "true" },
    stdio: "inherit"
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  await rename(parkedRoutePath, routePath);
}
