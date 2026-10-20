import { readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { spawnSync } from "node:child_process";

const imageDirectory = join(process.cwd(), "public", "images", "generated");
const responsiveWidths = [360, 768, 1024];
const originals = readdirSync(imageDirectory)
  .filter((name) => name.endsWith(".webp") && !/-\d+w\.webp$/u.test(name))
  .sort();

if (originals.length === 0) {
  throw new Error(`No source WebP images found in ${imageDirectory}`);
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function dimensions(filePath) {
  const output = run("ffprobe", [
    "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
    "-of", "csv=s=x:p=0", filePath
  ]);
  const [width, height] = output.split("x").map(Number);
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new Error(`Could not read dimensions for ${filePath}`);
  return { width, height };
}

let generated = 0;
let originalBytes = 0;
let responsiveBytes = 0;

for (const name of originals) {
  const sourcePath = join(imageDirectory, name);
  const source = dimensions(sourcePath);
  originalBytes += statSync(sourcePath).size;
  const stem = basename(name, extname(name));

  for (const width of responsiveWidths) {
    if (width >= source.width) continue;

    const outputPath = join(imageDirectory, `${stem}-${width}w.webp`);
    run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y", "-i", sourcePath,
      "-frames:v", "1", "-vf", `scale=${width}:-2:flags=lanczos`,
      "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", "-preset", "photo",
      outputPath
    ]);

    const output = dimensions(outputPath);
    if (output.width !== width || output.height > source.height) {
      throw new Error(`Unexpected dimensions for ${outputPath}: ${output.width}x${output.height}`);
    }
    responsiveBytes += statSync(outputPath).size;
    generated += 1;
  }
}

const formatMiB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
console.log(`Created ${generated} lossless responsive WebP files from ${originals.length} originals.`);
console.log(`Originals: ${formatMiB(originalBytes)}; responsive variants: ${formatMiB(responsiveBytes)}.`);
