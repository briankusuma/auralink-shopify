// Verify local Liquid asset/snippet references, including inline_asset_content.
// Run from the theme root: node tests/asset-references.cjs
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const assetNames = new Set(fs.readdirSync('assets'));
let assets = 0;
let snippets = 0;
let dynamicAssets = 0;
const missing = [];
function scan(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!file.endsWith('.liquid')) continue;
    const source = fs.readFileSync(file, 'utf8');
    const schema = source.match(/{%[-\s]*schema\s*[-]?%}([\s\S]*?){%[-\s]*endschema\s*[-]?%}/);
    if (schema) {
      const data = JSON.parse(schema[1]);
      for (const block of data.blocks || []) {
        // App entries accept only type; adding a name to satisfy an outdated
        // editor schema would make the actual Shopify schema invalid.
        if (block.type === '@app') assert.deepEqual(Object.keys(block), ['type'], `${file}: @app must not have local-block properties`);
        else if (block.type !== '@theme') assert.ok(block.name, `${file}: local block name is required`);
      }
      const settings = [...(data.settings || []), ...(data.blocks || []).flatMap((block) => block.settings || [])];
      for (const setting of settings) {
        const fallback = ['default_asset_image', 'default_avatar', 'default_image'].includes(setting.id);
        const icon = setting.id === 'icon' && setting.type === 'select' && source.includes("render 'icon-accordion'");
        if (!fallback && !icon) continue;
        if (fallback) assert.equal(setting.type, 'select', `${file}: fallback filename must use validated choices`);
        for (const option of setting.options || []) {
          if (option.value === 'none') continue;
          const name = icon ? `icon-${option.value.replaceAll('_', '-')}.svg` : option.value;
          dynamicAssets++;
          if (!assetNames.has(name)) missing.push(`${file}: dynamic asset ${name}`);
        }
      }
    }
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
for (let index = 1; index <= 6; index++) {
  dynamicAssets++;
  assert.ok(assetNames.has(`product-img-${index}.png`), 'Generated product fallback must exist');
}
assert.deepEqual(missing, [], 'Missing local theme references');
console.log(`PASS: ${assets} literal asset references and ${snippets} snippet references and ${dynamicAssets} generated/selected assets exist with exact filenames.`);
