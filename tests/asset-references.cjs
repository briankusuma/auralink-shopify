// Verify local Liquid asset/snippet references, including inline_asset_content.
// Run from the theme root: node tests/asset-references.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const assetNames = new Set(fs.readdirSync('assets'));
let assets = 0;
let snippets = 0;
const missing = [];
function scan(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!file.endsWith('.liquid')) continue;
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/['"]([^'"\n]+)['"]\s*\|\s*(?:asset_url|asset_img_url|inline_asset_content)\b/g)) {
      assets++;
      if (!assetNames.has(match[1])) missing.push(`${file}: asset ${match[1]}`);
    }
    for (const match of source.matchAll(/{%[-\s]*(?:render|include)\s+['"]([^'"]+)['"]/g)) {
      snippets++;
      if (!fs.existsSync(path.join('snippets', `${match[1]}.liquid`))) missing.push(`${file}: snippet ${match[1]}`);
    }
  }
}
for (const folder of ['sections', 'snippets', 'layout', 'templates', 'blocks']) scan(folder);
assert.deepEqual(missing, [], 'Missing local theme references');
console.log(`PASS: ${assets} literal asset references and ${snippets} snippet references exist with exact filenames.`);
