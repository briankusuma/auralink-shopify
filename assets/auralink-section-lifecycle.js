/* Section layout service, independent of Lenis and safe in the Theme Editor. */
(function () {
  'use strict';
  if (window.AuraLinkSectionLayout) return;
  let timer;
  let trigger;
  const libraries = new Map();
  function load(url, ready, type) {
    if (ready()) return Promise.resolve();
    if (!url) return Promise.reject(new Error('Missing local script URL'));
    const absolute = new URL(url, window.location.href).href;
    if (libraries.has(absolute)) return libraries.get(absolute);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(() => finish(new Error('Script load timed out')), 8000);
      function finish(error) {
        clearTimeout(timeout);
        script.onload = script.onerror = null;
        if (error) { script.remove(); reject(error); }
        else { bind(); resolve(); }
      }
      if (type) script.type = type;
      script.src = absolute;
      script.onload = () => finish(ready() ? null : new Error('Script unavailable'));
      script.onerror = () => finish(new Error('Script unavailable'));
      document.head.appendChild(script);
    });
    libraries.set(absolute, promise);
    promise.catch(() => libraries.delete(absolute));
    return promise;
  }
  function sortTriggers() {
    if (!trigger) return;
    const ordered = trigger.getAll().filter((item) => item.trigger && item.trigger.isConnected);
    ordered.sort((a, b) => {
      const position = a.trigger.compareDocumentPosition(b.trigger);
      return position & 4 ? -1 : position & 2 ? 1 : 0;
    });
    // Pin spacing must be measured in document order, including duplicate sections.
    ordered.forEach((item, index) => { item.vars.refreshPriority = -index; });
    trigger.sort();
  }
  function bind() {
    if (!window.ScrollTrigger || window.ScrollTrigger === trigger) return;
    if (trigger) trigger.removeEventListener('refreshInit', sortTriggers);
    trigger = window.ScrollTrigger;
    trigger.addEventListener('refreshInit', sortTriggers);
  }
  function flush() {
    bind();
    const smooth = window.AuraLinkSmoothScroll && window.AuraLinkSmoothScroll.instance;
    if ((trigger && trigger.isScrolling && trigger.isScrolling()) || (smooth && smooth.isScrolling)) {
      timer = setTimeout(flush, 160);
      return;
    }
    if (trigger) trigger.refresh();
    window.dispatchEvent(new CustomEvent('auralink:layout'));
    if (window.AuraLinkSmoothScroll) window.AuraLinkSmoothScroll.resize();
    // A hero only owns the overlay navbar when it is the first page section.
    const first = document.querySelector('#MainContent > .shopify-section');
    const header = document.querySelector('.header-wrapper--overlay');
    if (header && (!first || !first.querySelector('.auralink-hero-container'))) {
      header.classList.add('header--visible');
      header.classList.remove('hero-scroll-header');
      header.style.removeProperty('--hero-header-opacity');
    }
  }
  function refresh() {
    clearTimeout(timer);
    timer = setTimeout(flush, 120);
  }
  window.AuraLinkSectionLayout = { refresh, sort: sortTriggers, load };
  // Shopify inserts section HTML without re-running page-load scripts. Bootstrap
  // only these known component assets when a previously absent section is added.
  const components = {
    'auralink-hero-scroll.js': () => window.auralinkHeroScrollLoaded,
    'section-auralink-hero.js': () => window.auralinkHeroRevealLoaded,
    'auralink-radio-3d.js': () => window.auralinkRadioModuleLoaded,
    'auralink-bento-motion.js': () => window.auralinkBentoMotionLoaded,
    'auralink-impact-motion.js': () => window.auralinkImpactMotionLoaded,
    'auralink-cta-motion.js': () => window.auralinkCtaMotionLoaded,
    'auralink-slider.js': () => customElements.get('auralink-slider'),
    'auralink-testimonials.js': () => customElements.get('auralink-testimonials')
  };
  document.addEventListener('shopify:section:load', (event) => {
    event.target.querySelectorAll('script[src]').forEach((script) => {
      const filename = new URL(script.src, window.location.href).pathname.split('/').pop();
      const ready = components[filename];
      if (ready && !ready()) load(script.src, ready, script.type).catch(() => {});
    });
  });
  ['shopify:section:load', 'shopify:section:unload', 'shopify:section:reorder', 'auralink:radio:docked', 'auralink:loading:done'].forEach((name) => document.addEventListener(name, refresh));
  document.addEventListener('load', (event) => {
    if (event.target.tagName === 'SCRIPT') { bind(); refresh(); }
    else if (event.target.tagName === 'IMG') refresh();
  }, true);
  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('load', refresh, { once: true });
  if (document.fonts) document.fonts.ready.then(refresh);
  bind();
  refresh();
})();
