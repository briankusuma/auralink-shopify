/**
 * AuraLink - Hero Section Liquid Goo Text Reveal & Interactive Liquid Melting Hover
 * 100% Exact Replication of bleibtgleich.dev SVG Gooey Filter Technique
 *
 * Mechanics:
 * 1. Initial Load Reveal:
 *    - Letters start as melted liquid blobs / mercury droplets using <feGaussianBlur>
 *      (stdDeviation: 48) and high-contrast <feColorMatrix> (alpha threshold: 20 -8).
 *    - The blur animates down to 0 with cubic-bezier(0.25, 1, 0.5, 1) ease, causing the liquid
 *      blobs to condense, solidify, and resolve into razor-sharp typography.
 *    - In the final 35% of the duration, the color matrix alpha threshold interpolates back
 *      from 20 -8 to 1 0, and the filter is detached (filter: "") for 100% vector sharpness.
 * 2. Interactive Liquid Melting Hover:
 *    - On mouseenter on any line of .auralink-hero-title or .auralink-hero-subtitle:
 *      a) Reactivates the SVG Goo filter (feColorMatrix: 18 -7).
 *      b) Melts stdDeviation from 0 to 14 in ~0.18s.
 *      c) Condenses back from 14 to 0 using elastic.out(1, 0.45) over ~0.55s.
 *      d) Resets color matrix to 1 0 and clears the filter style for pure crispness.
 *      e) Cancels any existing tween on rapid re-entry to prevent animation overlap.
 * 3. Accessibility & Standards:
 *    - cursor: pointer on text indicates interactivity.
 *    - Full prefers-reduced-motion & .no-js support.
 *    - Zero external script dependencies; 100% Shopify Theme Store compliant.
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

  // Exact elastic.out(1, 0.45) solver for spring condensation
  function elasticOut(t, a, p) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    a = a || 1;
    p = p || 0.45;
    let s;
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = (p / (2 * Math.PI)) * Math.asin(1 / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
  }

  // SVG namespace & helpers from bleibtgleich.dev
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

    if (!document.getElementById('liquid-bubble-filter')) {
      const filter = document.createElementNS(SVG_NS, 'filter');
      filter.setAttribute('id', 'liquid-bubble-filter');
      filter.setAttribute('x', '-40%');
      filter.setAttribute('y', '-40%');
      filter.setAttribute('width', '180%');
      filter.setAttribute('height', '180%');
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      filter.innerHTML =
        '<feTurbulence id="bubble-turb" type="turbulence" baseFrequency="0.016 0.022" numOctaves="3" result="wave" seed="2"></feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic" in2="wave" scale="42" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap>' +
        '<feGaussianBlur in="displaced" stdDeviation="3.0" result="blurred"></feGaussianBlur>' +
        '<feColorMatrix in="blurred" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 26 -8" result="gooey"></feColorMatrix>' +
        '<feMerge>' +
          '<feMergeNode in="gooey"></feMergeNode>' +
          '<feMergeNode in="displaced"></feMergeNode>' +
        '</feMerge>';
      svg.appendChild(filter);
    }

    // Backwards-compatible alias for goo-feather-overlay
    if (!document.getElementById('goo-feather-overlay')) {
      const filterLegacy = document.createElementNS(SVG_NS, 'filter');
      filterLegacy.setAttribute('id', 'goo-feather-overlay');
      filterLegacy.setAttribute('x', '-40%');
      filterLegacy.setAttribute('y', '-40%');
      filterLegacy.setAttribute('width', '180%');
      filterLegacy.setAttribute('height', '180%');
      filterLegacy.setAttribute('color-interpolation-filters', 'sRGB');
      filterLegacy.innerHTML =
        '<feTurbulence type="turbulence" baseFrequency="0.016 0.022" numOctaves="3" result="wave" seed="2"></feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic" in2="wave" scale="42" xChannelSelector="R" yChannelSelector="G" result="displaced"></feDisplacementMap>' +
        '<feGaussianBlur in="displaced" stdDeviation="3.0" result="blurred"></feGaussianBlur>' +
        '<feColorMatrix in="blurred" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 26 -8" result="gooey"></feColorMatrix>' +
        '<feMerge>' +
          '<feMergeNode in="gooey"></feMergeNode>' +
          '<feMergeNode in="displaced"></feMergeNode>' +
        '</feMerge>';
      svg.appendChild(filterLegacy);
    }

    // 2. Blob Feather Filter
    if (!document.getElementById('blob-feather')) {
      const featherFilter = document.createElementNS(SVG_NS, 'filter');
      featherFilter.setAttribute('id', 'blob-feather');
      featherFilter.setAttribute('x', '-30%');
      featherFilter.setAttribute('y', '-30%');
      featherFilter.setAttribute('width', '160%');
      featherFilter.setAttribute('height', '160%');
      featherFilter.innerHTML = '<feGaussianBlur stdDeviation="16"></feGaussianBlur>';
      svg.appendChild(featherFilter);
    }

    // 3. MASK 1: Liquid Ripple Overlay Mask (White blob on Black background)
    if (!document.getElementById('liquid-blob-overlay-mask')) {
      const maskOverlay = document.createElementNS(SVG_NS, 'mask');
      maskOverlay.setAttribute('id', 'liquid-blob-overlay-mask');
      maskOverlay.setAttribute('maskUnits', 'userSpaceOnUse');
      maskOverlay.innerHTML =
        '<rect x="-2000" y="-2000" width="10000" height="10000" fill="black"></rect>' +
        '<path id="blob-path-overlay" fill="white" filter="url(#blob-feather)" d=""></path>';
      svg.appendChild(maskOverlay);
    }

    // 4. MASK 2: Inverted Base Static Text Mask (Black blob on White background - cuts the hole)
    if (!document.getElementById('liquid-blob-base-mask')) {
      const maskBase = document.createElementNS(SVG_NS, 'mask');
      maskBase.setAttribute('id', 'liquid-blob-base-mask');
      maskBase.setAttribute('maskUnits', 'userSpaceOnUse');
      maskBase.innerHTML =
        '<rect x="-2000" y="-2000" width="10000" height="10000" fill="white"></rect>' +
        '<path id="blob-path-base" fill="black" filter="url(#blob-feather)" d=""></path>';
      svg.appendChild(maskBase);
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
  function runTextRevealAnimation(lineElements, baseStdDev, delayOffset, onCompleteAll) {
    const startDelay = typeof delayOffset === 'number' ? delayOffset : 0;
    let completedCount = 0;

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
          // OnComplete: matrix is reset to 1 0, filter is detached so text is 100% crisp & selectable
          if (feMatrix) {
            feMatrix.setAttribute('values', MATRIX_VALUES(1, 0));
          }
          lineEl.style.filter = '';
          completedCount++;
          if (completedCount >= lineElements.length && onCompleteAll) {
            onCompleteAll();
          }
        }
      }

      requestAnimationFrame(renderFrame);
    });
  }

  // Interactive Liquid Melting Hover Effect
  function triggerLineLiquidMelt(lineEl) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Prevent animation overlap: kill existing hover animation if user re-enters rapidly
    if (lineEl._hoverAnimId) {
      cancelAnimationFrame(lineEl._hoverAnimId);
      lineEl._hoverAnimId = null;
    }

    const filterId = lineEl.dataset.filterId || attachGooFilter(lineEl, 0);
    const feBlur = document.querySelector('#' + filterId + ' feGaussianBlur');
    const feMatrix = document.querySelector('#' + filterId + ' feColorMatrix');
    if (!feBlur || !feMatrix) return;

    // 1. Reactivate the line's SVG Goo filter with melting threshold (18 -7)
    lineEl.style.filter = 'url(#' + filterId + ')';
    feMatrix.setAttribute('values', MATRIX_VALUES(18, -7));

    const meltDur = 180; // 0.18s melt time
    const condenseDur = 550; // 0.55s condense time
    const totalDur = meltDur + condenseDur;
    const maxMeltBlur = 14; // Peak melting stdDeviation

    let startTime = null;

    function renderMeltFrame(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (elapsed <= meltDur) {
        // Phase 1: Quickly melt letters from 0 to 14 stdDeviation
        const p = elapsed / meltDur;
        const eased = p * p * (3 - 2 * p); // Smooth cubic ease
        const blur = maxMeltBlur * eased;

        feBlur.setAttribute('stdDeviation', blur.toFixed(2));
        feMatrix.setAttribute('values', MATRIX_VALUES(18, -7));
        lineEl._hoverAnimId = requestAnimationFrame(renderMeltFrame);
      } else if (elapsed <= totalDur) {
        // Phase 2: Immediately condense back from 14 to 0 using elastic.out(1, 0.45)
        const p = (elapsed - meltDur) / condenseDur;
        const eased = elasticOut(p, 1, 0.45);
        const blur = Math.max(0, maxMeltBlur * (1 - Math.min(eased, 1)));

        feBlur.setAttribute('stdDeviation', blur.toFixed(2));

        // In the final 30% of condensation, interpolate color matrix smoothly back to 1 0
        if (p >= 0.7) {
          const matrixP = (p - 0.7) / 0.3;
          const amp = 18 + (1 - 18) * matrixP;
          const off = -7 + (0 - -7) * matrixP;
          feMatrix.setAttribute('values', MATRIX_VALUES(amp.toFixed(2), off.toFixed(2)));
        }

        lineEl._hoverAnimId = requestAnimationFrame(renderMeltFrame);
      } else {
        // On complete: reset feColorMatrix to 1 0 and clear filter style so text returns to pure vector crispness
        feBlur.setAttribute('stdDeviation', '0');
        feMatrix.setAttribute('values', MATRIX_VALUES(1, 0));
        lineEl.style.filter = '';
        lineEl._hoverAnimId = null;
      }
    }

    lineEl._hoverAnimId = requestAnimationFrame(renderMeltFrame);
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
  // Closed Catmull-Rom Spline to Cubic Bezier Converter for Smooth Amoeba Blob
  // =========================================================================
  function pointsToClosedCatmullRom(pts) {
    const len = pts.length;
    if (len < 3) return '';
    let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (let i = 0; i < len; i++) {
      const p0 = pts[(i - 1 + len) % len];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % len];
      const p3 = pts[(i + 2) % len];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C ' + cp1x.toFixed(1) + ' ' + cp1y.toFixed(1) + ', ' +
           cp2x.toFixed(1) + ' ' + cp2y.toFixed(1) + ', ' +
           p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    d += ' Z';
    return d;
  }

  // =========================================================================
  // Seamless, Organic Dynamic Morphing Amoeba Liquid Blob Mask
  // - Replaces rigid circular masks with an undulating 8-point spline amoeba.
  // - Dynamic sine/cosine undulation + velocity squish & stretch.
  // - Softly feathered edges for seamless blending into static text.
  // =========================================================================
  function setupSeamlessLiquidRipple(leadEl, titleEl, subtitleEl) {
    if (!leadEl || leadEl.dataset.seamlessLiquidInit === 'true') return null;
    leadEl.dataset.seamlessLiquidInit = 'true';

    getGooDefsSvg(); // Ensure SVG masks and filters exist in DOM

    // Ensure base text wrapper .liquid-text-base is present
    let baseTextWrapper = leadEl.querySelector('.liquid-text-base');
    if (!baseTextWrapper && titleEl) {
      baseTextWrapper = document.createElement('div');
      baseTextWrapper.className = 'liquid-text-base';
      titleEl.parentNode.insertBefore(baseTextWrapper, titleEl);
      baseTextWrapper.appendChild(titleEl);
      if (subtitleEl) {
        baseTextWrapper.appendChild(subtitleEl);
      }
    }

    let overlayEl = leadEl.querySelector('.auralink-hero-liquid-overlay');
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.className = 'auralink-hero-liquid-overlay';
      overlayEl.setAttribute('aria-hidden', 'true');
      leadEl.appendChild(overlayEl);
    }

    function syncOverlayContent() {
      overlayEl.innerHTML = '';
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

    let pathOverlay = document.getElementById('blob-path-overlay');
    let pathBase = document.getElementById('blob-path-base');

    function ensureBlobPaths() {
      if (!pathOverlay || !pathBase) {
        getGooDefsSvg();
        pathOverlay = document.getElementById('blob-path-overlay');
        pathBase = document.getElementById('blob-path-base');
      }
    }

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
      return window.innerWidth <= 768 ? 170 : 250;
    }

    const turbEl = document.getElementById('bubble-turb');
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

      leadEl.style.setProperty('--bubble-x', currentX.toFixed(1) + 'px');
      leadEl.style.setProperty('--bubble-y', currentY.toFixed(1) + 'px');
      leadEl.style.setProperty('--bubble-r', currentRadius.toFixed(1) + 'px');

      ensureBlobPaths();

      if (currentRadius > 1) {
        animTime += 0.038;
        const numPoints = 8;
        const pts = [];
        const wobbleAmp = currentRadius * 0.18;
        const stretch = Math.min(speed * 0.015, 0.38);
        const moveAngle = Math.atan2(dy, dx);
        const cosA = Math.cos(moveAngle);
        const sinA = Math.sin(moveAngle);

        for (let i = 0; i < numPoints; i++) {
          const angle = (i * 2 * Math.PI) / numPoints;
          // Asymmetrical dynamic undulation formula
          const r = currentRadius +
                    Math.sin(animTime * 2.2 + i * 1.4) * wobbleAmp +
                    Math.cos(animTime * 1.7 - i * 0.8) * (wobbleAmp * 0.6);

          let px = r * Math.cos(angle);
          let py = r * Math.sin(angle);

          // Velocity-based squish & stretch along movement vector
          if (speed > 0.5 && stretch > 0.01) {
            const rx = px * cosA + py * sinA;
            const ry = -px * sinA + py * cosA;
            const sx = rx * (1 + stretch);
            const sy = ry * (1 - stretch * 0.5);
            px = sx * cosA - sy * sinA;
            py = sx * sinA + sy * cosA;
          }

          pts.push({ x: currentX + px, y: currentY + py });
        }

        const d = pointsToClosedCatmullRom(pts);
        if (pathOverlay) pathOverlay.setAttribute('d', d);
        if (pathBase) pathBase.setAttribute('d', d);
      } else {
        if (pathOverlay) pathOverlay.setAttribute('d', '');
        if (pathBase) pathBase.setAttribute('d', '');
      }

      // Modulate chunky water waves dynamically while cursor sweeps across text
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
        leadEl.style.setProperty('--bubble-r', '0px');
        leadEl.classList.remove('is-liquid-active');
        if (pathOverlay) pathOverlay.setAttribute('d', '');
        if (pathBase) pathBase.setAttribute('d', '');
        rafId = null;
      }
    }

    function onPointerEnter(e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = leadEl.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (currentX < -200) {
        currentX = targetX;
        currentY = targetY;
      }
      targetRadius = getMaxRadius();
      isHovered = true;
      leadEl.classList.add('is-liquid-active');
      if (!rafId) {
        rafId = requestAnimationFrame(updateLoop);
      }
    }

    function onPointerMove(e) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = leadEl.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (!isHovered) {
        isHovered = true;
        targetRadius = getMaxRadius();
        leadEl.classList.add('is-liquid-active');
        if (!rafId) {
          rafId = requestAnimationFrame(updateLoop);
        }
      }
    }

    function onPointerLeave() {
      isHovered = false;
      targetRadius = 0;
    }

    leadEl.addEventListener('pointerenter', onPointerEnter);
    leadEl.addEventListener('pointermove', onPointerMove);
    leadEl.addEventListener('pointerleave', onPointerLeave);

    return syncOverlayContent;
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

      const leadEl = container.querySelector('.auralink-hero-lead');
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

      // Initialize seamless feathered radial falloff mask ripple on cursor hover
      let syncOverlay = null;
      if (leadEl) {
        syncOverlay = setupSeamlessLiquidRipple(leadEl, titleEl, subtitleEl);
      }

      let revealTriggered = false;

      function triggerHeroReveal() {
        if (revealTriggered) return;
        revealTriggered = true;

        // Make elements visible & start gooey coalescence
        if (titleEl) titleEl.style.visibility = 'visible';
        if (subtitleEl) subtitleEl.style.visibility = 'visible';

        // 1. Run title text reveal (initial blur 48 -> mercury drops merge & condense into letters)
        runTextRevealAnimation(titleLines, 48, 50, function () {
          if (syncOverlay) syncOverlay();
        });

        // 2. Run subtitle text reveal (initial blur 24, staggered right after title)
        const subDelay = Math.max(280, titleLines.length * STAGGER + 120);
        runTextRevealAnimation(subtitleLines, 24, subDelay, function () {
          if (syncOverlay) syncOverlay();
        });

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
