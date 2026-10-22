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
      let surface = null;
      let pending = false;
      let destroyed = false;
      let textReveals = [];
      let counters = [];

      function reset() {
        if (context) context.revert();
        context = null;
        if (surface) surface.removeAttribute('style');
        surface = null;
        textReveals.forEach(function (reveal) { reveal.destroy(); });
        textReveals = [];
        counters.forEach(function (counter) { counter.el.textContent = counter.original; });
        counters = [];
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
            const boxes = wrapper.querySelectorAll('.auralink-impact-metric__box');
            const contents = wrapper.querySelectorAll('.auralink-impact-metric__content');
            const logos = wrapper.querySelector('.auralink-impact-logos');
            const tiles = wrapper.querySelectorAll('.auralink-impact-logo-card');
            if (!card || !row || !author || !logos) return;
            const gsap = window.gsap;
            gsap.registerPlugin(window.ScrollTrigger);
            wrapper.classList.add('is-impact-sequenced');
            surface = wrapper.querySelector('[data-impact-surface]');
            if (!surface) { wrapper.classList.remove('is-impact-sequenced'); return; }
            Object.assign(surface.style, { display: 'block', position: 'absolute', top: '0px', left: '0px', background: '#F5F3F0', pointerEvents: 'none' });
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
              const cardOffset = layoutOffset(card);
              positions = {
                panelX: cardOffset.x, panelY: cardOffset.y,
                panelWidth: card.offsetWidth, panelHeight: card.offsetHeight,
                authorX: wrapper.clientWidth / 2 - authorOffset.x - author.offsetWidth / 2,
                rowY: wrapper.clientHeight / 2 - rowOffset.y - row.offsetHeight / 2,
                boxXs: Array.from(boxes).map(function (box) { return Math.max(0, (box.parentElement.offsetWidth - box.offsetWidth) / 2); })
              };
            }

            context = gsap.context(function () {}, wrapper);
            context.add(function () {
              const controlledTexts = [];
              wrapper.querySelectorAll('.auralink-impact-quote-text, .auralink-impact-metric__label').forEach(function (el) {
                const engine = window.AuraLinkLiquidReveal;
                const reveal = engine && engine.createControlled ? engine.createControlled(el) : null;
                if (!reveal) return;
                textReveals.push(reveal);
                controlledTexts.push({ el: el, reveal: reveal });
              });
              measure();
              let introStarted = false;
              let introDone = false;
              const playhead = { progress: 0 };
              const release = { progress: 0 };
              const timeline = gsap.timeline({
                paused: true,
                defaults: { ease: 'power2.inOut' }
              });
              timeline.set(row, { y: function () { return positions.rowY; }, immediateRender: true, lazy: false }, 0);
              timeline.set(boxes, { x: function (index) { return positions.boxXs[index]; }, immediateRender: true, lazy: false }, 0);
              gsap.set(card, { backgroundColor: 'rgba(245,243,240,0)', borderRadius: 0 });
              gsap.set(wrapper, { backgroundColor: '#FFFFFF' });
              gsap.set(surface, { autoAlpha: 1, x: 0, y: 0, width: wrapper.clientWidth, height: wrapper.clientHeight, borderRadius: 0 });
              if (quote) gsap.set(quote, { autoAlpha: 0, y: 16 });
              if (quoteDivider) gsap.set(quoteDivider, { autoAlpha: 0, scaleY: 0, transformOrigin: 'center' });
              if (divider) gsap.set(divider, { autoAlpha: 0, scaleX: 0, transformOrigin: 'left' });
              gsap.set(metrics, { autoAlpha: 0, y: -72 });
              gsap.set(contents, { autoAlpha: 0, y: 12 });
              gsap.set(logos, { autoAlpha: 0, y: 20, backgroundColor: 'rgba(245,243,240,0)', borderRadius: 24 });
              gsap.set(tiles, { backgroundColor: 'rgba(245,243,240,0)', borderRadius: 0 });
              function applyScroll() {
                if (introDone) timeline.progress(playhead.progress * release.progress);
              }
              const releaseTween = gsap.to(release, {
                progress: 1, duration: 0.6, ease: 'power2.out', paused: true, onUpdate: applyScroll
              });
              const intro = gsap.timeline({
                paused: true, defaults: { ease: 'power2.inOut' },
                onComplete: function () { introDone = true; releaseTween.play(0); }
              });
              intro.set(author, { x: function () { return positions.authorX; }, immediateRender: true, lazy: false }, 0);
              intro.to(author, { x: 0, duration: 1.35, lazy: false }, 0.25);
              // The photo settles before either divider or quote starts.
              if (quoteDivider) intro.to(quoteDivider, { autoAlpha: 1, scaleY: 1, duration: 0.55 }, 1.72);
              if (quote) intro.to(quote, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.86);
              const metricStart = 2.6;
              const metricStagger = 0.32;
              const iconsDone = metricStart + 0.9 + Math.max(0, metrics.length - 1) * metricStagger;
              const textStart = iconsDone + 0.16;
              const panelStart = metricStart;
              const logoPanelStart = panelStart + 0.95;
              const tileStart = textStart + 0.9;
              const completeAt = tileStart + Math.max(1.2, 0.8 + Math.max(0, tiles.length - 1) * 0.04);
              timeline.addLabel('quote', 0);
              timeline.to(row, { y: 0, duration: 1, lazy: false }, 2.2);
              // One cream overlay contracts onto the panel; the section stays white.
              timeline.fromTo(surface, {
                x: 0, y: 0, width: function () { return wrapper.clientWidth; }, height: function () { return wrapper.clientHeight; }, borderRadius: 0
              }, {
                x: function () { return positions.panelX; }, y: function () { return positions.panelY; },
                width: function () { return positions.panelWidth; }, height: function () { return positions.panelHeight; },
                borderRadius: 32, duration: 1.3, immediateRender: false, lazy: false
              }, panelStart);
              timeline.to(metrics, { autoAlpha: 1, y: 0, stagger: metricStagger, duration: 0.9 }, metricStart);
              timeline.addLabel('metrics', iconsDone);
              if (divider) timeline.to(divider, { autoAlpha: 1, scaleX: 1, duration: 0.6 }, panelStart);
              timeline.addLabel('panel', logoPanelStart);
              timeline.to(logos, { autoAlpha: 1, y: 0, backgroundColor: '#F5F3F0', duration: 0.75 }, logoPanelStart);
              timeline.addLabel('logoPanel', textStart - 0.01);
              timeline.addLabel('metricText', textStart);
              timeline.to(boxes, { x: 0, duration: 0.7 }, textStart);
              timeline.to(contents, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.8 }, textStart);
              timeline.to(tiles, { backgroundColor: '#F5F3F0', borderRadius: 24, stagger: 0.04, duration: 0.8 }, tileStart);
              timeline.to(logos, { backgroundColor: 'rgba(245,243,240,0)', duration: 0.8 }, tileStart + 0.4);
              timeline.addLabel('complete', completeAt);
              timeline.to({}, { duration: 0.4 }, completeAt);
              controlledTexts.forEach(function (item) {
                const state = { progress: 0 };
                const metricIndex = Array.from(metrics).findIndex(function (metric) { return metric.contains(item.el); });
                const isQuote = item.el === quote;
                const at = isQuote ? 1.86 : textStart + Math.max(0, metricIndex) * 0.12;
                (isQuote ? intro : timeline).to(state, {
                  progress: 1, duration: 1, ease: 'none',
                  onUpdate: function () { item.reveal.render(state.progress); }
                }, at);
              });
              metrics.forEach(function (metric, index) {
                const el = metric.querySelector('.auralink-impact-metric__stat');
                if (!el) return;
                const original = el.textContent;
                const match = original.trim().match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
                if (!match) return;
                const precision = (match[2].split('.')[1] || '').length;
                const count = { value: 0 };
                let previous = '';
                counters.push({ el: el, original: original });
                gsap.set(el, { minWidth: el.offsetWidth });
                function renderCount() {
                  const value = match[1] + count.value.toFixed(precision) + match[3];
                  if (value === previous) return;
                  el.textContent = value;
                  previous = value;
                }
                renderCount();
                timeline.to(count, { value: Number(match[2]), duration: 1, ease: 'power1.out', onUpdate: renderCount }, textStart + index * 0.12);
              });
              function startIntro() {
                if (introStarted) return;
                introStarted = true;
                intro.play();
              }
              function reverseIntro() {
                if (!introStarted) return;
                // Rewind the later stages before giving the scene back to the intro.
                releaseTween.pause(0);
                timeline.progress(0);
                introDone = false;
                introStarted = false;
                intro.reverse();
              }
              // Scroll records progress during the timed intro; it cannot skip it.
              const driver = gsap.to(playhead, {
                progress: 1, ease: 'none', onUpdate: applyScroll,
                scrollTrigger: {
                  trigger: section, pin: section, pinSpacing: true,
                  start: 'top top',
                  end: function () { return '+=' + Math.max(1800, document.documentElement.clientHeight * 3); },
                  scrub: window.AuraLinkSmoothScroll && window.AuraLinkSmoothScroll.active ? true : 0.65,
                  // The driver has fixed endpoints. Invalidating it would capture
                  // its current progress as a new start and prevent a full rewind.
                  refreshPriority: -2,
                  onEnter: startIntro,
                  onEnterBack: startIntro,
                  onLeaveBack: reverseIntro,
                  onUpdate: function (self) {
                    // A small dead band avoids toggling while resting at the pin boundary.
                    if (self.direction < 0 && self.progress <= 0.015) reverseIntro();
                    else if (self.direction > 0 && self.progress > 0.025) startIntro();
                  },
                  onRefreshInit: function () {
                    measure();
                    // Rewind before invalidating: otherwise GSAP captures the current
                    // translated positions as new starting values on refresh.
                    const time = timeline.time();
                    timeline.render(0, true, true);
                    timeline.invalidate().render(0, true, true);
                    timeline.render(time, true, true);
                    const introTime = intro.time();
                    intro.render(0, true, true);
                    intro.invalidate().render(0, true, true);
                    intro.render(introTime, true, true);
                  }
                }
              });
              if (driver.scrollTrigger && (driver.scrollTrigger.isActive || driver.scrollTrigger.progress > 0)) startIntro();
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
