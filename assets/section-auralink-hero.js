/**
 * AuraLink - Hero Section Liquid Wave Text Reveal & Interactive Hover Ripple
 * Inspired by bleibtgleich.dev
 *
 * Features:
 * 1. Initial Load: Organic liquid wave wipe reveal rising from bottom to top
 * 2. Interactive Hover: Moving the cursor over the text wrap & CTA button stimulates
 *    fluid water ripples with smooth velocity-reactive displacement & wave motion.
 * 3. Smooth Damping: Ripples settle gracefully into resting crisp typography on mouse leave.
 * 4. Progressive enhancement & reduced motion support.
 */

(function () {
  'use strict';

  function initHeroLiquidSection() {
    const heroContainers = document.querySelectorAll('.auralink-hero-container');
    if (!heroContainers.length) return;

    heroContainers.forEach(function (container) {
      if (container.dataset.liquidInitialized === 'true') return;
      container.dataset.liquidInitialized = 'true';

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
        settleFirstLoadAnimation(true);
        return;
      }

      // Mark ready state (primes CSS transforms & initial clip-paths)
      leadEl.setAttribute('data-liquid-ready', 'true');
      if (contentEl) contentEl.setAttribute('data-liquid-ready', 'true');

      // Hook initial SVG clipPath & filter for the reveal
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

      let firstLoadStarted = false;
      let startTime = null;
      let frameId = null;

      const titleDuration = 1150; // ms
      const subDelay = 180;       // ms stagger for subtitle
      const subDuration = 950;    // ms
      const ctaDelay = 420;       // ms stagger for CTA & tags
      const totalDuration = Math.max(titleDuration, subDelay + subDuration) + 100;

      function startFirstLoadAnimation() {
        if (firstLoadStarted) return;
        firstLoadStarted = true;

        leadEl.setAttribute('data-liquid-animating', 'true');

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;

          // 1. Heading Wave Reveal Animation
          const titleProgress = Math.min(1, Math.max(0, elapsed / titleDuration));
          const titleEased = easeOutCubic(titleProgress);

          // Liquid water level rises from 1.18 (below) to -0.18 (above)
          const titleLevel = 1.18 - 1.36 * titleEased;
          const titlePhase = titleProgress * 20.0;
          const titleAmp = Math.sin(titleProgress * Math.PI) * 0.065 + 0.015;

          if (titleWavePath) {
            titleWavePath.setAttribute('d', buildWavePath(titleLevel, titlePhase, titleAmp));
          }

          // Liquid rising translateY: 32px -> 0px
          const titleY = (32 * (1 - titleEased)).toFixed(2);
          titleEl.style.transform = 'translateY(' + titleY + 'px)';

          // 2. Subtitle Wave Reveal Animation (staggered)
          if (subtitleEl && subWavePath) {
            const subElapsed = elapsed - subDelay;
            if (subElapsed > 0) {
              const subProgress = Math.min(1, Math.max(0, subElapsed / subDuration));
              const subEased = easeOutCubic(subProgress);

              const subLevel = 1.18 - 1.36 * subEased;
              const subPhase = subProgress * 18.0 + 2.0;
              const subAmp = Math.sin(subProgress * Math.PI) * 0.05 + 0.012;

              subWavePath.setAttribute('d', buildWavePath(subLevel, subPhase, subAmp));

              const subY = (22 * (1 - subEased)).toFixed(2);
              subtitleEl.style.transform = 'translateY(' + subY + 'px)';
            }
          }

          // 3. Fluid Displacement Map scale (liquid turbulence)
          if (dispMap) {
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
            settleFirstLoadAnimation(false);
          }
        }

        frameId = requestAnimationFrame(animate);
      }

      function settleFirstLoadAnimation(immediate) {
        if (frameId) cancelAnimationFrame(frameId);

        leadEl.removeAttribute('data-liquid-animating');
        leadEl.setAttribute('data-liquid-done', 'true');
        if (contentEl) contentEl.setAttribute('data-liquid-done', 'true');

        // Clean up reveal clip-paths so text is razor-sharp
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

        // Initialize Interactive Hover Ripple on text wrap and button
        setupInteractiveHoverRipple(leadEl, ctaEl, dispMap, turbulence, sectionId);
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
          setTimeout(startFirstLoadAnimation, 80);
        };
        document.addEventListener('auralink:loading:done', onLoadingDone);

        setTimeout(function () {
          if (!firstLoadStarted) startFirstLoadAnimation();
        }, 3200);
      } else {
        // Trigger via IntersectionObserver or immediate frame
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            function (entries) {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                startFirstLoadAnimation();
              }
            },
            { threshold: 0.15 }
          );
          observer.observe(container);
        } else {
          startFirstLoadAnimation();
        }
      }

      // Fallback guarantee: never leave text hidden
      setTimeout(function () {
        if (!leadEl.getAttribute('data-liquid-done')) {
          settleFirstLoadAnimation(true);
        }
      }, totalDuration + 4000);
    });
  }

  // =========================================================================
  // Interactive Water Ripple on Mouse Hover (Wrap Text & Button)
  // =========================================================================
  function setupInteractiveHoverRipple(leadEl, ctaEl, dispMap, turbulence, sectionId) {
    if (!leadEl || !dispMap || !turbulence) return;
    if (leadEl.dataset.hoverRippleInitialized === 'true') return;
    leadEl.dataset.hoverRippleInitialized = 'true';

    // Only apply on fine pointer devices (desktop mouse/trackpad)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    let isHovering = false;
    let targetScale = 0;
    let currentScale = 0;
    let targetWaveX = 0;
    let targetWaveY = 0;
    let currentWaveX = 0;
    let currentWaveY = 0;
    let lastMouseX = null;
    let lastMouseY = null;
    let lastTime = performance.now();
    let mouseVelocity = 0;
    let hoverFrameId = null;
    let phase = 0;
    let normX = 0.5;
    let normY = 0.5;

    function onPointerEnter(e) {
      isHovering = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastTime = performance.now();
      targetScale = 7.0; // Initial gentle water ripple onset
      leadEl.setAttribute('data-liquid-hover', 'true');
      leadEl.style.filter = 'url(#auralink-liquid-filter-' + sectionId + ')';

      if (!hoverFrameId) {
        hoverFrameId = requestAnimationFrame(updateHoverRipple);
      }
    }

    function onPointerMove(e) {
      if (!isHovering) {
        onPointerEnter(e);
      }

      const rect = leadEl.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      normX = rect.width > 0 ? x / rect.width : 0.5;
      normY = rect.height > 0 ? y / rect.height : 0.5;

      // Calculate cursor speed to dynamically surge water waves
      const now = performance.now();
      const dt = Math.max(16, now - lastTime);
      if (lastMouseX !== null && lastMouseY !== null) {
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
        const speed = dist / dt; // px per ms
        mouseVelocity = Math.min(2.2, mouseVelocity * 0.65 + speed * 0.35);
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastTime = now;

      // Ripple scale scales organically with cursor velocity (5px floor up to 16px crest)
      targetScale = Math.min(16, 5.5 + mouseVelocity * 8.5);

      // Subtle undulating directional water tilt
      targetWaveX = (normX - 0.5) * 5.0;
      targetWaveY = (normY - 0.5) * 3.5;

      leadEl.style.setProperty('--mouse-norm-x', normX.toFixed(3));
      leadEl.style.setProperty('--mouse-norm-y', normY.toFixed(3));
    }

    function onPointerLeave() {
      isHovering = false;
      targetScale = 0;
      targetWaveX = 0;
      targetWaveY = 0;
      mouseVelocity = 0;
      lastMouseX = null;
      lastMouseY = null;
    }

    function updateHoverRipple(timestamp) {
      // Smooth exponential easing for organic water physics
      const lerpRate = isHovering ? 0.12 : 0.08;
      currentScale += (targetScale - currentScale) * lerpRate;
      currentWaveX += (targetWaveX - currentWaveX) * 0.09;
      currentWaveY += (targetWaveY - currentWaveY) * 0.09;

      // Gradually decay velocity when mouse is hovering but stationary
      if (isHovering) {
        mouseVelocity *= 0.90;
        targetScale = Math.max(4.5, targetScale * 0.96);
      }

      phase += 0.045 + currentScale * 0.003;

      if (currentScale > 0.06) {
        dispMap.setAttribute('scale', currentScale.toFixed(2));

        // Organic turbulence baseFrequency shift responding to cursor & time
        const fx = (0.016 + Math.sin(phase + normX * Math.PI) * 0.005).toFixed(4);
        const fy = (0.034 + Math.cos(phase * 0.8 + normY * Math.PI) * 0.007).toFixed(4);
        turbulence.setAttribute('baseFrequency', fx + ' ' + fy);

        // Fluid undulating micro-translation
        leadEl.style.setProperty('--ripple-wave-x', currentWaveX.toFixed(2) + 'px');
        leadEl.style.setProperty('--ripple-wave-y', currentWaveY.toFixed(2) + 'px');

        hoverFrameId = requestAnimationFrame(updateHoverRipple);
      } else {
        // Calm resting state: restore 100% crisp typography
        currentScale = 0;
        dispMap.setAttribute('scale', '0');
        leadEl.style.filter = 'none';
        leadEl.removeAttribute('data-liquid-hover');
        leadEl.style.setProperty('--ripple-wave-x', '0px');
        leadEl.style.setProperty('--ripple-wave-y', '0px');
        hoverFrameId = null;
      }
    }

    leadEl.addEventListener('pointerenter', onPointerEnter, { passive: true });
    leadEl.addEventListener('pointermove', onPointerMove, { passive: true });
    leadEl.addEventListener('pointerleave', onPointerLeave, { passive: true });

    // Track button-specific cursor ripple sheen
    if (ctaEl) {
      ctaEl.addEventListener('pointermove', function (e) {
        const btnRect = ctaEl.getBoundingClientRect();
        const bx = ((e.clientX - btnRect.left) / btnRect.width) * 100;
        const by = ((e.clientY - btnRect.top) / btnRect.height) * 100;
        ctaEl.style.setProperty('--cta-mouse-x', bx.toFixed(1) + '%');
        ctaEl.style.setProperty('--cta-mouse-y', by.toFixed(1) + '%');
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroLiquidSection);
  } else {
    initHeroLiquidSection();
  }

  // Shopify Theme Editor support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      if (e.target.classList.contains('section-auralink-hero')) {
        initHeroLiquidSection();
      }
    });
  }
})();
