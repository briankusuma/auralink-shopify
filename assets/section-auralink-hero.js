/**
 * AuraLink - Hero Section Liquid Wave Text Reveal Animation
 * Inspired by bleibtgleich.dev
 *
 * Implements an organic liquid wave / fluid ripple wipe effect on initial load:
 * - Mathematical sine-wave dynamic clip-path rising from bottom to top
 * - Organic turbulent displacement map warping the letter boundaries as the wave passes
 * - Smooth vertical emergence settling into razor-sharp typography
 * - Progressive enhancement & reduced motion support
 */

(function () {
  'use strict';

  function initHeroLiquidReveal() {
    const heroContainers = document.querySelectorAll('.auralink-hero-container');
    if (!heroContainers.length) return;

    heroContainers.forEach(function (container) {
      if (container.dataset.liquidInitialized === 'true') return;
      container.dataset.liquidInitialized = 'true';

      const sectionWrapper = container.closest('.section-auralink-hero') || container;
      const sectionId = container.id.replace('AuraLinkHero-', '');

      const leadEl = container.querySelector('.auralink-hero-lead');
      const contentEl = container.querySelector('.auralink-hero-content');
      const titleEl = container.querySelector('.auralink-hero-title');
      const subtitleEl = container.querySelector('.auralink-hero-subtitle');
      const ctaEl = container.querySelector('.auralink-hero-cta-btn');
      const tagsEl = container.querySelector('.auralink-hero-tags');

      if (!leadEl || !titleEl) return;

      const titleWavePath = document.getElementById('auralink-title-wave-path-' + sectionId);
      const subWavePath = document.getElementById('auralink-sub-wave-path-' + sectionId);
      const dispMap = document.getElementById('auralink-disp-' + sectionId);
      const turbulence = document.getElementById('auralink-turbulence-' + sectionId);

      // Accessibility: Respect reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        settleAnimation(true);
        return;
      }

      // Mark ready state (primes CSS transforms & initial clip-paths)
      leadEl.setAttribute('data-liquid-ready', 'true');
      if (contentEl) contentEl.setAttribute('data-liquid-ready', 'true');

      // Hook initial SVG clipPath & filter
      titleEl.style.clipPath = 'url(#auralink-title-wave-clip-' + sectionId + ')';
      titleEl.style.webkitClipPath = 'url(#auralink-title-wave-clip-' + sectionId + ')';
      titleEl.style.filter = 'url(#auralink-liquid-filter-' + sectionId + ')';

      if (subtitleEl && subWavePath) {
        subtitleEl.style.clipPath = 'url(#auralink-sub-wave-clip-' + sectionId + ')';
        subtitleEl.style.webkitClipPath = 'url(#auralink-sub-wave-clip-' + sectionId + ')';
        subtitleEl.style.filter = 'url(#auralink-liquid-filter-' + sectionId + ')';
      }

      function buildWavePath(level, phase, amplitude) {
        const points = 16;
        const step = 1 / points;
        const startY = (level + Math.sin(phase) * amplitude).toFixed(4);
        let d = 'M 0 1.25 L 0 ' + startY;

        for (let i = 1; i <= points; i++) {
          const x = i * step;
          // Fluid harmonic equation: primary wave + secondary turbulent overtone
          const wave = Math.sin(x * Math.PI * 4 + phase) * amplitude
                     + Math.cos(x * Math.PI * 6 - phase * 1.3) * (amplitude * 0.45);
          const y = Math.max(-0.25, Math.min(1.25, level + wave));
          d += ' L ' + x.toFixed(4) + ' ' + y.toFixed(4);
        }

        d += ' L 1 1.25 Z';
        return d;
      }

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function easeOutQuad(t) {
        return 1 - (1 - t) * (1 - t);
      }

      let animationStarted = false;
      let startTime = null;
      let frameId = null;

      const titleDuration = 1150; // ms
      const subDelay = 180;       // ms stagger for subtitle
      const subDuration = 950;    // ms
      const ctaDelay = 420;       // ms stagger for CTA & tags
      const totalDuration = Math.max(titleDuration, subDelay + subDuration) + 100;

      function startLiquidAnimation() {
        if (animationStarted) return;
        animationStarted = true;

        leadEl.setAttribute('data-liquid-animating', 'true');

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;

          // 1. Heading Wave Animation
          const titleProgress = Math.min(1, Math.max(0, elapsed / titleDuration));
          const titleEased = easeOutCubic(titleProgress);

          // Liquid water level rises from 1.18 (below) to -0.18 (above)
          const titleLevel = 1.18 - 1.36 * titleEased;
          const titlePhase = titleProgress * 20.0;
          // Amplitude swells around the crest then dampens as it clears
          const titleAmp = (Math.sin(titleProgress * Math.PI) * 0.065 + 0.015);

          if (titleWavePath) {
            titleWavePath.setAttribute('d', buildWavePath(titleLevel, titlePhase, titleAmp));
          }

          // Liquid rising translateY: 32px -> 0px
          const titleY = (32 * (1 - titleEased)).toFixed(2);
          titleEl.style.transform = 'translateY(' + titleY + 'px)';

          // 2. Subtitle Wave Animation (staggered)
          if (subtitleEl && subWavePath) {
            const subElapsed = elapsed - subDelay;
            if (subElapsed > 0) {
              const subProgress = Math.min(1, Math.max(0, subElapsed / subDuration));
              const subEased = easeOutCubic(subProgress);

              const subLevel = 1.18 - 1.36 * subEased;
              const subPhase = subProgress * 18.0 + 2.0;
              const subAmp = (Math.sin(subProgress * Math.PI) * 0.05 + 0.012);

              subWavePath.setAttribute('d', buildWavePath(subLevel, subPhase, subAmp));

              const subY = (22 * (1 - subEased)).toFixed(2);
              subtitleEl.style.transform = 'translateY(' + subY + 'px)';
            }
          }

          // 3. Fluid Displacement Map scale (liquid turbulence)
          if (dispMap) {
            // Turbulence peaks when wave surges over text body
            const peakProgress = Math.max(0, Math.min(1, elapsed / 800));
            const currentScale = Math.sin(peakProgress * Math.PI) * 22;
            dispMap.setAttribute('scale', currentScale.toFixed(1));
          }

          // 4. Staggered CTA & Badges Reveal
          if (elapsed >= ctaDelay) {
            if (ctaEl && !ctaEl.style.opacity) {
              ctaEl.style.opacity = '1';
              ctaEl.style.transform = 'translateY(0)';
            }
            if (tagsEl && !tagsEl.style.opacity) {
              tagsEl.style.opacity = '1';
              tagsEl.style.transform = 'translateY(0)';
            }
          }

          if (elapsed < totalDuration) {
            frameId = requestAnimationFrame(animate);
          } else {
            settleAnimation(false);
          }
        }

        frameId = requestAnimationFrame(animate);
      }

      function settleAnimation(immediate) {
        if (frameId) cancelAnimationFrame(frameId);

        leadEl.removeAttribute('data-liquid-animating');
        leadEl.setAttribute('data-liquid-done', 'true');
        if (contentEl) contentEl.setAttribute('data-liquid-done', 'true');

        // Completely clean up clip-path and filter so text is 100% native DOM crisp
        titleEl.style.clipPath = 'none';
        titleEl.style.webkitClipPath = 'none';
        titleEl.style.filter = 'none';
        titleEl.style.transform = '';
        titleEl.style.opacity = '1';

        if (subtitleEl) {
          subtitleEl.style.clipPath = 'none';
          subtitleEl.style.webkitClipPath = 'none';
          subtitleEl.style.filter = 'none';
          subtitleEl.style.transform = '';
          subtitleEl.style.opacity = '1';
        }

        if (ctaEl) {
          ctaEl.style.opacity = '1';
          ctaEl.style.transform = '';
        }

        if (tagsEl) {
          tagsEl.style.opacity = '1';
          tagsEl.style.transform = '';
        }

        if (dispMap) {
          dispMap.setAttribute('scale', '0');
        }
      }

      // Check if loading screen is active on first load
      const loadingScreen = document.getElementById('AuraLoadingScreen');
      const isScreenActive = Boolean(
        loadingScreen &&
        !loadingScreen.classList.contains('loading-screen--done') &&
        !window.auralinkLoadingDone
      );

      if (isScreenActive) {
        // Wait until loading screen reaches 100% and dismisses
        const onLoadingDone = function () {
          document.removeEventListener('auralink:loading:done', onLoadingDone);
          // Micro-delay for cinematic transition as loading overlay lifts
          setTimeout(startLiquidAnimation, 80);
        };
        document.addEventListener('auralink:loading:done', onLoadingDone);

        // Fallback safety in case loading screen event takes too long
        setTimeout(function () {
          if (!animationStarted) startLiquidAnimation();
        }, 3200);
      } else {
        // No active loading screen: trigger when hero is in viewport or interactive
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            function (entries) {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                startLiquidAnimation();
              }
            },
            { threshold: 0.15 }
          );
          observer.observe(container);
        } else {
          startLiquidAnimation();
        }
      }

      // Fallback guarantee: never leave text hidden
      setTimeout(function () {
        if (!leadEl.getAttribute('data-liquid-done')) {
          settleAnimation(true);
        }
      }, totalDuration + 4000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroLiquidReveal);
  } else {
    initHeroLiquidReveal();
  }

  // Shopify Theme Editor support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      if (e.target.classList.contains('section-auralink-hero')) {
        initHeroLiquidReveal();
      }
    });
  }
})();
