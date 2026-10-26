/* Bento reveal: heading -> centered stat -> stacked pair -> large device card.
   Sequence follows the supplied four-frame reference; Figma timing unavailable. */
(function () {
  'use strict';
  if (window.auralinkBentoMotionLoaded) return;
  window.auralinkBentoMotionLoaded = true;
  const libraryLoads = new Map();

  function loadLibrary(url, ready) {
    if (window.AuraLinkSectionLayout) return window.AuraLinkSectionLayout.load(url, ready);
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
    scope.querySelectorAll('.auralink-bento-wrapper').forEach(function (wrapper) {
      if (wrapper._bentoMotionDestroy || (window.Shopify && window.Shopify.designMode)) return;
      const media = window.matchMedia('(min-width: 990px) and (prefers-reduced-motion: no-preference)');
      let context = null;
      let pending = false;
      let destroyed = false;

      function update() {
        if (!media.matches) {
          if (context) context.revert();
          context = null;
          wrapper.classList.remove('is-bento-sequenced');
          wrapper.classList.remove('is-bento-pending');
          return;
        }
        if (context || pending) return;
        pending = true;
        wrapper.classList.add('is-bento-pending');
        loadLibrary(wrapper.dataset.gsapUrl, function () { return Boolean(window.gsap); })
          .then(function () {
            return loadLibrary(wrapper.dataset.scrolltriggerUrl, function () { return Boolean(window.ScrollTrigger); });
          }).then(function () {
            if (destroyed || !media.matches || !wrapper.isConnected) return;
            const header = wrapper.querySelector('.auralink-bento-header');
            const grid = wrapper.querySelector('.auralink-bento-grid');
            const stat = wrapper.querySelector('.auralink-bento-card--stat');
            const stacked = wrapper.querySelector('.auralink-bento-col--stacked');
            const large = wrapper.querySelector('.auralink-bento-card--large');
            if (!grid || !stat || !stacked || !large) return;
            const statNumber = stat.querySelector('.auralink-bento-stat__number');
            const statText = statNumber ? statNumber.textContent : '';
            const percentage = statText.trim().match(/^(\d+)\s*%$/);
            const statDetails = stat.querySelectorAll('.auralink-bento-stat__badge, .auralink-bento-stat__desc');
            const stackedCards = stacked.querySelectorAll('.auralink-bento-card');
            const stackedDetails = stacked.querySelectorAll('.auralink-bento-pill-tag, .auralink-bento-shield-icon, .auralink-bento-shield-text');
            const glass = large.querySelector('.auralink-bento-glass-card');
            const glassText = large.querySelector('.auralink-bento-glass-card__text');
            const gsap = window.gsap;
            gsap.registerPlugin(window.ScrollTrigger);
            wrapper.classList.add('is-bento-sequenced');
            const section = wrapper.closest('.shopify-section') || wrapper;
            const container = wrapper.querySelector('.auralink-bento-container');
            const textReveals = [];
            function prepareText(el) {
              const engine = window.AuraLinkLiquidReveal;
              const reveal = engine && engine.createControlled ? engine.createControlled(el) : null;
              if (reveal) textReveals.push(reveal);
              return reveal;
            }
            const headingReveals = header ? Array.from(header.querySelectorAll('[data-liquid-reveal="text"]')).map(prepareText).filter(Boolean) : [];
            let headingPlayed = false;
            let positions;
            function measure() {
              const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
              const pairLeft = (grid.clientWidth - stacked.offsetWidth - gap - stat.offsetWidth) / 2;
              positions = {
                statCenter: grid.clientWidth / 2 - stat.offsetLeft - stat.offsetWidth / 2,
                statPair: pairLeft + stacked.offsetWidth + gap - stat.offsetLeft,
                stackedPair: pairLeft - stacked.offsetLeft,
                headingCenter: header ? wrapper.clientHeight / 2 - container.offsetTop - header.offsetTop - header.offsetHeight / 2 : 0
              };
            }
            measure();
            context = gsap.context(function () {
              let timeline;
              timeline = gsap.timeline({
                defaults: { ease: 'power2.inOut' },
                scrollTrigger: {
                  trigger: section,
                  pin: section,
                  pinSpacing: true,
                  start: 'top top',
                  end: function () { return '+=' + Math.max(1200, document.documentElement.clientHeight * 2.2); },
                  scrub: window.AuraLinkSmoothScroll && window.AuraLinkSmoothScroll.active ? true : 0.6,
                  onEnter: function () {
                    if (headingPlayed) return;
                    headingPlayed = true;
                    headingReveals.forEach(function (reveal) { reveal.play(); });
                  },
                  onRefreshInit: function () {
                    measure();
                    if (!timeline) return;
                    const time = timeline.time();
                    timeline.render(0, true, true);
                    timeline.invalidate().render(0, true, true);
                    timeline.render(time, true, true);
                  }
                }
              });
              gsap.set(stat, { autoAlpha: 0, y: 24, x: function () { return positions.statCenter; } });
              gsap.set(stacked, { autoAlpha: 0, y: 20, x: function () { return positions.stackedPair; } });
              gsap.set(large, { autoAlpha: 0, x: -32 });
              if (statDetails.length) gsap.set(statDetails, { autoAlpha: 0, y: 14 });
              if (stackedCards.length) gsap.set(stackedCards, { autoAlpha: 0, y: 18 });
              if (stackedDetails.length) gsap.set(stackedDetails, { autoAlpha: 0, y: 12 });
              if (glass) gsap.set(glass, { autoAlpha: 0, y: 24 });
              if (glassText) gsap.set(glassText, { autoAlpha: 0, y: 10 });
              timeline.set(stat, { x: function () { return positions.statCenter; }, immediateRender: true, lazy: false }, 0);
              timeline.set(stacked, { x: function () { return positions.stackedPair; }, immediateRender: true, lazy: false }, 0);
              timeline.addLabel('heading', 0);
              if (header) {
                timeline.set(header, {
                  y: function () { return positions.headingCenter; }, immediateRender: true, lazy: false
                }, 0);
                timeline.to(header, { y: 0, duration: 0.9, lazy: false }, 0.25);
              }
              timeline.to(stat, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.05);
              if (statDetails.length) timeline.to(statDetails, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, 1.25);
              if (percentage) {
                const count = { value: 0 };
                let previousValue = -1;
                function renderCount() {
                  const value = Math.round(count.value);
                  if (value === previousValue) return;
                  previousValue = value;
                  statNumber.textContent = value + '%';
                }
                renderCount();
                timeline.to(count, {
                  value: Number(percentage[1]), duration: 0.85, ease: 'power1.out', onUpdate: renderCount
                }, 1.1);
              }
              timeline.addLabel('stat', 1.8);
              timeline.to(stat, { x: function () { return positions.statPair; }, duration: 0.9 }, 2.1);
              timeline.to(stacked, { autoAlpha: 1, y: 0, duration: 0.9 }, 2.1);
              if (stackedCards.length) timeline.to(stackedCards, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out' }, 2.18);
              if (stackedDetails.length) timeline.to(stackedDetails, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }, 2.4);
              timeline.addLabel('pair', 3.05);
              timeline.to([stat, stacked], { x: 0, duration: 1 }, 3.4);
              timeline.to(large, { autoAlpha: 1, x: 0, duration: 1 }, 3.4);
              if (glass) timeline.to(glass, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 3.7);
              if (glassText) timeline.to(glassText, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 3.95);
              timeline.addLabel('complete', 4.5);
              timeline.to({}, { duration: 0.45 });
              function revealText(selector, at) {
                wrapper.querySelectorAll(selector).forEach(function (el, index) {
                  const reveal = prepareText(el);
                  if (!reveal) return;
                  const state = { progress: 0 };
                  reveal.render(0);
                  timeline.to(state, {
                    progress: 1, duration: 1, ease: 'none',
                    onUpdate: function () { reveal.render(state.progress); }
                  }, at + index * 0.06);
                });
              }
              revealText('.auralink-bento-stat__desc', 1.25);
              revealText('.auralink-bento-pill-tag, .auralink-bento-shield-text', 2.4);
              revealText('.auralink-bento-glass-card__text', 3.95);
              return function () {
                textReveals.forEach(function (reveal) { reveal.destroy(); });
                // Restore merchant content when motion is disabled or the section unloads.
                if (statNumber) statNumber.textContent = statText;
              };
            }, wrapper);
            if (window.AuraLinkSectionLayout) window.AuraLinkSectionLayout.refresh();
            else {
              window.ScrollTrigger.sort();
              window.ScrollTrigger.refresh();
            }
          }).catch(function () {
            // Failed enhancement leaves the existing readable, static grid.
            if (context) context.revert();
            context = null;
            wrapper.classList.remove('is-bento-sequenced');
          }).finally(function () {
            pending = false;
            wrapper.classList.remove('is-bento-pending');
          });
      }

      media.addEventListener('change', update);
      wrapper._bentoMotionDestroy = function () {
        destroyed = true;
        media.removeEventListener('change', update);
        if (context) context.revert();
        wrapper.classList.remove('is-bento-sequenced');
        wrapper.classList.remove('is-bento-pending');
        delete wrapper._bentoMotionDestroy;
      };
      update();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(document); });
  else init(document);
  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
  document.addEventListener('shopify:section:unload', function (event) {
    event.target.querySelectorAll('.auralink-bento-wrapper').forEach(function (wrapper) {
      if (wrapper._bentoMotionDestroy) wrapper._bentoMotionDestroy();
    });
  });
})();
