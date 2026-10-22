const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync('assets/section-auralink-hero.js', 'utf8');
const document = new EventTarget(); document.readyState = 'complete';
document.documentElement = { classList: { contains: () => false } };
const window = { matchMedia: () => ({ matches: false }) };
const timers = new Map(); let id = 0;
function container() {
  const radio = new EventTarget(); radio.dataset = {};
  return {
    dataset: {}, isConnected: true, radio,
    querySelector(selector) { return selector === '[data-auralink-radio-3d]' ? radio : null; },
    querySelectorAll() { return []; }
  };
}
const first = container(), second = container();
let containers = [first, second]; let headerShows = 0;
const firstSection = { contains: (el) => el === first };
document.querySelectorAll = () => containers;
document.querySelector = (selector) => selector.includes('MainContent') ? firstSection : { classList: { add() { headerShows++; } } };
document.getElementById = () => null;
const context = {
  window, document, AbortController,
  setTimeout(fn) { timers.set(++id, fn); return id; }, clearTimeout: (id) => timers.delete(id),
  cancelAnimationFrame() {}, requestAnimationFrame() { throw new Error('Empty text must not animate'); }
};
vm.runInNewContext(source, context);
assert.equal(timers.size, 2);
// Empty title/subtitle is supported; one radio must not reveal another hero.
second.radio.dispatchEvent(new Event('auralink:radio:glide'));
assert.equal(second.dataset.heroRevealComplete, 'true');
assert.equal(first.dataset.heroRevealComplete, undefined);
assert.equal(headerShows, 0, 'A lower hero must not control the global navbar');
first.radio.dispatchEvent(new Event('auralink:radio:standing'));
assert.equal(headerShows, 1);
first.radio.dispatchEvent(new Event('auralink:radio:glide'));
assert.equal(first.dataset.heroRevealComplete, 'true');
// Duplicate script tags cannot add another set of listeners/timers.
vm.runInNewContext(source, context); assert.equal(timers.size, 2);
const event = new Event('shopify:section:unload');
Object.defineProperty(event, 'target', { value: { querySelectorAll: () => [first] } });
document.dispatchEvent(event); assert.equal(timers.size, 1);
const before = headerShows; first.radio.dispatchEvent(new Event('auralink:radio:standing'));
assert.equal(headerShows, before);
assert.equal(first._heroRevealDestroy, undefined);
// Added hero in the editor is readable immediately, with no cinematic timer.
window.Shopify = { designMode: true };
const third = container(); const load = new Event('shopify:section:load');
Object.defineProperty(load, 'target', { value: { querySelectorAll: () => [third] } });
document.dispatchEvent(load); assert.equal(third.dataset.heroRevealComplete, 'true');
assert.equal(timers.size, 1);
second._heroRevealDestroy(); third._heroRevealDestroy(); assert.equal(timers.size, 0);
console.log('PASS hero instances: empty text, independent radio events, navbar ownership, duplicate scripts, unload cleanup and editor insertion.');
