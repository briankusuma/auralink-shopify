/**
 * AuraLink Theme - Global Liquid Gooey Text Reveal on Scroll
 * 1.5s Smooth Viscous Liquid Reveal (Replicating bleibtgleich.dev SVG Goo filter)
 * Triggers precisely when text scrolls into view; resets when scrolled back up.
 * NOTE: Hover liquid ripple is strictly excluded here (used only in Hero/Header).
 */
(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const EXACT_DURATION = 1500; // Exactly 1.5s duration as requested

  const MATRIX_VALUES = function (l, c) {
    return '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + l + ' ' + c;
  };

  // Smooth ease-out curve for natural liquid condensation
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 2.4);
  }

  function getGlobalDefsSvg() {
    let svg = document.getElementById('global-liquid-goo-defs');
    if (!svg) {
      svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('id', 'global-liquid-goo-defs');
      svg.setAttribute('style', 'position:absolute; width:0; height:0; pointer-events:none;');
      svg.setAttribute('aria-hidden', 'true');
      document.body.appendChild(svg);
    }
    return svg;
  }

  function attachGooFilter(el, initialStdDev) {
    const s = typeof initialStdDev === 'number' ? initialStdDev : 8;
    const l = 6;
    const c = -1.5;

    if (el.dataset.filterId) {
      const existingFilter = document.getElementById(el.dataset.filterId);
      if (existingFilter) {
        const feBlur = existingFilter.querySelector('feGaussianBlur');
        const feMatrix = existingFilter.querySelector('feColorMatrix');
        if (feBlur) feBlur.setAttribute('stdDeviation', s);
        if (feMatrix) feMatrix.setAttribute('values', MATRIX_VALUES(l, c));
        el.style.filter = 'url(#' + el.dataset.filterId + ')';
        return el.dataset.filterId;
      }
    }

    const filterId = 'liquid-goo-' + Math.random().toString(36).substr(2, 9);
    el.dataset.filterId = filterId;

    const svg = getGlobalDefsSvg();
    const filter = document.createElementNS(SVG_NS, 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-25%');
    filter.setAttribute('y', '-25%');
    filter.setAttribute('width', '150%');
    filter.setAttribute('height', '150%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    const feBlur = document.createElementNS(SVG_NS, 'feGaussianBlur');
    feBlur.setAttribute('in', 'SourceGraphic');
    feBlur.setAttribute('stdDeviation', s);
    feBlur.setAttribute('result', 'blur');

    const feMatrix = document.createElementNS(SVG_NS, 'feColorMatrix');
    feMatrix.setAttribute('in', 'blur');
    feMatrix.setAttribute('mode', 'matrix');
    feMatrix.setAttribute('values', MATRIX_VALUES(l, c));
    feMatrix.setAttribute('result', 'goo');

    filter.appendChild(feBlur);
    filter.appendChild(feMatrix);
    svg.appendChild(filter);

    el.style.filter = 'url(#' + filterId + ')';
    return filterId;
  }

  function runTextRevealAnimation(lineElements, baseStdDev, onComplete) {
    const dur = EXACT_DURATION; // 1.5s
    const stagger = 80; // 0.08s stagger between lines
    let completedCount = 0;

    lineElements.forEach(function (lineEl, lineIndex) {
      const filterId = attachGooFilter(lineEl, baseStdDev);
      const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
      const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');

      if (feBlur) feBlur.setAttribute('stdDeviation', baseStdDev);
      if (feMatrix) feMatrix.setAttribute('values', MATRIX_VALUES(6, -1.5));
      lineEl.style.filter = 'url(#' + filterId + ')';
      lineEl.style.visibility = 'visible';
      lineEl.style.opacity = '1';

      const lineDelay = lineIndex * stagger;
      let startTime = null;

      function renderFrame(now) {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        if (elapsed < lineDelay) {
          requestAnimationFrame(renderFrame);
          return;
        }

        const t = Math.min((elapsed - lineDelay) / dur, 1);
        const easedProgress = easeOut(t);

        // stdDeviation decreases smoothly from baseStdDev down to 0
        const currentStdDev = Math.max(0, baseStdDev * (1 - easedProgress));
        if (feBlur) {
          feBlur.setAttribute('stdDeviation', currentStdDev.toFixed(2));
        }

        // feColorMatrix transitions to 1 0 in the second half of duration (from t=0.55 to 1.0)
        const matrixThreshold = 0.55;
        if (t >= matrixThreshold) {
          const matrixT = Math.min((t - matrixThreshold) / (1 - matrixThreshold), 1);
          const currentAmp = 6 + (1 - 6) * matrixT;
          const currentOff = -1.5 + (0 - -1.5) * matrixT;

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
          // Finished: clear filter so text is 100% crisp vector sharpness
          lineEl.style.filter = '';
          lineEl.style.visibility = 'visible';
          lineEl.style.opacity = '1';
          completedCount++;
          if (completedCount === lineElements.length && typeof onComplete === 'function') {
            onComplete();
          }
        }
      }

      requestAnimationFrame(renderFrame);

      // Failsafe timeout: guarantee text is never permanently hidden or blurred
      setTimeout(function () {
        lineEl.style.filter = '';
        lineEl.style.visibility = 'visible';
        lineEl.style.opacity = '1';
      }, dur + lineDelay + 200);
    });
  }

  function splitTextLines(el) {
    if (el.dataset.linesSplitted === 'true') {
      return Array.from(el.querySelectorAll('.split-line'));
    }
    el.dataset.linesSplitted = 'true';

    const rawHTML = el.innerHTML;
    let rawSegments = rawHTML
      .split(/<br\s*\/?>/i)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });

    if (rawSegments.length <= 1) {
      rawSegments = [rawHTML.trim()];
    }

    const isHeading = /^h[1-6]$/i.test(el.tagName);
    const maskClass = isHeading ? 'split-line-h1-mask' : 'split-line-mask';
    const lineClass = isHeading ? 'split-line-h1 split-line' : 'split-line';

    el.innerHTML = '';
    const lineElements = [];

    rawSegments.forEach(function (segmentText) {
      const maskSpan = document.createElement('span');
      maskSpan.className = maskClass;

      const lineSpan = document.createElement('span');
      lineSpan.className = lineClass;
      lineSpan.innerHTML = segmentText;
      lineSpan.style.visibility = 'hidden';

      maskSpan.appendChild(lineSpan);
      el.appendChild(maskSpan);
      lineElements.push(lineSpan);
    });

    return lineElements;
  }

  // Safe blur amounts that keep text visible while creating gorgeous viscous liquid coalescence
  function getBaseStdDev(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1' || tag === 'h2' || el.classList.contains('h1') || el.classList.contains('h2') || el.classList.contains('h0')) {
      return 14;
    }
    if (tag === 'h3' || tag === 'h4' || el.classList.contains('h3') || el.classList.contains('h4')) {
      return 8;
    }
    if (tag === 'p' || el.classList.contains('rte')) {
      return 5;
    }
    return 3;
  }

  function initSingleLiquidReveal(el) {
    if (!el || el.dataset.liquidRevealInit === 'true') return;

    // Strict exclusion: Hero lead has its own dedicated amoeba liquid ripple effect
    if (el.closest('.auralink-hero-lead')) return;

    // Strict exclusion: Header, footer, cart drawer, modals
    if (el.closest('header, footer, .header-wrapper, .footer, [id*="shopify-section-header"], [id*="shopify-section-footer"], .header-drawer, cart-drawer, .drawer, .modal, .popup')) {
      return;
    }

    el.dataset.liquidRevealInit = 'true';

    const baseStdDev = getBaseStdDev(el);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.filter = '';
      return;
    }

    const lines = splitTextLines(el);
    lines.forEach(function (line) {
      attachGooFilter(line, baseStdDev);
    });

    // Make parent visible once child lines are prepared
    el.style.visibility = 'visible';

    let revealTriggered = false;

    function triggerReveal() {
      if (revealTriggered) return;
      revealTriggered = true;
      runTextRevealAnimation(lines, baseStdDev);
    }

    function resetReveal() {
      if (!revealTriggered) return;
      revealTriggered = false;
      lines.forEach(function (line) {
        line.style.visibility = 'hidden';
        attachGooFilter(line, baseStdDev);
      });
    }

    // Immediate check: if already in viewport, trigger right away
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
      triggerReveal();
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              triggerReveal();
            } else if (entry.boundingClientRect.top > 0) {
              // Scrolled back above the element: reset so it re-reveals when scrolled back down
              resetReveal();
            }
          });
        },
        {
          root: null,
          rootMargin: '50px 0px 50px 0px',
          threshold: 0
        }
      );
      observer.observe(el);
    } else {
      triggerReveal();
    }
  }

  function initAllLiquidReveals(container) {
    const root = container || document;

    // Target all explicitly marked text elements in sections (headings, paragraphs, spans)
    const targets = root.querySelectorAll('[data-liquid-reveal="text"], [data-reveal="text"]');
    targets.forEach(function (el) {
      initSingleLiquidReveal(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAllLiquidReveals();
    });
  } else {
    initAllLiquidReveals();
  }

  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      initAllLiquidReveals(e.target);
    });
  }
})();
