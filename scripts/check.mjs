// Build check for Index Line, run by Cloudflare before every deploy
// (wrangler.jsonc, build.command). It fails the deploy if any page in
// public/ lacks what CORE.md requires of every page.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = "public";
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) pages.push(p);
  }
})(root);

const required = [
  [/<meta name="robots" content="noindex">/, "robots noindex"],
  [/<title>[^<]+<\/title>/, "title"],
  [/<meta name="description" content="[^"]+">/, "meta description"],
  [/<meta property="og:title" content="[^"]+">/, "og:title"],
  [/<meta property="og:description" content="[^"]+">/, "og:description"],
  [/<meta property="og:image" content="https:\/\/index-line\.unpromptedworks\.com\/[^"]+">/, "og:image"],
  [/<link rel="icon"/, "favicon link"],
  [/href="https:\/\/unpromptedworks\.com\/#about"/, "about link"],
];

let failed = 0;
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const [re, what] of required) {
    if (!re.test(html)) { console.error(`${page}: missing ${what}`); failed++; }
  }
  // Every local link and asset must exist.
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
    const target = join(root, url.endsWith("/") ? url + "index.html" : url);
    if (!existsSync(target)) { console.error(`${page}: broken link ${url}`); failed++; }
  }
}
for (const file of ["_headers", "favicon.svg", "og.png"]) {
  if (!existsSync(join(root, file))) { console.error(`missing ${root}/${file}`); failed++; }
}
if (!/X-Robots-Tag: noindex/.test(readFileSync(join(root, "_headers"), "utf8"))) {
  console.error("_headers lacks X-Robots-Tag: noindex"); failed++;
}
if (failed) { console.error(`${failed} problem(s)`); process.exit(1); }
console.log(`ok: ${pages.length} pages checked`);
