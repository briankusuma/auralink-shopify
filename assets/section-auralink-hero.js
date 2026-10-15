/**
 * AuraLink - Hero Section Liquid Goo Text Reveal (Inspired by bleibtgleich.dev)
 *
 * Initial screen load:
 * Text emerges organically through an SVG liquid/gooey morph filter
 * (feGaussianBlur + feColorMatrix alpha threshold) with vertical masked line slide,
 * rising from fluid ink/water droplets and coalescing into crisp, razor-sharp typography.
 *
 * No rolling text, no text hover effects — pure, elegant initial load reveal.
 */

(function () {
  'use strict';

  // Cubic bezier ease-out approximation: cubic-bezier(0.16, 1, 0.3, 1)
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  // Ensure persistent SVG filter defs container in DOM
  function getGooDefsSvg() {
    let svg = document.getElementById('auralink-goo-defs');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('id', 'auralink-goo-defs');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
      document.body.prepend(svg);
    }
    return svg;
  }

  // Create dedicated gooey SVG filter for an animated text line
  function createLineGooFilter(lineEl, initialBlur) {
    const svg = getGooDefsSvg();
    const filterId = 'goo-' + Math.random().toString(36).substr(2, 9);
    lineEl.dataset.filterId = filterId;

    const blurVal = typeof initialBlur === 'number' ? initialBlur : 34;

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-25%');
    filter.setAttribute('y', '-25%');
    filter.setAttribute('width', '150%');
    filter.setAttribute('height', '150%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    filter.innerHTML =
      '<feGaussianBlur in="SourceGraphic" stdDeviation="' + blurVal + '" result="blur"></feGaussianBlur>' +
      '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo"></feColorMatrix>';

    svg.appendChild(filter);
    lineEl.style.filter = 'url(#' + filterId + ')';
    return filterId;
  }

  // Animate SVG goo filter & masked transform (pure Vanilla JS requestAnimationFrame)
  function runLineGooReveal(lineEl, filterId, options) {
    options = options || {};
    const duration = options.duration || 1150;
    const delay = options.delay || 0;
    const startBlur = options.startBlur || 34;
    const startAmp = 20;
    const startOff = -8;
    const onComplete = options.onComplete;

    const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
    const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');

    let startTime = null;
    let animId = null;

    function frame(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (elapsed < delay) {
        animId = requestAnimationFrame(frame);
        return;
      }

      const rawProgress = Math.min((elapsed - delay) / duration, 1);
      const eased = easeOutExpo(rawProgress);

      // 1. Transform: 105% -> 0%
      const currentY = (1 - eased) * 105;
      lineEl.style.transform = 'translate3d(0, ' + currentY.toFixed(2) + '%, 0)';
      lineEl.style.opacity = Math.min(rawProgress * 2.8, 1).toFixed(2);

      // 2. Blur: startBlur -> 0
      const currentBlur = Math.max(0, (1 - eased) * startBlur);
      if (feBlur) {
        feBlur.setAttribute('stdDeviation', currentBlur.toFixed(2));
      }

      // 3. Matrix alpha threshold: (startAmp -> 1), (startOff -> 0)
      const matrixProgress = Math.min(rawProgress * 1.3, 1);
      const matrixEased = easeOutExpo(matrixProgress);
      const currentAmp = startAmp + (1 - startAmp) * matrixEased;
      const currentOff = startOff + (0 - startOff) * matrixEased;

      if (feMatrix) {
        feMatrix.setAttribute(
          'values',
          '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + currentAmp.toFixed(2) + ' ' + currentOff.toFixed(2)
        );
      }

      if (rawProgress < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        // Animation complete: remove filter for crystal-clear, pixel-crisp typography
        lineEl.style.transform = '';
        lineEl.style.opacity = '1';
        lineEl.style.filter = '';
        if (onComplete) onComplete();
      }
    }

    animId = requestAnimationFrame(frame);
    return function cancel() {
      if (animId) cancelAnimationFrame(animId);
      lineEl.style.transform = '';
      lineEl.style.opacity = '1';
      lineEl.style.filter = '';
    };
  }

  // =========================================================================
  // Text Splitting: Clean Masked Lines (no roll chars, no duplicate layers)
  // =========================================================================
  function splitElementIntoMaskedLines(element) {
    if (!element || element.dataset.linesSplit === 'true') {
      return Array.from(element.querySelectorAll('.auralink-reveal-line'));
    }
    element.dataset.linesSplit = 'true';

    const originalText = element.textContent.trim();
    element.setAttribute('aria-label', originalText);

    // Group child nodes into lines separated by <BR> tags
    const lineBuckets = [[]];
    Array.from(element.childNodes).forEach(function (node) {
      if (node.nodeName === 'BR') {
        lineBuckets.push([]);
      } else {
        lineBuckets[lineBuckets.length - 1].push(node);
      }
    });

    element.innerHTML = '';
    const lines = [];

    lineBuckets.forEach(function (bucket) {
      if (!bucket.length) return;

      const lineMask = document.createElement('span');
      lineMask.className = 'auralink-reveal-line-mask';
      lineMask.setAttribute('aria-hidden', 'true');

      const lineInner = document.createElement('span');
      lineInner.className = 'auralink-reveal-line';
      lineInner.setAttribute('aria-hidden', 'true');

      bucket.forEach(function (node) {
        lineInner.appendChild(node.cloneNode(true));
      });

      lineMask.appendChild(lineInner);
      element.appendChild(lineMask);
      lines.push(lineInner);
    });

    return lines;
  }

  // =========================================================================
  // Main Section Initialization
  // =========================================================================
  function initHeroSection() {
    const heroContainers = document.querySelectorAll('.auralink-hero-container');
    if (!heroContainers.length) return;

    heroContainers.forEach(function (container) {
      if (container.dataset.heroInit === 'true') return;
      container.dataset.heroInit = 'true';

      const leadEl = container.querySelector('.auralink-hero-lead');
      const contentEl = container.querySelector('.auralink-hero-content');
      const titleEl = container.querySelector('.auralink-hero-title');
      const subtitleEl = container.querySelector('.auralink-hero-subtitle');
      const ctaEl = container.querySelector('.auralink-hero-cta-btn');
      const tagsEl = container.querySelector('.auralink-hero-tags');

      if (!leadEl || !titleEl) return;

      // 1. Split title and subtitle into clean masked lines
      const titleLines = splitElementIntoMaskedLines(titleEl);
      const subtitleLines = subtitleEl ? splitElementIntoMaskedLines(subtitleEl) : [];

      // Check for prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        settleAnimation();
        return;
      }

      // Mark ready state (displaced below mask)
      leadEl.setAttribute('data-liquid-ready', 'true');
      if (contentEl) contentEl.setAttribute('data-liquid-ready', 'true');

      // Create SVG filters for each line
      const lineFilters = [];
      titleLines.forEach(function (line) {
        const filterId = createLineGooFilter(line, 36);
        lineFilters.push({ line: line, filterId: filterId, blur: 36 });
      });

      subtitleLines.forEach(function (line) {
        const filterId = createLineGooFilter(line, 22);
        lineFilters.push({ line: line, filterId: filterId, blur: 22 });
      });

      let revealStarted = false;

      function startLiquidReveal() {
        if (revealStarted) return;
        revealStarted = true;

        // Cascade each line with organic gooey fluid morph
        let maxDelay = 0;
        const lineStagger = 130;

        lineFilters.forEach(function (item, idx) {
          const delay = idx * lineStagger;
          maxDelay = Math.max(maxDelay, delay + 1150);

          runLineGooReveal(item.line, item.filterId, {
            duration: 1150,
            delay: delay,
            startBlur: item.blur
          });
        });

        // CTA button & tags lift smoothly
        const ctaDelay = Math.max(500, lineFilters.length * lineStagger + 100);
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

        // Once all lines finish coalescing, settle
        setTimeout(function () {
          settleAnimation();
        }, maxDelay + 100);
      }

      function settleAnimation() {
        leadEl.removeAttribute('data-liquid-ready');
        leadEl.setAttribute('data-liquid-done', 'true');
        if (contentEl) contentEl.setAttribute('data-liquid-done', 'true');

        titleLines.forEach(function (line) {
          line.style.transform = '';
          line.style.opacity = '1';
          line.style.filter = '';
        });

        subtitleLines.forEach(function (line) {
          line.style.transform = '';
          line.style.opacity = '1';
          line.style.filter = '';
        });

        if (ctaEl) {
          ctaEl.style.opacity = '1';
          ctaEl.style.transform = '';
        }
        if (tagsEl) {
          tagsEl.style.opacity = '1';
          tagsEl.style.transform = '';
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
        const onLoadingDone = function () {
          document.removeEventListener('auralink:loading:done', onLoadingDone);
          setTimeout(startLiquidReveal, 60);
        };
        document.addEventListener('auralink:loading:done', onLoadingDone);

        // Fallback timer in case event is missed
        setTimeout(function () {
          if (!revealStarted) startLiquidReveal();
        }, 3200);
      } else {
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            function (entries) {
              if (entries[0].isIntersecting) {
                observer.disconnect();
                startLiquidReveal();
              }
            },
            { threshold: 0.12 }
          );
          observer.observe(container);
        } else {
          startLiquidReveal();
        }
      }

      // Safety fallback: never leave text hidden
      setTimeout(function () {
        if (!leadEl.getAttribute('data-liquid-done')) {
          settleAnimation();
        }
      }, 4200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSection);
  } else {
    initHeroSection();
  }

  // Shopify Theme Editor support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      if (e.target.classList.contains('section-auralink-hero')) {
        initHeroSection();
      }
    });
  }
})();
