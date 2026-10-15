/**
 * AuraLink - Hero Section Water Droplet Text Coalescence & Radial Cursor Ripple
 *
 * Mechanics:
 * 1. Initial Load: Each letter emerges like an organic water droplet (bercak air)
 *    splashing and condensing into its crisp letterform with surface-tension wobble.
 * 2. Interactive Hover: Starts from one cursor point (titik kursor) and radiates
 *    concentric water waves outward across subsequent letters with distance-based delays.
 * 3. Progressive enhancement & accessibility support (screen readers, reduced motion).
 */

(function () {
  'use strict';

  function initHeroDropletSection() {
    const heroContainers = document.querySelectorAll('.auralink-hero-container');
    if (!heroContainers.length) return;

    heroContainers.forEach(function (container) {
      if (container.dataset.dropletInitialized === 'true') return;
      container.dataset.dropletInitialized = 'true';

      const leadEl = container.querySelector('.auralink-hero-lead');
      const contentEl = container.querySelector('.auralink-hero-content');
      const titleEl = container.querySelector('.auralink-hero-title');
      const subtitleEl = container.querySelector('.auralink-hero-subtitle');
      const ctaEl = container.querySelector('.auralink-hero-cta-btn');
      const tagsEl = container.querySelector('.auralink-hero-tags');

      if (!leadEl || !titleEl) return;

      // 1. Split text into words and individual characters (preserving <br> tags & semantic a11y)
      const titleChars = splitTextIntoChars(titleEl);
      const subtitleChars = subtitleEl ? splitTextIntoChars(subtitleEl) : [];
      const allChars = titleChars.concat(subtitleChars);

      // Accessibility: Respect reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        settleAnimation(true);
        return;
      }

      // Mark initial state: letters primed as submerged droplets
      leadEl.setAttribute('data-liquid-ready', 'true');
      if (contentEl) contentEl.setAttribute('data-liquid-ready', 'true');

      let revealStarted = false;

      function startDropletReveal() {
        if (revealStarted) return;
        revealStarted = true;

        // Cascade heading droplets (bercak air forming letters)
        titleChars.forEach(function (charSpan, idx) {
          const delayMs = idx * 24;
          charSpan.style.setProperty('--char-delay', delayMs + 'ms');
          charSpan.classList.add('char--droplet-coalesce');
        });

        // Cascade subtitle droplets with slight stagger
        const subBaseDelay = 280;
        subtitleChars.forEach(function (charSpan, idx) {
          const delayMs = subBaseDelay + idx * 10;
          charSpan.style.setProperty('--char-delay', delayMs + 'ms');
          charSpan.classList.add('char--droplet-coalesce');
        });

        // CTA button & tags fade in smoothly with lift
        const ctaDelay = Math.max(550, titleChars.length * 20);
        setTimeout(function () {
          if (ctaEl) {
            ctaEl.style.opacity = '1';
            ctaEl.style.transform = 'translateY(0)';
          }
          if (tagsEl) {
            tagsEl.style.opacity = '1';
            tagsEl.style.transform = 'translateY(0)';
          }
        }, ctaDelay);

        // Calculate total reveal completion time
        const totalDuration = Math.max(
          titleChars.length * 24 + 850,
          subBaseDelay + subtitleChars.length * 10 + 850
        );

        setTimeout(function () {
          settleAnimation(false);
        }, totalDuration);
      }

      function settleAnimation(immediate) {
        leadEl.removeAttribute('data-liquid-ready');
        leadEl.setAttribute('data-liquid-done', 'true');
        if (contentEl) contentEl.setAttribute('data-liquid-done', 'true');

        allChars.forEach(function (span) {
          span.classList.remove('char--droplet-coalesce');
          span.style.removeProperty('--char-delay');
          span.style.opacity = '1';
          span.style.transform = '';
          span.style.filter = '';
        });

        if (ctaEl) {
          ctaEl.style.opacity = '1';
          ctaEl.style.transform = '';
        }
        if (tagsEl) {
          tagsEl.style.opacity = '1';
          tagsEl.style.transform = '';
        }

        // Initialize radial cursor water ripples
        setupRadialHoverRipples(leadEl, allChars, ctaEl);
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
          setTimeout(startDropletReveal, 60);
        };
        document.addEventListener('auralink:loading:done', onLoadingDone);

        setTimeout(function () {
          if (!revealStarted) startDropletReveal();
        }, 3200);
      } else {
        // Trigger via IntersectionObserver or immediate frame
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            function (entries) {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                startDropletReveal();
              }
            },
            { threshold: 0.15 }
          );
          observer.observe(container);
        } else {
          startDropletReveal();
        }
      }

      // Fallback guarantee: never leave text hidden
      setTimeout(function () {
        if (!leadEl.getAttribute('data-liquid-done')) {
          settleAnimation(true);
        }
      }, 4500);
    });
  }

  // =========================================================================
  // Text Splitting Helper: preserves words (<span class="auralink-word">)
  // and splits characters (<span class="auralink-char">) while respecting <br>
  // =========================================================================
  function splitTextIntoChars(element) {
    if (!element || element.dataset.charsSplit === 'true') {
      return Array.from(element.querySelectorAll('.auralink-char'));
    }
    element.dataset.charsSplit = 'true';

    // Set accessible label for screen readers
    const originalText = element.textContent.trim();
    element.setAttribute('aria-label', originalText);

    const childNodes = Array.from(element.childNodes);
    element.innerHTML = '';

    const charSpans = [];

    childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        // Split by whitespace chunks to keep words intact
        const tokens = text.split(/(\s+)/);

        tokens.forEach(function (token) {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            element.appendChild(document.createTextNode(token));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'auralink-word';
            wordSpan.setAttribute('aria-hidden', 'true');

            for (let i = 0; i < token.length; i++) {
              const charSpan = document.createElement('span');
              charSpan.className = 'auralink-char';
              charSpan.textContent = token[i];
              wordSpan.appendChild(charSpan);
              charSpans.push(charSpan);
            }
            element.appendChild(wordSpan);
          }
        });
      } else if (node.nodeName === 'BR') {
        element.appendChild(document.createElement('br'));
      } else {
        element.appendChild(node.cloneNode(true));
      }
    });

    return charSpans;
  }

  // =========================================================================
  // Radial Concentric Water Ripple on Hover
  // (Starts from one cursor point & cascades outwards to subsequent letters)
  // =========================================================================
  function setupRadialHoverRipples(leadEl, charSpans, ctaEl) {
    if (!leadEl || !charSpans.length) return;
    if (leadEl.dataset.radialHoverActive === 'true') return;
    leadEl.dataset.radialHoverActive = 'true';

    // Only apply on fine pointer devices (desktop mouse/trackpad)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    let charPositions = [];

    function cachePositions() {
      charPositions = charSpans.map(function (span) {
        const rect = span.getBoundingClientRect();
        return {
          span: span,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          busy: false
        };
      });
    }

    cachePositions();

    window.addEventListener('resize', cachePositions, { passive: true });
    window.addEventListener('scroll', cachePositions, { passive: true });

    let lastMoveTime = 0;
    const maxRadius = 260; // Max ripple radius in px
    const waveSpeed = 0.72; // Wave propagation speed in px/ms

    function onPointerMove(e) {
      const now = performance.now();
      // Throttle ripple trigger frequency to ~40fps for optimal fluid sensation
      if (now - lastMoveTime < 24) return;
      lastMoveTime = now;

      const curX = e.clientX;
      const curY = e.clientY;

      // 1. Radiate water ripple to all characters from the cursor point
      for (let i = 0; i < charPositions.length; i++) {
        const item = charPositions[i];
        const dx = item.cx - curX;
        const dy = item.cy - curY;
        const dist = Math.hypot(dx, dy);

        if (dist <= maxRadius && !item.busy) {
          // Time delay proportional to distance: concentric ripple propagation
          const delayMs = dist / waveSpeed;
          const factor = Math.pow(1 - dist / maxRadius, 1.35);

          item.busy = true;
          triggerCharRipple(item, dx, dy, dist, factor, delayMs);
        }
      }

      // 2. Radiate water ripple to CTA button if nearby
      if (ctaEl) {
        const btnRect = ctaEl.getBoundingClientRect();
        const btnCx = btnRect.left + btnRect.width / 2;
        const btnCy = btnRect.top + btnRect.height / 2;
        const btnDist = Math.hypot(btnCx - curX, btnCy - curY);

        // Update button ripple sheen origin
        const bx = ((curX - btnRect.left) / btnRect.width) * 100;
        const by = ((curY - btnRect.top) / btnRect.height) * 100;
        ctaEl.style.setProperty('--cta-mouse-x', bx.toFixed(1) + '%');
        ctaEl.style.setProperty('--cta-mouse-y', by.toFixed(1) + '%');

        if (btnDist <= maxRadius && !ctaEl.dataset.rippleBusy) {
          ctaEl.dataset.rippleBusy = 'true';
          const btnDelay = btnDist / waveSpeed;
          const btnFactor = Math.pow(1 - btnDist / maxRadius, 1.2);

          setTimeout(function () {
            ctaEl.classList.remove('cta--wave-calm');
            ctaEl.classList.add('cta--wave-hit');

            const pushX = ((btnCx - curX) / (btnDist || 1)) * 3 * btnFactor;
            const pushY = -3.5 * btnFactor;
            ctaEl.style.setProperty('--btn-wave-x', pushX.toFixed(2) + 'px');
            ctaEl.style.setProperty('--btn-wave-y', pushY.toFixed(2) + 'px');
            ctaEl.style.setProperty('--btn-scale', (1 + 0.03 * btnFactor).toFixed(3));

            setTimeout(function () {
              ctaEl.classList.remove('cta--wave-hit');
              ctaEl.classList.add('cta--wave-calm');
              setTimeout(function () {
                ctaEl.classList.remove('cta--wave-calm');
                delete ctaEl.dataset.rippleBusy;
              }, 550);
            }, 140);
          }, btnDelay);
        }
      }
    }

    function triggerCharRipple(item, dx, dy, dist, factor, delayMs) {
      setTimeout(function () {
        const span = item.span;

        // Fluid directional splash away from cursor center
        const normX = dx / (dist || 1);
        const normY = dy / (dist || 1);
        const pushX = normX * 5.0 * factor;
        const liftY = -6.5 * factor + (normY * 2.5 * factor);
        const scale = 1 + 0.16 * factor;

        span.style.setProperty('--wave-x', pushX.toFixed(2) + 'px');
        span.style.setProperty('--wave-y', liftY.toFixed(2) + 'px');
        span.style.setProperty('--wave-scale', scale.toFixed(3));

        span.classList.remove('char--wave-calm');
        span.classList.add('char--wave-hit');

        // Settle back to resting state with liquid elastic ease
        setTimeout(function () {
          span.classList.remove('char--wave-hit');
          span.classList.add('char--wave-calm');

          setTimeout(function () {
            span.classList.remove('char--wave-calm');
            span.style.removeProperty('--wave-x');
            span.style.removeProperty('--wave-y');
            span.style.removeProperty('--wave-scale');
            item.busy = false;
          }, 550);
        }, 130);
      }, delayMs);
    }

    leadEl.addEventListener('pointerenter', function () {
      cachePositions();
    }, { passive: true });

    leadEl.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroDropletSection);
  } else {
    initHeroDropletSection();
  }

  // Shopify Theme Editor support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      if (e.target.classList.contains('section-auralink-hero')) {
        initHeroDropletSection();
      }
    });
  }
})();
