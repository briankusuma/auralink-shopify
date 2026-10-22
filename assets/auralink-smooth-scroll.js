/* Lenis uses the document scroller, including footer and ScrollTrigger spacers. */
(function () {
  'use strict';
  if (window.AuraLinkSmoothScroll || (window.Shopify && window.Shopify.designMode) || !window.Lenis) return;
  const eligible = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const nested = '[data-lenis-prevent], .drawer, .menu-drawer, .search-modal, .predictive-search, .modal__content, .facets__display, .facets__display-vertical, .mobile-facets__inner, .disclosure__list, [role="listbox"], dialog, quick-add-modal, product-modal, select, textarea';
  let instance = null;
  let resizeFrame = null;
  let layoutTimer = null;
  let scrollTrigger = null;
  let suspended = false;
  const service = {
    get active() { return Boolean(instance); },
    get instance() { return instance; },
    resize: scheduleResize
  };
  window.AuraLinkSmoothScroll = service;

  function pageLocked() {
    const body = document.body;
    const width = window.innerWidth;
    return [document.documentElement, body].some(function (el) {
      return el.classList.contains('overflow-hidden') || el.classList.contains('loading-screen-active') ||
        (width < 750 && el.classList.contains('overflow-hidden-mobile')) ||
        (width < 990 && el.classList.contains('overflow-hidden-tablet')) ||
        el.classList.contains('overflow-hidden-desktop') ||
        ['hidden', 'clip'].includes(el.style.overflowY || el.style.overflow);
    });
  }
  function syncLock() {
    if (!instance) return;
    if (pageLocked()) {
      if (!instance.isStopped) instance.stop();
    } else if (instance.isStopped) instance.start();
  }
  function bindScrollTrigger() {
    const next = window.ScrollTrigger;
    if (!next || next === scrollTrigger) return;
    if (scrollTrigger) scrollTrigger.removeEventListener('refresh', scheduleResize);
    scrollTrigger = next;
    scrollTrigger.addEventListener('refresh', scheduleResize);
  }
  function scheduleResize() {
    if (resizeFrame !== null) return;
    resizeFrame = requestAnimationFrame(function () {
      resizeFrame = null;
      bindScrollTrigger();
      if (instance) instance.resize();
    });
  }
  function refreshLayout() {
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(function () {
      bindScrollTrigger();
      if (window.AuraLinkSectionLayout) window.AuraLinkSectionLayout.refresh();
      else if (scrollTrigger) scrollTrigger.refresh();
      scheduleResize();
    }, 120);
  }
  function update() {
    if (instance) instance.destroy();
    instance = null;
    if (suspended || !eligible.matches) return;
    instance = new window.Lenis({
      wrapper: window,
      content: document.documentElement,
      autoRaf: true,
      autoResize: true,
      lerp: 0.18,
      smoothWheel: true,
      syncTouch: false,
      infinite: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      prevent: function (node) { return pageLocked() || Boolean(node.matches && node.matches(nested)); },
      virtualScroll: function (data) { return !data.event.defaultPrevented && !data.event.altKey; }
    });
    instance.on('scroll', function () {
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    });
    bindScrollTrigger();
    syncLock();
    scheduleResize();
  }

  function init() {
    update();
    // Body includes the footer. Its observer also catches inserted pin spacers and app blocks.
    const sizeObserver = new ResizeObserver(scheduleResize);
    sizeObserver.observe(document.body);
    const lockObserver = new MutationObserver(syncLock);
    [document.documentElement, document.body].forEach(function (el) {
      lockObserver.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    });
    eligible.addEventListener('change', update);
    window.addEventListener('resize', function () { syncLock(); refreshLayout(); }, { passive: true });
    window.addEventListener('load', refreshLayout, { once: true });
    document.addEventListener('load', function (event) {
      if (event.target.tagName === 'IMG') refreshLayout();
      else if (event.target.tagName === 'SCRIPT') { bindScrollTrigger(); scheduleResize(); }
    }, true);
    ['shopify:section:load', 'shopify:section:unload', 'shopify:section:reorder', 'auralink:radio:docked', 'auralink:loading:done'].forEach(function (name) {
      document.addEventListener(name, refreshLayout);
    });
    if (document.fonts) document.fonts.ready.then(refreshLayout);
    window.addEventListener('pagehide', function () {
      suspended = true;
      clearTimeout(layoutTimer);
      cancelAnimationFrame(resizeFrame);
      resizeFrame = null;
      sizeObserver.disconnect();
      update();
    });
    window.addEventListener('pageshow', function (event) {
      if (!event.persisted) return;
      suspended = false;
      sizeObserver.observe(document.body);
      update();
      refreshLayout();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
