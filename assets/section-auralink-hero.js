/**
 * AuraLink - Hero Section Liquid Goo Text Reveal
 * 100% Exact Replication of bleibtgleich.dev `animateTextReveal()`
 *
 * SVG Gooey / Metaball Filter technique:
 * - Letters start as melted liquid blobs / mercury droplets that merge together
 *   using <feGaussianBlur> (stdDeviation: 50) and high-contrast <feColorMatrix> (alpha threshold: 20 -8).
 * - The blur animates down to 0 with cubic-bezier(0.25, 1, 0.5, 1) ease, causing the liquid
 *   blobs to condense, solidify, and resolve into razor-sharp typography.
 * - In the final 35% of the duration, the color matrix alpha threshold interpolates back
 *   from 20 -8 to 1 0.
 * - Finally, the filter is completely detached (filter: "") so the text remains
 *   100% sharp, crisp, and selectable.
 */

(function () {
  'use strict';

  // Exact cubic-bezier(0.25, 1, 0.5, 1) solver (matches bleibtgleich.dev easeOut)
  function createBezier(x1, y1, x2, y2) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    function sampleCurveX(t) { return ((ax * t + bx) * t + cx) * t; }
    function sampleCurveY(t) { return ((ay * t + by) * t + cy) * t; }
    function sampleCurveDerivativeX(t) { return (3 * ax * t + 2 * bx) * t + cx; }

    function solveCurveX(x) {
      let t2 = x;
      for (let i = 0; i < 8; i++) {
        const x2 = sampleCurveX(t2) - x;
        if (Math.abs(x2) < 1e-4) return t2;
        const d2 = sampleCurveDerivativeX(t2);
        if (Math.abs(d2) < 1e-4) break;
        t2 -= x2 / d2;
      }
      return t2;
    }

    return function (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return sampleCurveY(solveCurveX(t));
    };
  }

  const easeOut = createBezier(0.25, 1, 0.5, 1);

  // SVG namespace & helper from bleibtgleich.dev
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const DUR_L = 1200; // 1.2s (bleibtgleich.dev var(--dur-l))
  const STAGGER = 90; // 0.09s stagger between lines
  const MATRIX_VALUES = function (amp, off) {
    return '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + amp + ' ' + off;
  };

  // Ensure persistent SVG filter defs container in DOM (o() in bleibtgleich.dev)
  function getGooDefsSvg() {
    let svg = document.getElementById('goo-defs');
    if (!svg) {
      svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('id', 'goo-defs');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
      document.body.prepend(svg);
    }
    return svg;
  }

  // Attach individual gooey SVG filter to an element (i(e) in bleibtgleich.dev)
  function attachGooFilter(el, initialStdDev) {
    if (el.dataset.filterId) return el.dataset.filterId;
    const filterId = 'goo-' + Math.random().toString(36).substr(2, 9);
    el.dataset.filterId = filterId;

    const svg = getGooDefsSvg();
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-25%');
    filter.setAttribute('y', '-25%');
    filter.setAttribute('width', '150%');
    filter.setAttribute('height', '150%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    const s = typeof initialStdDev === 'number' ? initialStdDev : 50;
    const l = 20;
    const c = -8;

    filter.innerHTML =
      '<feGaussianBlur in="SourceGraphic" stdDeviation="' + s + '" result="blur"></feGaussianBlur>' +
      '<feColorMatrix in="blur" mode="matrix" values="' + MATRIX_VALUES(l, c) + '" result="goo"></feColorMatrix>';

    svg.appendChild(filter);
    el.style.filter = 'url(#' + filterId + ')';
    return filterId;
  }

  // Exact replication of animateTextReveal() timeline execution from bleibtgleich.dev
  function runTextRevealAnimation(lineElements, baseStdDev, delayOffset) {
    const startDelay = typeof delayOffset === 'number' ? delayOffset : 0;

    lineElements.forEach(function (lineEl, lineIndex) {
      const filterId = attachGooFilter(lineEl, baseStdDev);
      const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
      const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');

      // Set initial state matching case "initial"
      if (feBlur) feBlur.setAttribute('stdDeviation', baseStdDev);
      if (feMatrix) feMatrix.setAttribute('values', MATRIX_VALUES(20, -8));
      lineEl.style.filter = 'url(#' + filterId + ')';
      lineEl.style.visibility = 'visible';

      const lineDelay = startDelay + (lineIndex * STAGGER);
      let startTime = null;

      function renderFrame(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        if (elapsed < lineDelay) {
          requestAnimationFrame(renderFrame);
          return;
        }

        const t = Math.min((elapsed - lineDelay) / DUR_L, 1);
        const easedProgress = easeOut(t);

        // 1. feGaussianBlur stdDeviation: baseStdDev -> 0 with ease: Out
        const currentStdDev = Math.max(0, baseStdDev * (1 - easedProgress));
        if (feBlur) {
          feBlur.setAttribute('stdDeviation', currentStdDev.toFixed(2));
        }

        // 2. feColorMatrix alpha threshold: amp: 20 -> 1, off: -8 -> 0 in last 35% of duration
        // (matches: t.to(g, {amp: 1, off: 0, duration: 0.35 * durL, ease: "none"}, ">-" + 0.35 * durL))
        const matrixThreshold = 0.65; // Starts at 65% of durL
        if (t >= matrixThreshold) {
          const matrixT = Math.min((t - matrixThreshold) / (1 - matrixThreshold), 1);
          const currentAmp = 20 + (1 - 20) * matrixT;
          const currentOff = -8 + (0 - -8) * matrixT;

          if (feMatrix) {
            feMatrix.setAttribute(
              'values',
              MATRIX_VALUES(currentAmp.toFixed(2), currentOff.toFixed(2))
            );
          }
        }

        if (t < 1) {
          requestAnimationFrame(renderFrame);
        } else {
          // OnComplete: matrix is reset to 1 0, filter is detached so text is 100% crisp & selectable
          if (feMatrix) {
            feMatrix.setAttribute('values', MATRIX_VALUES(1, 0));
          }
          lineEl.style.filter = '';
        }
      }

      requestAnimationFrame(renderFrame);
    });
  }

  // Exact replication of animateDivReveal() / data-reveal="fade" from bleibtgleich.dev
  function runFadeRevealAnimation(fadeElements, delayOffset) {
    const startDelay = typeof delayOffset === 'number' ? delayOffset : 350;

    fadeElements.forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.filter = 'blur(20px)';
      el.style.visibility = 'visible';

      const delay = startDelay + (idx * 100);
      const duration = 1000;
      let startTime = null;

      function renderFrame(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        if (elapsed < delay) {
          requestAnimationFrame(renderFrame);
          return;
        }

        const t = Math.min((elapsed - delay) / duration, 1);
        const eased = easeOut(t);

        el.style.opacity = (eased).toFixed(3);
        el.style.filter = 'blur(' + ((1 - eased) * 20).toFixed(2) + 'px)';

        if (t < 1) {
          requestAnimationFrame(renderFrame);
        } else {
          el.style.opacity = '1';
          el.style.filter = '';
        }
      }

      requestAnimationFrame(renderFrame);
    });
  }

  // Split text into line elements (preserving words & <br>)
  function splitTextLines(el) {
    if (!el || el.dataset.splitDone === 'true') {
      return Array.from(el.querySelectorAll('.split-line-h1, .split-line'));
    }
    el.dataset.splitDone = 'true';

    const originalText = el.textContent.trim();
    el.setAttribute('aria-label', originalText);

    // Group child nodes into lines by <BR>
    const lineBuckets = [[]];
    Array.from(el.childNodes).forEach(function (node) {
      if (node.nodeName === 'BR') {
        lineBuckets.push([]);
      } else {
        lineBuckets[lineBuckets.length - 1].push(node);
      }
    });

    el.innerHTML = '';
    const lineElements = [];
    const isHeading = el.classList.contains('auralink-hero-title');

    lineBuckets.forEach(function (bucket) {
      if (!bucket.length) return;

      const maskWrap = document.createElement('span');
      maskWrap.className = isHeading ? 'split-line-h1-mask' : 'split-line-mask';
      maskWrap.setAttribute('aria-hidden', 'true');

      const lineSpan = document.createElement('span');
      lineSpan.className = isHeading ? 'split-line-h1' : 'split-line';
      lineSpan.setAttribute('aria-hidden', 'true');

      bucket.forEach(function (node) {
        lineSpan.appendChild(node.cloneNode(true));
      });

      maskWrap.appendChild(lineSpan);
      el.appendChild(maskWrap);
      lineElements.push(lineSpan);
    });

    return lineElements;
  }

  // =========================================================================
  // Master Hero Section Orchestration
  // =========================================================================
  function initHeroGooeySection() {
    const heroContainers = document.querySelectorAll('.auralink-hero-container');
    if (!heroContainers.length) return;

    heroContainers.forEach(function (container) {
      if (container.dataset.bleibtGooInitialized === 'true') return;
      container.dataset.bleibtGooInitialized = 'true';

      const titleEl = container.querySelector('.auralink-hero-title[data-reveal="text"]');
      const subtitleEl = container.querySelector('.auralink-hero-subtitle[data-reveal="text"]');
      const fadeElements = Array.from(container.querySelectorAll('[data-reveal="fade"]'));

      if (!titleEl) return;

      // Split text into lines
      const titleLines = splitTextLines(titleEl);
      const subtitleLines = subtitleEl ? splitTextLines(subtitleEl) : [];

      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        container.querySelectorAll('[data-reveal]').forEach(function (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.filter = '';
        });
        return;
      }

      // Pre-attach SVG filters in initial state (melted mercury droplets)
      titleLines.forEach(function (line) {
        attachGooFilter(line, 48);
      });
      subtitleLines.forEach(function (line) {
        attachGooFilter(line, 24);
      });

      let revealTriggered = false;

      function triggerHeroReveal() {
        if (revealTriggered) return;
        revealTriggered = true;

        // Make elements visible & start gooey coalescence
        if (titleEl) titleEl.style.visibility = 'visible';
        if (subtitleEl) subtitleEl.style.visibility = 'visible';

        // 1. Run title text reveal (initial blur 48 -> mercury drops merge & condense into letters)
        runTextRevealAnimation(titleLines, 48, 50);

        // 2. Run subtitle text reveal (initial blur 24, staggered right after title)
        const subDelay = Math.max(280, titleLines.length * STAGGER + 120);
        runTextRevealAnimation(subtitleLines, 24, subDelay);

        // 3. Run fade reveal for CTA button & badges
        const fadeDelay = subDelay + (subtitleLines.length * STAGGER) + 80;
        runFadeRevealAnimation(fadeElements, fadeDelay);
      }

      // Sync with theme loading screen if present
      const loadingScreen = document.getElementById('AuraLoadingScreen');
      const isLoadingActive = Boolean(
        loadingScreen &&
        !loadingScreen.classList.contains('loading-screen--done') &&
        !window.auralinkLoadingDone
      );

      if (isLoadingActive) {
        const onLoadingDone = function () {
          document.removeEventListener('auralink:loading:done', onLoadingDone);
          setTimeout(triggerHeroReveal, 80);
        };
        document.addEventListener('auralink:loading:done', onLoadingDone);

        // Fallback safety timeout
        setTimeout(function () {
          if (!revealTriggered) triggerHeroReveal();
        }, 3200);
      } else {
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            function (entries) {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                triggerHeroReveal();
              }
            },
            { threshold: 0.1 }
          );
          observer.observe(container);
        } else {
          triggerHeroReveal();
        }
      }

      // Absolute guarantee: never leave text hidden under any circumstance
      setTimeout(function () {
        if (!revealTriggered) {
          triggerHeroReveal();
        }
      }, 4000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroGooeySection);
  } else {
    initHeroGooeySection();
  }

  // Shopify Theme Editor design mode support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      if (e.target.classList.contains('section-auralink-hero')) {
        initHeroGooeySection();
      }
    });
  }
})();
