// Controlled DOM/event tests for merchant section edits. Run from theme root.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const timers = new Map(); let timerId = 0;
const setTimeout = (fn) => { timers.set(++timerId, fn); return timerId; };
const clearTimeout = (id) => timers.delete(id);
const flush = () => { const batch = [...timers.values()]; timers.clear(); batch.forEach((fn) => fn()); };
const window = new EventTarget();
window.location = { href: 'https://theme.example/' };
const document = new EventTarget();
let order = ['hero', 'bento', 'impact'];
const nodes = Object.fromEntries(order.map((id) => [id, {
  id, isConnected: true,
  compareDocumentPosition(other) { return order.indexOf(this.id) < order.indexOf(other.id) ? 4 : this === other ? 0 : 2; }
}]));
let triggers = order.map((id) => ({ trigger: nodes[id], vars: {} }));
let refreshes = 0; const callbacks = {};
window.ScrollTrigger = {
  getAll: () => triggers,
  sort() { triggers.sort((a,b) => (b.vars.refreshPriority || 0) - (a.vars.refreshPriority || 0)); },
  addEventListener(name, fn) { callbacks[name] = fn; },
  removeEventListener(name) { delete callbacks[name]; },
  refresh() { callbacks.refreshInit(); refreshes++; }
};
let noHero = false; const headerClasses = new Set();
const header = { classList: { add: (x) => headerClasses.add(x), remove: (x) => headerClasses.delete(x) }, style: { removeProperty() {} } };
document.querySelector = (selector) => selector.includes('MainContent') ? { querySelector: () => !noHero } : header;
const scripts = [];
document.createElement = () => ({ remove() { this.removed = true; } });
document.head = { appendChild: (script) => scripts.push(script) };
const context = { window, document, CustomEvent: Event, URL, Map, Promise, setTimeout, clearTimeout, customElements: { get() {} } };
vm.runInNewContext(fs.readFileSync('assets/auralink-section-lifecycle.js', 'utf8'), context);
flush(); assert.equal(refreshes, 1);
const sectionEvent = (name, scripts = []) => {
  const event = new Event(name);
  Object.defineProperty(event, 'target', { value: { querySelectorAll: () => scripts } });
  document.dispatchEvent(event);
};
order = ['impact', 'hero', 'bento'];
sectionEvent('shopify:section:reorder'); flush();
assert.deepEqual(triggers.map((x) => x.trigger.id), order);
// Duplicate a section type: each trigger remains independently ordered.
nodes.impact2 = { ...nodes.impact, id: 'impact2' };
order = ['impact2', 'bento', 'impact', 'hero'];
triggers.push({ trigger: nodes.impact2, vars: {} });
sectionEvent('shopify:section:load'); flush();
assert.deepEqual(triggers.map((x) => x.trigger.id), order);
triggers = triggers.filter((x) => x.trigger.id !== 'hero');
order = order.filter((x) => x !== 'hero'); noHero = true;
sectionEvent('shopify:section:unload'); flush();
assert.deepEqual(triggers.map((x) => x.trigger.id), order);
assert.ok(headerClasses.has('header--visible'));
(async () => {
  let ready = false;
  const service = window.AuraLinkSectionLayout;
  const first = service.load('/assets/gsap.js', () => ready);
  assert.equal(service.load('/assets/gsap.js', () => ready), first);
  assert.equal(scripts.length, 1); ready = true; scripts[0].onload(); await first;
  assert.equal(timers.size, 0);
  // Failed assets fall back, clear their timeout and allow a subsequent retry.
  const failed = service.load('/assets/unavailable.js', () => false);
  const rejection = assert.rejects(failed); scripts[1].onerror(); await rejection;
  assert.equal(scripts[1].removed, true);
  const retry = service.load('/assets/unavailable.js', () => false);
  const timeoutRejection = assert.rejects(retry); flush(); await timeoutRejection;
  assert.equal(scripts[2].removed, true);
  // Adding a section that was absent at initial load bootstraps only known assets.
  sectionEvent('shopify:section:load', [{ src: '/assets/auralink-cta-motion.js', type: '' }]);
  assert.equal(scripts.length, 4);
  window.auralinkCtaMotionLoaded = true; scripts[3].onload(); await Promise.resolve(); flush();
  sectionEvent('shopify:section:load', [{ src: '/assets/auralink-cta-motion.js', type: '' }]);
  assert.equal(scripts.length, 4); flush();
  console.log('PASS section lifecycle: reorder, duplicate, delete, navbar fallback, one library load, failure/timeout retry and first-time editor insertion, independent of Lenis.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
