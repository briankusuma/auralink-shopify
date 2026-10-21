/* AuraLink hero framing. GSAP and ScrollTrigger are hosted in theme assets. */
(function () {
  'use strict';
  if (window.auralinkHeroScrollLoaded) return;
  window.auralinkHeroScrollLoaded = true;

  function init(scope) {
    if (!window.gsap || !window.ScrollTrigger || (window.Shopify && window.Shopify.designMode)) {
      scope.querySelectorAll('.has-scroll-framing').forEach(function (wrapper) {
        wrapper.classList.remove('has-scroll-framing');
      });
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

      match.add('(prefers-reduced-motion: no-preference)', function () {
        let timeline = null;
        let docked = Boolean(window.auralinkRadioDocked);
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
              scrub: 0.35,
              invalidateOnRefresh: true,
              onRefreshInit: measure
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
        }

        function onDocked() {
          docked = true;
          startScroll();
        }
        document.addEventListener('auralink:radio:docked', onDocked);
        const revealObserver = new MutationObserver(startScroll);
        revealObserver.observe(container, { attributes: true, attributeFilter: ['data-hero-reveal-complete'] });
        startScroll();

        return function () {
          revealObserver.disconnect();
          document.removeEventListener('auralink:radio:docked', onDocked);
          if (timeline) {
            timeline.scrollTrigger.kill();
            timeline.revert();
          }
          wrapper.classList.remove('has-scroll-framing');
          section.style.minHeight = originalMinHeight;
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
