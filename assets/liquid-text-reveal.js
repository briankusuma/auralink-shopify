/**
 * AuraLink Theme - Global Liquid Gooey Text Reveal on Scroll
 * Replicates the exact liquid mercury text reveal mechanics from bleibtgleich.dev.
 * Triggers precisely when each section scrolls into the viewer's focus.
 * NOTE: Hover liquid ripple is strictly excluded here (used only in Hero/Header).
 */
(function () {
  'use strict';

  const DUR_L = 1100;
  const STAGGER = 80;
  const SVG_NS = 'http://www.w3.org/2000/svg';

  const MATRIX_VALUES = function (l, c) {
    return '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + l + ' ' + c;
  };

  function easeOut(e) {
    return 1 - Math.pow(1 - e, 3);
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
    if (el.dataset.filterId) {
      const existingFilter = document.getElementById(el.dataset.filterId);
      if (existingFilter) {
        const feBlur = existingFilter.querySelector('feGaussianBlur');
        const feMatrix = existingFilter.querySelector('feColorMatrix');
        if (feBlur) feBlur.setAttribute('stdDeviation', initialStdDev);
        if (feMatrix) feMatrix.setAttribute('values', MATRIX_VALUES(20, -8));
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

    const s = typeof initialStdDev === 'number' ? initialStdDev : 48;
    const l = 20;
    const c = -8;

    filter.innerHTML =
      '<feGaussianBlur in="SourceGraphic" stdDeviation="' + s + '" result="blur"></feGaussianBlur>' +
      '<feColorMatrix in="blur" mode="matrix" values="' + MATRIX_VALUES(l, c) + '" result="goo"></feColorMatrix>';

    svg.appendChild(filter);
    el.style.filter = 'url(#' + filterId + ')';
    return filterId;
  }

  function runTextRevealAnimation(lineElements, baseStdDev, delayOffset, onComplete) {
    const startDelay = typeof delayOffset === 'number' ? delayOffset : 0;
    let completedCount = 0;

    lineElements.forEach(function (lineEl, lineIndex) {
      const filterId = attachGooFilter(lineEl, baseStdDev);
      const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
      const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');

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

        const currentStdDev = Math.max(0, baseStdDev * (1 - easedProgress));
        if (feBlur) {
          feBlur.setAttribute('stdDeviation', currentStdDev.toFixed(2));
        }

        const matrixThreshold = 0.65;
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

  function initSingleLiquidReveal(el) {
    if (el.dataset.liquidRevealInit === 'true') return;
    // Skip hero elements as hero has its own orchestrated controller with ripple
    if (el.closest('.auralink-hero-lead')) return;

    el.dataset.liquidRevealInit = 'true';

    const isHeading = /^h[1-6]$/i.test(el.tagName) || el.classList.contains('title') || el.classList.contains('heading');
    const baseStdDev = isHeading ? 48 : 24;

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

    let revealTriggered = false;

    function triggerReveal() {
      if (revealTriggered) return;
      revealTriggered = true;
      el.style.visibility = 'visible';
      runTextRevealAnimation(lines, baseStdDev, 50);
    }

    function resetReveal() {
      if (!revealTriggered) return;
      revealTriggered = false;
      lines.forEach(function (line) {
        line.style.visibility = 'hidden';
        attachGooFilter(line, baseStdDev);
      });
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
          rootMargin: '0px 0px -15% 0px',
          threshold: 0.15
        }
      );
      observer.observe(el);
    } else {
      triggerReveal();
    }
  }

  function initAllLiquidReveals(container) {
    const root = container || document;
    const elements = root.querySelectorAll('[data-liquid-reveal="text"], [data-reveal="text"]');
    elements.forEach(function (el) {
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
