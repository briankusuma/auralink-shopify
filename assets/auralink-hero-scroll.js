/* AuraLink hero framing. GSAP and ScrollTrigger are hosted in theme assets. */
(function () {
  'use strict';
  if (window.auralinkHeroScrollLoaded) return;
  window.auralinkHeroScrollLoaded = true;

  function init(scope) {
    const wrappers = scope.querySelectorAll('.auralink-hero-wrapper');
    if (window.Shopify && window.Shopify.designMode) {
      wrappers.forEach((wrapper) => wrapper.classList.remove('has-scroll-framing'));
      return;
    }
    if (!window.gsap || !window.ScrollTrigger) {
      const wrapper = Array.from(wrappers).find((item) => item.isConnected);
      const service = window.AuraLinkSectionLayout;
      if (!wrapper || !service) return;
      service.load(wrapper.dataset.gsapUrl, () => Boolean(window.gsap))
        .then(() => service.load(wrapper.dataset.scrolltriggerUrl, () => Boolean(window.ScrollTrigger)))
        .then(() => { if (scope === document || scope.isConnected) init(scope); })
        .catch(() => wrappers.forEach((item) => item.classList.remove('has-scroll-framing')));
      return;
    }
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    scope.querySelectorAll('.auralink-hero-wrapper').forEach(function (wrapper) {
      const radio = wrapper.querySelector('[data-auralink-radio-3d]');
      const container = wrapper.querySelector('.auralink-hero-container');
      if (!radio || !container || wrapper._heroScrollDestroy) return;
      const media = wrapper.querySelector('.auralink-hero-media');
      const section = wrapper.closest('.shopify-section') || wrapper.parentElement;
      const match = gsap.matchMedia();
      // Liquid may provide the initial framing class; unmatched mobile/short views
      // must return to normal flow even when the media callback never runs.
      wrapper.classList.remove('has-scroll-framing');

      match.add('(min-width: 990px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)', function () {
        let timeline = null;
        let header = null;
        function syncHeader(progress) {
          const first = document.querySelector('#MainContent > .shopify-section');
          if (first !== section) return;
          header = document.querySelector('.header-wrapper--overlay');
          if (!header) return;
          header.classList.add('hero-scroll-header');
          header.style.setProperty('--hero-header-opacity', progress);
        }
        let docked = radio.dataset.radioDocked === 'true';
        let dimensions;
        const originalMinHeight = section.style.minHeight;

        function measure() {
          // Measure the existing merchant layout before applying scroll framing.
          const wasFramed = wrapper.classList.contains('has-scroll-framing');
          const wasCentered = media.classList.contains('is-intro-center');
          const maxWidth = wrapper.style.maxWidth;
          wrapper.classList.remove('has-scroll-framing');
          media.classList.remove('is-intro-center');
          wrapper.style.maxWidth = '1440px';
          const wrapperStyle = getComputedStyle(wrapper);
          const containerStyle = getComputedStyle(container);
          dimensions = {
            width: Math.min(1440, section.clientWidth),
            fullWidth: section.clientWidth,
            top: parseFloat(wrapperStyle.paddingTop) || 0,
            gutter: parseFloat(wrapperStyle.paddingLeft) || 0,
            radius: parseFloat(containerStyle.borderTopLeftRadius) || 0,
            viewportHeight: document.documentElement.clientHeight,
            bottom: parseFloat(wrapperStyle.paddingBottom) || 0
          };
          wrapper.style.maxWidth = maxWidth;
          if (wasCentered) media.classList.add('is-intro-center');
          if (wasFramed) wrapper.classList.add('has-scroll-framing');
          // The scene dimensions stay fixed; reserve its full height for pinning.
          section.style.minHeight = Math.ceil(Math.max(dimensions.viewportHeight, container.getBoundingClientRect().height) + dimensions.bottom) + 'px';
        }

        measure();
        wrapper.classList.add('has-scroll-framing');
        gsap.set(wrapper, {
          '--hero-frame-top': '0px',
          '--hero-frame-side': '0px',
          '--hero-frame-bottom': '0px',
          '--hero-frame-radius': '0px'
        });

        syncHeader(0);

        function startScroll() {
          if (timeline || !docked || container.dataset.heroRevealComplete !== 'true') return;
          // Pin only after all intro reveals finish. Native scrolling is retained.
          timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: function () { return '+=' + Math.min(480, Math.max(280, dimensions.viewportHeight * 0.4)); },
              pin: section,
              pinSpacing: true,
              scrub: window.AuraLinkSmoothScroll && window.AuraLinkSmoothScroll.active ? true : 0.35,
              invalidateOnRefresh: true,
              onRefreshInit: measure,
              onUpdate: function (self) { syncHeader(self.progress); }
            }
          });
          // Inset the clip instead of animating width/height/padding. This keeps
          // text wrapping, background scale and the WebGL drawing buffer stable.
          timeline.fromTo(wrapper, {
            '--hero-frame-top': '0px',
            '--hero-frame-side': '0px',
            '--hero-frame-bottom': '0px',
            '--hero-frame-radius': '0px'
          }, {
            '--hero-frame-top': function () { return dimensions.top + 'px'; },
            '--hero-frame-side': function () {
              return ((dimensions.fullWidth - dimensions.width) / 2 + dimensions.gutter) + 'px';
            },
            '--hero-frame-bottom': function () { return dimensions.top + 'px'; },
            '--hero-frame-radius': function () { return dimensions.radius + 'px'; },
            duration: 1,
            ease: 'none'
          });
          if (window.AuraLinkSectionLayout) window.AuraLinkSectionLayout.refresh();
        }

        function onDocked() {
          docked = true;
          startScroll();
        }
        radio.addEventListener('auralink:radio:docked', onDocked);
        const revealObserver = new MutationObserver(startScroll);
        revealObserver.observe(container, { attributes: true, attributeFilter: ['data-hero-reveal-complete'] });
        startScroll();

        function onLayout() { syncHeader(timeline ? timeline.progress() : 0); }
        window.addEventListener('auralink:layout', onLayout);
        return function () {
          window.removeEventListener('auralink:layout', onLayout);
          revealObserver.disconnect();
          radio.removeEventListener('auralink:radio:docked', onDocked);
          if (timeline) {
            timeline.scrollTrigger.kill();
            timeline.revert();
          }
          wrapper.classList.remove('has-scroll-framing');
          section.style.minHeight = originalMinHeight;
          if (header && document.querySelector('#MainContent > .shopify-section') === section) {
            header.classList.remove('hero-scroll-header');
            header.style.removeProperty('--hero-header-opacity');
          }
        };
      });
      wrapper._heroScrollDestroy = function () {
        match.revert();
        delete wrapper._heroScrollDestroy;
      };
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(document); });
  else init(document);
  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
  document.addEventListener('shopify:section:unload', function (event) {
    event.target.querySelectorAll('.auralink-hero-wrapper').forEach(function (wrapper) {
      if (wrapper._heroScrollDestroy) wrapper._heroScrollDestroy();
    });
  });
})();
