/**
 * AuraLink Theme - Global Liquid Gooey Text Reveal on Scroll
 * Exact 1.0s Smooth Liquid Reveal across all h, p, and span text elements.
 * Triggers precisely when text scrolls into view; resets when scrolled back up.
 * NOTE: Hover liquid ripple is strictly excluded here (used only in Hero/Header).
 */
(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const EXACT_DURATION = 1000; // Exactly 1.0s duration as requested

  const MATRIX_VALUES = function (l, c) {
    return '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + l + ' ' + c;
  };

  // Smooth ease-out curve for natural liquid condensation
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 2.5);
  }

  function isPlainMode() {
    if (
      document.documentElement.classList.contains('text-animations--plain') ||
      document.documentElement.classList.contains('animations--disabled')
    ) {
      return true;
    }
    if (
      window.AuraLinkSettings &&
      (window.AuraLinkSettings.textAnimation === 'plain' ||
        window.AuraLinkSettings.animationsRevealOnScroll === false)
    ) {
      return true;
    }
    return false;
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
    const s = typeof initialStdDev === 'number' ? initialStdDev : 6;
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

  function runTextRevealAnimation(lineElements, baseStdDev, startOffset, onComplete) {
    const dur = EXACT_DURATION; // 1000ms = 1s
    const stagger = 60; // 0.06s stagger between lines
    const offset = typeof startOffset === 'number' ? startOffset : 0;
    let completedCount = 0;

    lineElements.forEach(function (lineEl, lineIndex) {
      const lineAnimId = (lineEl._liquidAnimId = (lineEl._liquidAnimId || 0) + 1);
      const filterId = attachGooFilter(lineEl, baseStdDev);
      const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
      const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');

      if (feBlur) feBlur.setAttribute('stdDeviation', baseStdDev);
      if (feMatrix) feMatrix.setAttribute('values', MATRIX_VALUES(6, -1.5));
      lineEl.style.filter = 'url(#' + filterId + ')';
      lineEl.style.visibility = 'visible';
      lineEl.style.opacity = '1';

      const lineDelay = offset + (lineIndex * stagger);
      let startTime = null;

      function renderFrame(now) {
        if (lineEl._liquidAnimId !== lineAnimId) return;

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

        // feColorMatrix transitions to 1 0 in second half of the 1s duration
        const matrixThreshold = 0.5;
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
          // Finished: clear filter for 100% crisp vector sharpness
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
        if (lineEl._liquidAnimId !== lineAnimId) return;
        lineEl.style.filter = '';
        lineEl.style.visibility = 'visible';
        lineEl.style.opacity = '1';
      }, dur + lineDelay + 150);
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

  function getSlideElementOffset(el) {
    const slide = el.closest('.auralink-testimonials__slide, .auralink-slider__slide');
    if (!slide) return 0;
    const candidates = Array.from(
      slide.querySelectorAll(
        '[data-liquid-reveal="text"], [data-reveal="text"], [data-liquid-reveal-init="true"]'
      )
    );
    const unique = candidates.filter(function (item, index) {
      return (
        candidates.indexOf(item) === index &&
        !item.classList.contains('split-line') &&
        !item.classList.contains('split-line-mask') &&
        !item.classList.contains('split-line-h1-mask') &&
        !item.classList.contains('split-line-h1')
      );
    });
    const idx = unique.indexOf(el);
    return idx >= 0 ? idx * 40 : 0;
  }

  function initSingleLiquidReveal(el) {
    if (!el || el.dataset.liquidRevealInit === 'true') return;

    if (isPlainMode()) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.filter = '';
      return;
    }

    // Strict exclusion: Hero lead has its own dedicated amoeba liquid ripple effect
    if (el.closest('.auralink-hero-container')) return;

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

    function triggerReveal(force, startOffset) {
      if (!force) {
        // If inside an inactive slide and not forced, wait until that slide becomes active
        const slide = el.closest('.auralink-testimonials__slide, .auralink-slider__slide');
        if (slide) {
          const isTestimonialInactive =
            slide.classList.contains('auralink-testimonials__slide') &&
            !slide.classList.contains('is-active');
          const isSliderInactive =
            slide.classList.contains('auralink-slider__slide') &&
            slide.getAttribute('data-slot') !== 'center';
          if (isTestimonialInactive || isSliderInactive) {
            return;
          }
        }
        if (revealTriggered) return;
      }

      revealTriggered = true;
      const offset = typeof startOffset === 'number' ? startOffset : getSlideElementOffset(el);
      runTextRevealAnimation(lines, baseStdDev, offset);
    }

    function resetReveal() {
      revealTriggered = false;
      lines.forEach(function (line) {
        line._liquidAnimId = (line._liquidAnimId || 0) + 1;
        line.style.visibility = 'hidden';
        attachGooFilter(line, baseStdDev);
      });
    }

    el._liquidRevealTrigger = triggerReveal;
    el._liquidRevealReset = resetReveal;

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

  function isEligibleText(el) {
    if (!el || el.nodeType !== 1) return false;
    if (el.dataset.liquidRevealInit === 'true') return false;

    // Exclude header, footer, navigation, cart drawer, modals
    if (el.closest('header, footer, .header-wrapper, .footer, [id*="shopify-section-header"], [id*="shopify-section-footer"], .header-drawer, .menu-drawer, cart-drawer, .drawer, .modal, .popup, .localization-form')) {
      return false;
    }

    // Exclude hero text lead (which has hover ripple)
    if (el.closest('.auralink-hero-container')) return false;

    // Exclude form controls, scripts, styles, SVGs, hidden elements
    if (el.closest('button, input, select, textarea, label, fieldset, svg, .svg-wrapper, .icon, [aria-hidden="true"], .visually-hidden, script, style, noscript')) {
      return false;
    }

    // Skip if an ancestor is already initialized or is an h1..h6 or p
    if (el.parentElement && el.parentElement.closest('[data-liquid-reveal-init="true"], .split-line, .split-line-mask, .split-line-h1, .split-line-h1-mask, h1, h2, h3, h4, h5, h6, p')) {
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
      return true;
    }

    return false;
  }

  function initAllLiquidReveals(container) {
    const root = container || document;

    if (isPlainMode()) {
      const targets = root.querySelectorAll(
        '[data-liquid-reveal="text"], [data-reveal="text"], .liquid-reveal-init, .split-line, .split-line-h1'
      );
      targets.forEach(function (el) {
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.filter = '';
      });
      return;
    }

    // 1. Target all explicitly marked text elements in sections (headings, paragraphs, spans)
    const targets = root.querySelectorAll('[data-liquid-reveal="text"], [data-reveal="text"]');
    targets.forEach(function (el) {
      initSingleLiquidReveal(el);
    });

    // 2. Discover all other h, p, and standalone span text elements in main content sections
    const contentAreas = root.querySelectorAll('main, #MainContent, .main-content');
    contentAreas.forEach(function (area) {
      const candidates = area.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
      candidates.forEach(function (el) {
        if (isEligibleText(el)) {
          initSingleLiquidReveal(el);
        }
      });
    });
  }

  function replayLiquidReveal(container) {
    if (!container || isPlainMode()) return;

    // Ensure all target elements within container are initialized
    initAllLiquidReveals(container);

    const candidates = Array.from(container.querySelectorAll('[data-liquid-reveal-init="true"]'));
    const unique = candidates.filter(function (item, index) {
      return (
        candidates.indexOf(item) === index &&
        !item.classList.contains('split-line') &&
        !item.classList.contains('split-line-mask') &&
        !item.classList.contains('split-line-h1-mask') &&
        !item.classList.contains('split-line-h1')
      );
    });

    if (unique.length > 0) {
      unique.forEach(function (el, elementIndex) {
        if (typeof el._liquidRevealTrigger === 'function') {
          const elOffset = elementIndex * 40;
          el._liquidRevealTrigger(true, elOffset);
        }
      });
    } else if (typeof container._liquidRevealTrigger === 'function') {
      container._liquidRevealTrigger(true, 0);
    }
  }

  // Expose global controller for carousel/slider transitions and manual triggering
  window.AuraLinkLiquidReveal = {
    replay: replayLiquidReveal,
    initSingle: initSingleLiquidReveal,
    initAll: initAllLiquidReveals
  };

  // Replay animation whenever an active slide is broadcast
  document.addEventListener('auralink:slide:active', function (e) {
    if (e.target) {
      replayLiquidReveal(e.target);
    }
  });

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
