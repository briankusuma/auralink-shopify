/**
 * AuraLink Theme - Global Liquid Gooey Text Reveal on Scroll
 * Replicates the exact liquid mercury text reveal mechanics from bleibtgleich.dev.
 * Triggers precisely when each section scrolls into the viewer's focus.
 * Applies across all headings (h1-h6), paragraphs (p), and text spans.
 * NOTE: Hover liquid ripple is strictly excluded here (used only in Hero/Header).
 */
(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  const MATRIX_VALUES = function (l, c) {
    return '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + l + ' ' + c;
  };

  // Gentle viscous liquid easing: lets the melted droplet/mercury stage linger noticeably
  function easeOut(e) {
    return 1 - Math.pow(1 - e, 2.0);
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

    const s = typeof initialStdDev === 'number' ? initialStdDev : 36;
    const l = 20;
    const c = -8;

    filter.innerHTML =
      '<feGaussianBlur in="SourceGraphic" stdDeviation="' + s + '" result="blur"></feGaussianBlur>' +
      '<feColorMatrix in="blur" mode="matrix" values="' + MATRIX_VALUES(l, c) + '" result="goo"></feColorMatrix>';

    svg.appendChild(filter);
    el.style.filter = 'url(#' + filterId + ')';
    return filterId;
  }

  function runTextRevealAnimation(lineElements, baseStdDev, duration, staggerDelay, onComplete) {
    const dur = typeof duration === 'number' ? duration : 2200;
    const stagger = typeof staggerDelay === 'number' ? staggerDelay : 140;
    let completedCount = 0;

    lineElements.forEach(function (lineEl, lineIndex) {
      const filterId = attachGooFilter(lineEl, baseStdDev);
      const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
      const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');

      if (feBlur) feBlur.setAttribute('stdDeviation', baseStdDev);
      if (feMatrix) feMatrix.setAttribute('values', MATRIX_VALUES(20, -8));
      lineEl.style.filter = 'url(#' + filterId + ')';
      lineEl.style.visibility = 'visible';

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

        const currentStdDev = Math.max(0, baseStdDev * (1 - easedProgress));
        if (feBlur) {
          feBlur.setAttribute('stdDeviation', currentStdDev.toFixed(2));
        }

        const matrixThreshold = 0.75;
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

  function getBaseStdDev(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || el.classList.contains('h1') || el.classList.contains('h2') || el.classList.contains('h0')) {
      return 42;
    }
    if (tag === 'h4' || tag === 'h5' || tag === 'h6' || el.classList.contains('h3') || el.classList.contains('h4')) {
      return 28;
    }
    if (tag === 'p' || el.classList.contains('rte')) {
      return 18;
    }
    return 14;
  }

  function getAnimationDuration(el) {
    const tag = el.tagName.toLowerCase();
    if (/^h[1-3]$/.test(tag) || el.classList.contains('h1') || el.classList.contains('h2') || el.classList.contains('h0')) {
      return 2400;
    }
    if (/^h[4-6]$/.test(tag) || el.classList.contains('h3') || el.classList.contains('h4')) {
      return 2100;
    }
    if (tag === 'p' || el.classList.contains('rte')) {
      return 1900;
    }
    return 1700;
  }

  function initSingleLiquidReveal(el) {
    if (!el || el.dataset.liquidRevealInit === 'true') return;

    // Strict exclusion: Hero lead has its own dedicated amoeba liquid ripple effect
    if (el.closest('.auralink-hero-lead')) return;

    el.dataset.liquidRevealInit = 'true';

    const baseStdDev = getBaseStdDev(el);
    const duration = getAnimationDuration(el);

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

    // Make the parent container visible now that its child lines are securely hidden
    el.style.visibility = 'visible';

    let revealTriggered = false;

    function triggerReveal() {
      if (revealTriggered) return;
      revealTriggered = true;
      runTextRevealAnimation(lines, baseStdDev, duration, 140);
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
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.1
        }
      );
      observer.observe(el);
    } else {
      triggerReveal();
    }
  }

  function isEligibleText(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.dataset.liquidRevealInit === 'true') return false;

    // Exclude header, footer, navigation, cart drawer, modals
    if (el.closest('header, footer, .header-wrapper, .footer, [id*="shopify-section-header"], [id*="shopify-section-footer"], .header-drawer, .menu-drawer, cart-drawer, .drawer, .modal, .popup, .localization-form')) {
      return false;
    }

    // Exclude hero text lead (which has hover ripple)
    if (el.closest('.auralink-hero-lead')) return false;

    // Exclude form controls, scripts, styles, SVGs, hidden elements
    if (el.closest('button, input, select, textarea, label, fieldset, svg, .svg-wrapper, .icon, [aria-hidden="true"], .visually-hidden, script, style, noscript')) {
      return false;
    }

    // Skip if an ancestor is already initialized or being split
    if (el.parentElement && el.parentElement.closest('[data-liquid-reveal-init="true"], .split-line, .split-line-mask, .split-line-h1, .split-line-h1-mask')) {
      return false;
    }

    // Must have non-empty text content
    const text = el.textContent ? el.textContent.trim() : '';
    if (text.length === 0) return false;

    // Explicitly marked
    if (el.matches('[data-liquid-reveal="text"], [data-reveal="text"]')) {
      return true;
    }

    const tag = el.tagName.toLowerCase();

    // Headings (h1..h6)
    if (/^h[1-6]$/.test(tag)) {
      return true;
    }

    // Paragraphs
    if (tag === 'p') {
      return true;
    }

    // Standalone content spans
    if (tag === 'span') {
      // Must not contain block elements
      if (el.querySelector('div, p, h1, h2, h3, h4, h5, h6, ul, ol, li')) return false;
      // Must not be an inline icon or caret
      if (el.classList.contains('svg-wrapper') || el.classList.contains('icon') || el.classList.contains('circle-divider') || el.classList.contains('auralink-pill__dot')) {
        return false;
      }
      // Parent must not be an h1..h6 or p
      if (el.parentElement && /^h[1-6]|p$/i.test(el.parentElement.tagName)) return false;
      return true;
    }

    return false;
  }

  function initAllLiquidReveals(container) {
    const root = container || document;

    // 1. Process all explicitly marked elements
    const explicitTargets = root.querySelectorAll('[data-liquid-reveal="text"], [data-reveal="text"]');
    explicitTargets.forEach(function (el) {
      initSingleLiquidReveal(el);
    });

    // 2. Discover all remaining h, p, and span within section contents
    const sectionContainers = root.querySelectorAll('.shopify-section, main, .main-content, #MainContent');
    sectionContainers.forEach(function (section) {
      if (section.id && (section.id.indexOf('header') !== -1 || section.id.indexOf('footer') !== -1)) {
        return;
      }
      const candidates = section.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
      candidates.forEach(function (el) {
        if (isEligibleText(el)) {
          initSingleLiquidReveal(el);
        }
      });
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
