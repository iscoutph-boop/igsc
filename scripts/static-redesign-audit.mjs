import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/assets/igs-official-logo.png",
  "public/brand/ig-sabroso-logo.png",
  "public/og/ig-sabroso-social.jpg",
  "src/routes/projects.tsx",
  "src/routes/projects_.$slug.tsx",
  "src/content/projects.ts",
  "src/lib/bookings.functions.ts",
  "public/robots.txt",
  "public/sitemap.xml",
  ".env.example",
];

const failures = [];
for (const file of requiredFiles) {
  if (!existsSync(join(root, file))) failures.push(`Missing required file: ${file}`);
}

const hash = (file) =>
  createHash("sha256")
    .update(readFileSync(join(root, file)))
    .digest("hex");
if (requiredFiles.slice(0, 2).every((file) => existsSync(join(root, file)))) {
  const sourceLogo = hash(requiredFiles[0]);
  const publicLogo = hash(requiredFiles[1]);
  if (sourceLogo !== publicLogo)
    failures.push("Application and public logo files are not identical.");
}

const productionRoots = ["src", "public"];
const forbiddenPatterns = [
  [/id-preview-[\w-]+\.lovable\.app/i, "Lovable preview metadata URL"],
  [/script\.google\.com\/macros\/s\/AK[\w-]+/i, "hardcoded Google Apps Script deployment URL"],
  [/100%\s+Client\s+Satisfaction/i, "unverified satisfaction claim"],
  [/15\+\s+Awards/i, "unverified awards claim"],
];

function walk(directory) {
  const results = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(file));
    else results.push(file);
  }
  return results;
}

for (const directory of productionRoots) {
  for (const absoluteFile of walk(join(root, directory))) {
    if (
      ![".ts", ".tsx", ".js", ".mjs", ".json", ".html", ".xml", ".txt", ".css"].includes(
        extname(absoluteFile),
      )
    )
      continue;
    const content = readFileSync(absoluteFile, "utf8");
    for (const [pattern, label] of forbiddenPatterns) {
      if (pattern.test(content)) failures.push(`${label} found in ${relative(root, absoluteFile)}`);
    }
  }
}

const projectContentPath = join(root, "src/content/projects.ts");
if (existsSync(projectContentPath)) {
  const projectContent = readFileSync(projectContentPath, "utf8");
  const projectCount = (projectContent.match(/\n\s*slug:\s*"/g) ?? []).length;
  if (projectCount < 6 || projectCount > 8) {
    failures.push(`Curated project count must be 6-8; found ${projectCount}.`);
  }
  if (!projectContent.includes("visualizationOnly: true")) {
    failures.push("No ongoing architectural visualization is explicitly labeled in project data.");
  }
}

if (failures.length) {
  console.error("IG Sabroso static redesign audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("IG Sabroso static redesign audit passed.");
console.log("- Required production files are present.");
console.log("- Public and application logo files are identical.");
console.log("- No known preview URL, hardcoded CRM deployment, or blocked claim was found.");
console.log("- Curated project count and visualization labeling are valid.");
