/**
 * AuraLink - Hero Section Liquid Fluid Text Reveal & Interactive Text Hover
 * Inspired by bleibtgleich.dev
 *
 * Mechanics:
 * 1. Initial Load: Text emerges organically through an SVG liquid/gooey morph
 *    filter (feGaussianBlur + feColorMatrix alpha threshold) with vertical masked
 *    line slide, coalescing smoothly from fluid ink droplets into razor-sharp typography.
 * 2. Interactive Text Hover:
 *    a) Dual-layer rolling character flip (label & shadow) with per-character stagger.
 *    b) Radial water wave ripple radiating directly across characters under and near cursor.
 *    c) Rolling character cascade & 45deg arrow rotation on CTA button.
 * 3. Accessibility & Performance: aria-label on split text, prefers-reduced-motion,
 *    Shopify Theme Editor design mode listeners, zero external script dependencies.
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
  // Text Splitting: Masked Lines + Double-Decker Rolling Chars
  // =========================================================================
  function splitElementIntoLinesAndRollingChars(element) {
    if (!element || element.dataset.bleibtSplit === 'true') {
      return {
        lines: Array.from(element.querySelectorAll('.auralink-reveal-line')),
        chars: Array.from(element.querySelectorAll('.auralink-char-mask'))
      };
    }
    element.dataset.bleibtSplit = 'true';

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
    const allChars = [];

    lineBuckets.forEach(function (bucket) {
      const lineMask = document.createElement('span');
      lineMask.className = 'auralink-reveal-line-mask';
      lineMask.setAttribute('aria-hidden', 'true');

      const lineInner = document.createElement('span');
      lineInner.className = 'auralink-reveal-line';
      lineInner.setAttribute('aria-hidden', 'true');

      bucket.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          const tokens = text.split(/(\s+)/);

          tokens.forEach(function (token) {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              lineInner.appendChild(document.createTextNode(token));
            } else {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'auralink-word';
              wordSpan.setAttribute('aria-hidden', 'true');

              for (let i = 0; i < token.length; i++) {
                const charMask = document.createElement('span');
                charMask.className = 'auralink-char-mask';
                charMask.setAttribute('aria-hidden', 'true');

                const charInner = document.createElement('span');
                charInner.className = 'auralink-char-inner';
                charInner.style.setProperty('--roll-delay', (i * 24) + 'ms');

                const charLabel = document.createElement('span');
                charLabel.className = 'auralink-char-label';
                charLabel.textContent = token[i];

                const charShadow = document.createElement('span');
                charShadow.className = 'auralink-char-shadow';
                charShadow.setAttribute('aria-hidden', 'true');
                charShadow.textContent = token[i];

                charInner.appendChild(charLabel);
                charInner.appendChild(charShadow);
                charMask.appendChild(charInner);
                wordSpan.appendChild(charMask);
                allChars.push(charMask);
              }

              lineInner.appendChild(wordSpan);
            }
          });
        } else {
          lineInner.appendChild(node.cloneNode(true));
        }
      });

      lineMask.appendChild(lineInner);
      element.appendChild(lineMask);
      lines.push(lineInner);
    });

    return { lines: lines, chars: allChars };
  }

  // Prepare CTA button rolling characters
  function setupCtaRollingText(ctaEl) {
    if (!ctaEl || ctaEl.dataset.ctaSplit === 'true') return;
    ctaEl.dataset.ctaSplit = 'true';

    const textSpan = ctaEl.querySelector('.auralink-cta-text');
    if (!textSpan) return;

    const originalText = textSpan.textContent.trim();
    textSpan.setAttribute('aria-label', originalText);
    textSpan.innerHTML = '';

    for (let i = 0; i < originalText.length; i++) {
      const ch = originalText[i];
      if (ch === ' ') {
        textSpan.appendChild(document.createTextNode(' '));
        continue;
      }

      const charMask = document.createElement('span');
      charMask.className = 'auralink-char-mask';
      charMask.setAttribute('aria-hidden', 'true');

      const charInner = document.createElement('span');
      charInner.className = 'auralink-char-inner';
      charInner.style.setProperty('--roll-delay', (i * 18) + 'ms');

      const charLabel = document.createElement('span');
      charLabel.className = 'auralink-char-label';
      charLabel.textContent = ch;

      const charShadow = document.createElement('span');
      charShadow.className = 'auralink-char-shadow';
      charShadow.setAttribute('aria-hidden', 'true');
      charShadow.textContent = ch;

      charInner.appendChild(charLabel);
      charInner.appendChild(charShadow);
      charMask.appendChild(charInner);
      textSpan.appendChild(charMask);
    }
  }

  // =========================================================================
  // Interactive Hover: Rolling Flip + Radial Water Ripple on Text
  // =========================================================================
  function setupInteractiveTextHover(leadEl, charMasks, ctaEl) {
    if (!leadEl || leadEl.dataset.hoverActive === 'true') return;
    leadEl.dataset.hoverActive = 'true';

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    // Cache character centers for fast distance lookups during cursor scrub
    let charMetrics = [];

    function measureChars() {
      charMetrics = charMasks.map(function (mask) {
        const rect = mask.getBoundingClientRect();
        return {
          mask: mask,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          busy: false
        };
      });
    }

    measureChars();
    window.addEventListener('resize', measureChars, { passive: true });
    window.addEventListener('scroll', measureChars, { passive: true });

    let lastMoveTime = 0;
    const maxRadius = 240; // Max influence radius in px
    const waveSpeed = 0.75; // px per ms

    function onPointerMove(e) {
      const now = performance.now();
      if (now - lastMoveTime < 20) return; // ~50fps throttle
      lastMoveTime = now;

      const curX = e.clientX;
      const curY = e.clientY;

      // 1. Water wave ripple to characters under / near cursor
      for (let i = 0; i < charMetrics.length; i++) {
        const item = charMetrics[i];
        const dx = item.cx - curX;
        const dy = item.cy - curY;
        const dist = Math.hypot(dx, dy);

        if (dist <= maxRadius && !item.busy) {
          const delayMs = dist / waveSpeed;
          const factor = Math.pow(1 - dist / maxRadius, 1.4);

          item.busy = true;
          triggerCharRipple(item, dx, dy, dist, factor, delayMs);
        }
      }

      // 2. Cursor sheen & bounce on CTA button
      if (ctaEl) {
        const btnRect = ctaEl.getBoundingClientRect();
        const btnCx = btnRect.left + btnRect.width / 2;
        const btnCy = btnRect.top + btnRect.height / 2;
        const btnDist = Math.hypot(btnCx - curX, btnCy - curY);

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
              }, 500);
            }, 130);
          }, btnDelay);
        }
      }
    }

    function triggerCharRipple(item, dx, dy, dist, factor, delayMs) {
      setTimeout(function () {
        const mask = item.mask;
        const normX = dx / (dist || 1);
        const normY = dy / (dist || 1);
        const pushX = normX * 4.5 * factor;
        const liftY = -5.8 * factor + (normY * 2.0 * factor);
        const scale = 1 + 0.12 * factor;

        mask.style.setProperty('--wave-x', pushX.toFixed(2) + 'px');
        mask.style.setProperty('--wave-y', liftY.toFixed(2) + 'px');
        mask.style.setProperty('--wave-scale', scale.toFixed(3));

        mask.classList.remove('char--wave-calm');
        mask.classList.add('char--wave-hit');

        setTimeout(function () {
          mask.classList.remove('char--wave-hit');
          mask.classList.add('char--wave-calm');

          setTimeout(function () {
            mask.classList.remove('char--wave-calm');
            mask.style.removeProperty('--wave-x');
            mask.style.removeProperty('--wave-y');
            mask.style.removeProperty('--wave-scale');
            item.busy = false;
          }, 480);
        }, 120);
      }, delayMs);
    }

    leadEl.addEventListener('pointerenter', measureChars, { passive: true });
    leadEl.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  // =========================================================================
  // Main Section Initialization
  // =========================================================================
  function initHeroSection() {
    const heroContainers = document.querySelectorAll('.auralink-hero-container');
    if (!heroContainers.length) return;

    heroContainers.forEach(function (container) {
      if (container.dataset.bleibtInitialized === 'true') return;
      container.dataset.bleibtInitialized = 'true';

      const leadEl = container.querySelector('.auralink-hero-lead');
      const contentEl = container.querySelector('.auralink-hero-content');
      const titleEl = container.querySelector('.auralink-hero-title');
      const subtitleEl = container.querySelector('.auralink-hero-subtitle');
      const ctaEl = container.querySelector('.auralink-hero-cta-btn');
      const tagsEl = container.querySelector('.auralink-hero-tags');

      if (!leadEl || !titleEl) return;

      // 1. Split title & subtitle into lines and double-layer rolling characters
      const titleData = splitElementIntoLinesAndRollingChars(titleEl);
      const subtitleData = subtitleEl ? splitElementIntoLinesAndRollingChars(subtitleEl) : { lines: [], chars: [] };
      const allChars = titleData.chars.concat(subtitleData.chars);

      // 2. Setup CTA button rolling text
      if (ctaEl) {
        setupCtaRollingText(ctaEl);
      }

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
      titleData.lines.forEach(function (line) {
        const filterId = createLineGooFilter(line, 36);
        lineFilters.push({ line: line, filterId: filterId, blur: 36 });
      });

      subtitleData.lines.forEach(function (line) {
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

        // CTA button & tags lift gracefully
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

        // Once all lines finish coalescing, settle & attach interactive hover
        setTimeout(function () {
          settleAnimation();
        }, maxDelay + 100);
      }

      function settleAnimation() {
        leadEl.removeAttribute('data-liquid-ready');
        leadEl.setAttribute('data-liquid-done', 'true');
        if (contentEl) contentEl.setAttribute('data-liquid-done', 'true');

        titleData.lines.forEach(function (line) {
          line.style.transform = '';
          line.style.opacity = '1';
          line.style.filter = '';
        });

        subtitleData.lines.forEach(function (line) {
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

        // Initialize rolling characters and radial text ripple on hover
        setupInteractiveTextHover(leadEl, allChars, ctaEl);
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
