/* Screenshot sequence: full lime -> centered tile -> curved hand -> CTA card.
   Native reversible scroll animation; no library loading or image decode waits. */
(function () {
  'use strict';
  if (window.auralinkCtaMotionLoaded) return;
  window.auralinkCtaMotionLoaded = true;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const phase = (progress, start, end) => clamp((progress - start) / (end - start));
  const smooth = (value) => value * value * (3 - 2 * value);
  const mix = (start, end, progress) => start + (end - start) * progress;

  function init(scope) {
    scope.querySelectorAll('.auralink-cta-wrapper').forEach(function (wrapper) {
      if (wrapper._ctaMotionDestroy || (window.Shopify && window.Shopify.designMode)) return;
      const section = wrapper.closest('.shopify-section');
      const media = wrapper.querySelector('.auralink-cta__media-col');
      const card = wrapper.querySelector('.auralink-cta__card');
      const hand = wrapper.querySelector('.auralink-cta__motion-hand, .auralink-cta__image');
      if (!section || !media || !card || !hand) return;
      const query = window.matchMedia('(min-width: 991px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)');
      let events, frame, surface, bounds, progress, lastTime;
      let textReveals = [];
      const originals = [wrapper, media, card, hand].map((el) => ({ el, style: el.getAttribute('style') }));
      const originalInert = card.inert;

      function reset() {
        if (events) events.abort();
        cancelAnimationFrame(frame);
        frame = null;
        if (surface) surface.remove();
        surface = null;
        textReveals.forEach((reveal) => reveal.destroy());
        textReveals = [];
        originals.forEach(function (item) {
          if (item.style === null) item.el.removeAttribute('style');
          else item.el.setAttribute('style', item.style);
        });
        card.inert = originalInert;
        wrapper.classList.remove('is-cta-sequenced');
        section.classList.remove('is-cta-motion-section');
      }

      function offset(el) {
        let x = 0, y = 0;
        while (el && el !== wrapper) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent;
        }
        return { x, y };
      }

      function measure() {
        const pos = offset(media);
        const width = media.offsetWidth;
        const height = Math.min(card.offsetHeight, media.offsetHeight);
        bounds = {
          width, height, x: pos.x, y: pos.y + media.offsetHeight - height,
          centerX: (wrapper.clientWidth - width) / 2,
          centerY: (wrapper.clientHeight - height) / 2,
          fullWidth: wrapper.clientWidth, fullHeight: wrapper.clientHeight,
          handHeight: media.offsetHeight
        };
        media.style.setProperty('--cta-tile-height', height + 'px');
      }

      function render(value) {
        const shrink = smooth(phase(value, 0.04, 0.32));
        const place = smooth(phase(value, 0.73, 0.90));
        const tileX = mix(bounds.centerX, bounds.x, place);
        const tileY = mix(bounds.centerY, bounds.y, place);
        surface.style.width = mix(bounds.fullWidth, bounds.width, shrink) + 'px';
        surface.style.height = mix(bounds.fullHeight, bounds.height, shrink) + 'px';
        surface.style.transform = 'translate3d(' + mix(0, tileX, shrink) + 'px,' + mix(0, tileY, shrink) + 'px,0)';
        surface.style.borderRadius = mix(0, 32, shrink) + 'px';
        media.style.transform = 'translate3d(' + (tileX - bounds.x) + 'px,' + (tileY - bounds.y) + 'px,0)';

        // Quadratic path: lateral sweep, gentle overshoot, then a level resting pose.
        const rise = phase(value, 0.39, 0.69);
        const t = rise * rise * rise * (rise * (rise * 6 - 15) + 10);
        const inverse = 1 - t;
        // Overscan places the source image's cut wrist edge beyond the clipped portal.
        const x = (inverse * inverse * 0.34 + 2 * inverse * t * -0.12 + 0.04) * bounds.width;
        const y = (inverse * inverse * 1.15 + 2 * inverse * t * -0.045) * bounds.handHeight;
        const angle = inverse * inverse * -18 + 2 * inverse * t * 4;
        hand.style.opacity = String(smooth(phase(value, 0.39, 0.44)));
        hand.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + angle + 'deg) scale(1.12)';
        const reveal = smooth(phase(value, 0.91, 0.95));
        card.style.opacity = String(reveal);
        card.style.transform = 'translate3d(0,' + mix(32, 0, reveal) + 'px,0)';
        textReveals.forEach((text, index) => text.render(phase(value, 0.94 + Math.min(index, 3) * 0.005, 1)));
        card.inert = value < 1;
      }

      function tick(now) {
        frame = null;
        try {
          const span = Math.max(1, section.offsetHeight - wrapper.offsetHeight);
          const target = clamp(-section.getBoundingClientRect().top / span);
          const elapsed = Math.min(64, Math.max(1, now - (lastTime || now - 16)));
          lastTime = now;
          const follow = window.AuraLinkSmoothScroll && window.AuraLinkSmoothScroll.active ? 1 : 1 - Math.exp(-elapsed / 110);
          progress = progress === null ? target : mix(progress, target, follow);
          if (Math.abs(progress - target) < 0.0005) progress = target;
          render(progress);
          if (progress !== target) frame = requestAnimationFrame(tick);
        } catch (error) { reset(); }
      }
      function schedule() {
        if (!frame) frame = requestAnimationFrame(tick);
      }
      function update() {
        reset();
        if (!query.matches) return;
        wrapper.classList.add('is-cta-sequenced');
        // The section never changes color; only the single lime overlay shrinks.
        wrapper.style.background = '#FFFFFF';
        section.classList.add('is-cta-motion-section');
        // If an unusually long card cannot fit, retain the normal accessible layout.
        if (Math.max(media.offsetHeight, card.offsetHeight) > wrapper.clientHeight - 64) { reset(); return; }
        const engine = window.AuraLinkLiquidReveal;
        if (engine && engine.createControlled) {
          card.querySelectorAll('[data-liquid-reveal="text"]').forEach((el) => {
            const reveal = engine.createControlled(el);
            if (reveal) textReveals.push(reveal);
          });
        }
        surface = document.createElement('div');
        surface.className = 'auralink-cta__motion-surface';
        surface.setAttribute('aria-hidden', 'true');
        // Critical paint properties also live on the generated layer itself.
        // Its color must remain visible when a storefront serves an older stylesheet.
        Object.assign(surface.style, {
          // base.css hides div:empty; this decorative overlay is intentionally empty.
          display: 'block', position: 'absolute', top: '0px', left: '0px',
          background: '#F2FE63', zIndex: '1', opacity: '1',
          visibility: 'visible', pointerEvents: 'none'
        });
        wrapper.prepend(surface);
        events = new AbortController();
        const signal = events.signal;
        progress = null;
        lastTime = null;
        measure();
        render(clamp(-section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - wrapper.offsetHeight)));
        const image = hand;
        image.addEventListener('error', reset, { once: true, signal });
        window.addEventListener('scroll', schedule, { passive: true, signal });
        window.addEventListener('resize', update, { passive: true, signal });
        schedule();
      }
      query.addEventListener('change', update);
      wrapper._ctaMotionDestroy = function () {
        query.removeEventListener('change', update);
        reset();
        delete wrapper._ctaMotionDestroy;
      };
      update();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(document));
  else init(document);
  document.addEventListener('shopify:section:load', (event) => init(event.target));
  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('.auralink-cta-wrapper').forEach((wrapper) => {
      if (wrapper._ctaMotionDestroy) wrapper._ctaMotionDestroy();
    });
  });
})();
