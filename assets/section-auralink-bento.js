/**
 * AuraLink Bento Section - Liquid Gooey Text Reveal & Interactive Amoeba Ripple
 * Exact replication of liquid gooey mechanics from AuraLink Hero Section.
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

  function getBentoDefsSvg() {
    let svg = document.getElementById('bento-goo-defs');
    if (!svg) {
      svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('id', 'bento-goo-defs');
      svg.setAttribute('style', 'position:absolute; width:0; height:0; pointer-events:none;');
      svg.setAttribute('aria-hidden', 'true');
      document.body.appendChild(svg);
    }

    if (!document.getElementById('bento-bubble-filter')) {
      const filter = document.createElementNS(SVG_NS, 'filter');
      filter.setAttribute('id', 'bento-bubble-filter');
      filter.setAttribute('x', '-30%');
      filter.setAttribute('y', '-30%');
      filter.setAttribute('width', '160%');
      filter.setAttribute('height', '160%');
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      filter.innerHTML =
        '<feTurbulence id="bento-turb" type="fractalNoise" baseFrequency="0.016 0.022" numOctaves="2" result="noise"></feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic" in2="noise" scale="38" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap>' +
        '<feGaussianBlur in="displaced" stdDeviation="4.5" result="blur"></feGaussianBlur>' +
        '<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7.5" result="gooey"></feColorMatrix>' +
        '<feComposite in="SourceGraphic" in2="gooey" operator="atop"></feComposite>';
      svg.appendChild(filter);
    }

    return svg;
  }

  function attachGooFilter(el, initialStdDev) {
    if (el.dataset.filterId) return el.dataset.filterId;
    const filterId = 'bento-goo-' + Math.random().toString(36).substr(2, 9);
    el.dataset.filterId = filterId;

    const svg = getBentoDefsSvg();
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

  function runTextRevealAnimation(lineElements, baseStdDev, delayOffset, onCompleteAll) {
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
          if (completedCount === lineElements.length && typeof onCompleteAll === 'function') {
            onCompleteAll();
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
    const rawSegments = rawHTML
      .split(/<br\s*\/?>/i)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });

    const isH2 = el.tagName.toLowerCase() === 'h2';
    const maskClass = isH2 ? 'split-line-h1-mask' : 'split-line-mask';
    const lineClass = isH2 ? 'split-line-h1 split-line' : 'split-line';

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

  function setupSeamlessLiquidRipple(headerEl, titleEl, subtitleEl) {
    if (!headerEl || headerEl.dataset.seamlessLiquidInit === 'true') return null;
    headerEl.dataset.seamlessLiquidInit = 'true';

    getBentoDefsSvg();

    let baseTextWrapper = headerEl.querySelector('.liquid-text-base');
    if (!baseTextWrapper && titleEl) {
      baseTextWrapper = document.createElement('div');
      baseTextWrapper.className = 'liquid-text-base';
      titleEl.parentNode.insertBefore(baseTextWrapper, titleEl);
      baseTextWrapper.appendChild(titleEl);
      if (subtitleEl) {
        baseTextWrapper.appendChild(subtitleEl);
      }
    }

    let overlayEl = headerEl.querySelector('.auralink-bento-liquid-overlay');
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.className = 'auralink-bento-liquid-overlay';
      overlayEl.setAttribute('aria-hidden', 'true');
      headerEl.appendChild(overlayEl);
    }

    function syncOverlayContent() {
      overlayEl.innerHTML = '';
      if (titleEl) {
        const cloneTitle = titleEl.cloneNode(true);
        cloneTitle.removeAttribute('id');
        cloneTitle.removeAttribute('data-reveal');
        cloneTitle.setAttribute('aria-hidden', 'true');
        cloneTitle.style.visibility = 'visible';
        cloneTitle.style.opacity = '1';
        cloneTitle.style.filter = '';
        cloneTitle.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
        cloneTitle.querySelectorAll('*').forEach(function (n) {
          n.style.visibility = 'visible';
          n.style.opacity = '1';
          n.style.filter = '';
        });
        overlayEl.appendChild(cloneTitle);
      }

      if (subtitleEl) {
        const cloneSub = subtitleEl.cloneNode(true);
        cloneSub.removeAttribute('id');
        cloneSub.removeAttribute('data-reveal');
        cloneSub.setAttribute('aria-hidden', 'true');
        cloneSub.style.visibility = 'visible';
        cloneSub.style.opacity = '1';
        cloneSub.style.filter = '';
        cloneSub.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
        cloneSub.querySelectorAll('*').forEach(function (n) {
          n.style.visibility = 'visible';
          n.style.opacity = '1';
          n.style.filter = '';
        });
        overlayEl.appendChild(cloneSub);
      }
    }

    syncOverlayContent();

    let targetX = -500;
    let targetY = -500;
    let currentX = -500;
    let currentY = -500;
    let targetRadius = 0;
    let currentRadius = 0;
    let isHovered = false;
    let rafId = null;
    let animTime = 0;

    function getMaxRadius() {
      return window.innerWidth <= 768 ? 160 : 220;
    }

    const turbEl = document.getElementById('bento-turb');
    let frameTick = 0;

    function updateLoop() {
      const lerpPos = 0.28;
      const lerpRad = 0.18;

      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      currentX += dx * lerpPos;
      currentY += dy * lerpPos;
      currentRadius += (targetRadius - currentRadius) * lerpRad;

      headerEl.style.setProperty('--bubble-x', currentX.toFixed(1) + 'px');
      headerEl.style.setProperty('--bubble-y', currentY.toFixed(1) + 'px');
      headerEl.style.setProperty('--bubble-r', currentRadius.toFixed(1) + 'px');

      if (currentRadius > 1) {
        animTime += 0.038;
        const stretch = Math.min(speed * 0.015, 0.40);
        const moveAngle = Math.atan2(dy, dx);
        const cosA = Math.cos(moveAngle);
        const sinA = Math.sin(moveAngle);

        const baseCutR = (currentRadius * (1 + stretch * 0.42) * 1.08).toFixed(1) + 'px';
        headerEl.style.setProperty('--base-cut-r', baseCutR);

        const r0 = currentRadius * 0.92 + Math.sin(animTime * 2.2) * (currentRadius * 0.10);
        headerEl.style.setProperty('--blob-x0', currentX.toFixed(1) + 'px');
        headerEl.style.setProperty('--blob-y0', currentY.toFixed(1) + 'px');
        headerEl.style.setProperty('--blob-r0', Math.max(0, r0).toFixed(1) + 'px');

        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI / 2) + animTime * 0.25;
          const dist = currentRadius * 0.46 +
                       Math.sin(animTime * 2.2 + i * 1.4) * (currentRadius * 0.16) +
                       Math.cos(animTime * 1.7 - i * 0.8) * (currentRadius * 0.09);
          const rLobe = currentRadius * 0.60 +
                        Math.sin(animTime * 1.9 - i * 1.1) * (currentRadius * 0.12);

          let lx = dist * Math.cos(angle);
          let ly = dist * Math.sin(angle);

          if (speed > 0.5 && stretch > 0.01) {
            const rx = lx * cosA + ly * sinA;
            const ry = -lx * sinA + ly * cosA;
            const sx = rx * (1 + stretch);
            const sy = ry * (1 - stretch * 0.45);
            lx = sx * cosA - sy * sinA;
            ly = sx * sinA + sy * cosA;
          }

          headerEl.style.setProperty('--blob-x' + (i + 1), (currentX + lx).toFixed(1) + 'px');
          headerEl.style.setProperty('--blob-y' + (i + 1), (currentY + ly).toFixed(1) + 'px');
          headerEl.style.setProperty('--blob-r' + (i + 1), Math.max(0, rLobe).toFixed(1) + 'px');
        }
      } else {
        headerEl.style.setProperty('--base-cut-r', '0px');
        headerEl.style.setProperty('--blob-r0', '0px');
        headerEl.style.setProperty('--blob-r1', '0px');
        headerEl.style.setProperty('--blob-r2', '0px');
        headerEl.style.setProperty('--blob-r3', '0px');
        headerEl.style.setProperty('--blob-r4', '0px');
      }

      if (turbEl && speed > 0.4) {
        frameTick += 0.05;
        const baseFreqX = (0.016 + Math.sin(frameTick) * 0.002).toFixed(4);
        const baseFreqY = (0.022 + Math.cos(frameTick * 0.8) * 0.002).toFixed(4);
        turbEl.setAttribute('baseFrequency', baseFreqX + ' ' + baseFreqY);
      }

      if (isHovered || currentRadius > 0.5) {
        rafId = requestAnimationFrame(updateLoop);
      } else {
        currentRadius = 0;
        headerEl.style.setProperty('--bubble-r', '0px');
        headerEl.style.setProperty('--base-cut-r', '0px');
        headerEl.style.setProperty('--blob-r0', '0px');
        headerEl.style.setProperty('--blob-r1', '0px');
        headerEl.style.setProperty('--blob-r2', '0px');
        headerEl.style.setProperty('--blob-r3', '0px');
        headerEl.style.setProperty('--blob-r4', '0px');
        headerEl.classList.remove('is-liquid-active');
        rafId = null;
      }
    }

    function onPointerEnter(e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = headerEl.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (currentX < -200) {
        currentX = targetX;
        currentY = targetY;
      }
      targetRadius = getMaxRadius();
      isHovered = true;
      headerEl.classList.add('is-liquid-active');
      if (!rafId) {
        rafId = requestAnimationFrame(updateLoop);
      }
    }

    function onPointerMove(e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = headerEl.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!isHovered) {
        isHovered = true;
        targetRadius = getMaxRadius();
        headerEl.classList.add('is-liquid-active');
        if (!rafId) {
          rafId = requestAnimationFrame(updateLoop);
        }
      }
    }

    function onPointerLeave() {
      isHovered = false;
      targetRadius = 0;
    }

    headerEl.addEventListener('pointerenter', onPointerEnter);
    headerEl.addEventListener('pointermove', onPointerMove);
    headerEl.addEventListener('pointerleave', onPointerLeave);

    return syncOverlayContent;
  }

  function initBentoGooeyHeader() {
    const bentoHeaders = document.querySelectorAll('.auralink-bento-header');
    if (!bentoHeaders.length) return;

    bentoHeaders.forEach(function (header) {
      if (header.dataset.bleibtGooInitialized === 'true') return;
      header.dataset.bleibtGooInitialized = 'true';

      const titleEl = header.querySelector('.auralink-bento-title[data-reveal="text"]');
      const subtitleEl = header.querySelector('.auralink-bento-subtitle[data-reveal="text"]');

      if (!titleEl && !subtitleEl) return;

      const titleLines = titleEl ? splitTextLines(titleEl) : [];
      const subtitleLines = subtitleEl ? splitTextLines(subtitleEl) : [];

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        header.querySelectorAll('[data-reveal]').forEach(function (el) {
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.filter = '';
        });
        return;
      }

      titleLines.forEach(function (line) {
        attachGooFilter(line, 48);
      });
      subtitleLines.forEach(function (line) {
        attachGooFilter(line, 24);
      });

      let syncOverlay = null;
      syncOverlay = setupSeamlessLiquidRipple(header, titleEl, subtitleEl);

      let revealTriggered = false;

      function triggerBentoReveal() {
        if (revealTriggered) return;
        revealTriggered = true;

        if (titleEl) titleEl.style.visibility = 'visible';
        if (subtitleEl) subtitleEl.style.visibility = 'visible';

        runTextRevealAnimation(titleLines, 48, 50, function () {
          if (syncOverlay) syncOverlay();
        });

        const subDelay = Math.max(280, titleLines.length * STAGGER + 100);
        runTextRevealAnimation(subtitleLines, 24, subDelay, function () {
          if (syncOverlay) syncOverlay();
        });
      }

      function resetBentoReveal() {
        if (!revealTriggered) return;
        revealTriggered = false;

        titleLines.forEach(function (line) {
          line.style.visibility = 'hidden';
          attachGooFilter(line, 48);
        });

        subtitleLines.forEach(function (line) {
          line.style.visibility = 'hidden';
          attachGooFilter(line, 24);
        });
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                triggerBentoReveal();
              } else if (entry.boundingClientRect.top > 0) {
                // Reset when scrolled back above, so it re-triggers when scrolling down into view
                resetBentoReveal();
              }
            });
          },
          {
            root: null,
            rootMargin: '0px 0px -15% 0px',
            threshold: 0.15
          }
        );
        observer.observe(header);
      } else {
        triggerBentoReveal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBentoGooeyHeader);
  } else {
    initBentoGooeyHeader();
  }

  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      if (e.target.classList.contains('section-auralink-bento') || e.target.querySelector('.auralink-bento-header')) {
        initBentoGooeyHeader();
      }
    });
  }
})();
