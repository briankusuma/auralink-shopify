/* User reference: centered author -> quote -> metrics/logos -> logo tiles. */
(function () {
  'use strict';
  if (window.auralinkImpactMotionLoaded) return;
  window.auralinkImpactMotionLoaded = true;
  const libraryLoads = new Map();

  function loadLibrary(url, ready) {
    if (ready()) return Promise.resolve();
    const absoluteUrl = new URL(url, window.location.href).href;
    if (libraryLoads.has(absoluteUrl)) return libraryLoads.get(absoluteUrl);
    const promise = new Promise(function (resolve, reject) {
      let script = Array.from(document.scripts).find(function (item) { return item.src === absoluteUrl; });
      const existing = Boolean(script);
      if (!script) script = document.createElement('script');
      script.addEventListener('load', function () { ready() ? resolve() : reject(new Error('Animation library unavailable')); }, { once: true });
      script.addEventListener('error', reject, { once: true });
      if (!existing) {
        script.src = absoluteUrl;
        document.head.appendChild(script);
      }
    });
    libraryLoads.set(absoluteUrl, promise);
    return promise;
  }

  function init(scope) {
    scope.querySelectorAll('.auralink-impact-wrapper').forEach(function (wrapper) {
      if (wrapper._impactMotionDestroy || (window.Shopify && window.Shopify.designMode)) return;
      const media = window.matchMedia('(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
      let context = null;
      let pending = false;
      let destroyed = false;
      let textReveals = [];

      function reset() {
        if (context) context.revert();
        context = null;
        textReveals.forEach(function (reveal) { reveal.destroy(); });
        textReveals = [];
        wrapper.classList.remove('is-impact-sequenced');
      }

      function update() {
        if (!media.matches) { reset(); return; }
        if (context || pending || destroyed) return;
        pending = true;
        loadLibrary(wrapper.dataset.gsapUrl, function () { return Boolean(window.gsap); })
          .then(function () {
            return loadLibrary(wrapper.dataset.scrolltriggerUrl, function () { return Boolean(window.ScrollTrigger); });
          }).then(function () {
            if (destroyed || !media.matches || !wrapper.isConnected) return;
            const card = wrapper.querySelector('.auralink-impact-card');
            const row = wrapper.querySelector('.auralink-impact-quote-row');
            const author = wrapper.querySelector('.auralink-impact-author');
            const quote = wrapper.querySelector('.auralink-impact-quote-text');
            const quoteDivider = wrapper.querySelector('.auralink-impact-quote-divider');
            const divider = wrapper.querySelector('.auralink-impact-divider');
            const metrics = wrapper.querySelectorAll('.auralink-impact-metric-item');
            const logos = wrapper.querySelector('.auralink-impact-logos');
            const tiles = wrapper.querySelectorAll('.auralink-impact-logo-card');
            if (!card || !row || !author || !logos) return;
            const gsap = window.gsap;
            gsap.registerPlugin(window.ScrollTrigger);
            wrapper.classList.add('is-impact-sequenced');
            const section = wrapper.closest('.shopify-section') || wrapper;
            let positions;

            function layoutOffset(el) {
              let x = 0;
              let y = 0;
              while (el && el !== wrapper) {
                x += el.offsetLeft;
                y += el.offsetTop;
                el = el.offsetParent;
              }
              return { x: x, y: y };
            }
            function measure() {
              const authorOffset = layoutOffset(author);
              const rowOffset = layoutOffset(row);
              positions = {
                authorX: wrapper.clientWidth / 2 - authorOffset.x - author.offsetWidth / 2,
                rowY: wrapper.clientHeight / 2 - rowOffset.y - row.offsetHeight / 2
              };
            }

            context = gsap.context(function () {}, wrapper);
            context.add(function () {
              const controlledTexts = [];
              wrapper.querySelectorAll('.auralink-impact-quote-text, .auralink-impact-metric__stat, .auralink-impact-metric__label').forEach(function (el) {
                const engine = window.AuraLinkLiquidReveal;
                const reveal = engine && engine.createControlled ? engine.createControlled(el) : null;
                if (!reveal) return;
                textReveals.push(reveal);
                controlledTexts.push({ el: el, reveal: reveal });
              });
              measure();
              const timeline = gsap.timeline({
                defaults: { ease: 'power2.inOut' },
                scrollTrigger: {
                  trigger: section, pin: section, pinSpacing: true,
                  start: 'top top',
                  end: function () { return '+=' + Math.max(1800, document.documentElement.clientHeight * 3); },
                  scrub: 0.65, refreshPriority: -2,
                  invalidateOnRefresh: true, onRefreshInit: measure
                }
              });
              timeline.set(author, { x: function () { return positions.authorX; }, immediateRender: true, lazy: false }, 0);
              timeline.set(row, { y: function () { return positions.rowY; }, immediateRender: true, lazy: false }, 0);
              gsap.set(card, { backgroundColor: 'rgba(245,243,240,0)', borderRadius: 0 });
              if (quote) gsap.set(quote, { autoAlpha: 0, y: 16 });
              if (quoteDivider) gsap.set(quoteDivider, { autoAlpha: 0, scaleY: 0, transformOrigin: 'center' });
              if (divider) gsap.set(divider, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left' });
              gsap.set(metrics, { autoAlpha: 0, y: -72 });
              gsap.set(logos, { autoAlpha: 0, y: 20, backgroundColor: 'rgba(245,243,240,0)', borderRadius: 24 });
              gsap.set(tiles, { backgroundColor: 'rgba(245,243,240,0)', borderRadius: 0 });
              const metricStart = 2.6;
              const metricStagger = 0.32;
              // Wait for both the last descending card and its liquid text.
              const panelStart = 2.7 + Math.max(0, metrics.length - 1) * metricStagger + 1.12;
              const logoPanelStart = panelStart + 0.95;
              const tileStart = logoPanelStart + 1.15;
              const completeAt = tileStart + Math.max(1.2, 0.8 + Math.max(0, tiles.length - 1) * 0.04);
              timeline.addLabel('author', 0);
              timeline.to(author, { x: 0, duration: 1.15, lazy: false }, 0.4);
              if (quoteDivider) timeline.to(quoteDivider, { autoAlpha: 1, scaleY: 1, duration: 0.7 }, 0.7);
              if (quote) timeline.to(quote, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.85);
              timeline.addLabel('quote', 1.85);
              timeline.to(row, { y: 0, duration: 1, lazy: false }, 2.2);
              timeline.to(metrics, { autoAlpha: 1, y: 0, stagger: metricStagger, duration: 0.9 }, metricStart);
              timeline.addLabel('metrics', panelStart - 0.12);
              timeline.to(card, { backgroundColor: '#F5F3F0', borderRadius: 32, duration: 0.8 }, panelStart);
              if (divider) timeline.to(divider, { autoAlpha: 1, scaleX: 1, duration: 0.6 }, panelStart);
              timeline.addLabel('panel', logoPanelStart);
              timeline.to(logos, { autoAlpha: 1, y: 0, backgroundColor: '#F5F3F0', duration: 0.75 }, logoPanelStart);
              timeline.addLabel('logoPanel', tileStart - 0.2);
              timeline.to(tiles, { backgroundColor: '#F5F3F0', borderRadius: 24, stagger: 0.04, duration: 0.8 }, tileStart);
              timeline.to(logos, { backgroundColor: 'rgba(245,243,240,0)', duration: 0.8 }, tileStart + 0.4);
              timeline.addLabel('complete', completeAt);
              timeline.to({}, { duration: 0.4 }, completeAt);
              controlledTexts.forEach(function (item) {
                const state = { progress: 0 };
                const metricIndex = Array.from(metrics).findIndex(function (metric) { return metric.contains(item.el); });
                const at = item.el === quote ? 0.85 : 2.7 + Math.max(0, metricIndex) * metricStagger;
                timeline.to(state, {
                  progress: 1, duration: 1, ease: 'none',
                  onUpdate: function () { item.reveal.render(state.progress); }
                }, at);
              });
            });
            window.ScrollTrigger.sort();
            window.ScrollTrigger.refresh();
          }).catch(reset).finally(function () { pending = false; });
      }

      media.addEventListener('change', update);
      wrapper._impactMotionDestroy = function () {
        destroyed = true;
        media.removeEventListener('change', update);
        reset();
        delete wrapper._impactMotionDestroy;
      };
      update();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(document); });
  else init(document);
  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
  document.addEventListener('shopify:section:unload', function (event) {
    event.target.querySelectorAll('.auralink-impact-wrapper').forEach(function (wrapper) {
      if (wrapper._impactMotionDestroy) wrapper._impactMotionDestroy();
    });
  });
})();
