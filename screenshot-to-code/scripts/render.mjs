// Render an HTML file to a PNG screenshot with a headless browser.
//
// Dependency-free: uses Chrome or Edge found on the system. The virtual time
// budget lets CDN scripts (e.g. the Tailwind JIT CDN) finish before capture.
//
// Usage:
//   node render.mjs <input.html> <output.png> [--width 1440] [--height 2400] [--mobile] [--scale 1]
//
// Exit code 0 and a non-empty PNG on success.

import { spawnSync } from "node:child_process";
import { existsSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const BROWSER_CANDIDATES = [
  // Windows
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  // Linux
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/msedge",
];

function parseArgs(argv) {
  const positional = [];
  const opts = { width: 1440, height: 2400, mobile: false, scale: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--width") opts.width = parseInt(argv[++i], 10);
    else if (a === "--height") opts.height = parseInt(argv[++i], 10);
    else if (a === "--mobile") opts.mobile = true;
    else if (a === "--scale") opts.scale = parseFloat(argv[++i]);
    else positional.push(a);
  }
  if (positional.length < 2) {
    console.error(
      "usage: node render.mjs <input.html> <output.png> [--width W] [--height H] [--mobile] [--scale S]"
    );
    process.exit(2);
  }
  opts.html = path.resolve(positional[0]);
  opts.png = path.resolve(positional[1]);
  return opts;
}

function findBrowser() {
  for (const p of BROWSER_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  console.error(
    "No Chrome/Edge found. Install one, or render with another headless browser."
  );
  process.exit(1);
}

const opts = parseArgs(process.argv.slice(2));
if (!existsSync(opts.html)) {
  console.error(`input not found: ${opts.html}`);
  process.exit(1);
}

const [width, height] = opts.mobile ? [390, 2000] : [opts.width, opts.height];
const profile = mkdtempSync(path.join(tmpdir(), "render-profile-"));

const args = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  `--force-device-scale-factor=${opts.scale}`,
  `--user-data-dir=${profile}`,
  `--window-size=${width},${height}`,
  "--virtual-time-budget=10000",
  `--screenshot=${opts.png}`,
  pathToFileURL(opts.html).href,
];

try {
  const proc = spawnSync(findBrowser(), args, { timeout: 120_000 });
  const ok = existsSync(opts.png) && statSync(opts.png).size > 0;
  if (!ok) {
    console.error(proc.stderr?.toString() || proc.stdout?.toString());
    console.error("screenshot was not produced");
    process.exit(1);
  }
  const kb = Math.round(statSync(opts.png).size / 1024);
  console.log(`rendered ${opts.png} (${kb} KB, ${width}x${height})`);
} finally {
  rmSync(profile, { recursive: true, force: true });
}
