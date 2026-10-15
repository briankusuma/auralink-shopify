/**
 * AuraLink - Loading Screen Controller
 * Features:
 * - Ambient ripple wave text logo (clean, non-scrambled, fluid acoustic ripple)
 * - Bottom-left count up from 0% to 100%
 * - Schema settings integration (label, duration, text logo, session memory)
 * - Pure vanilla JavaScript adhering to Shopify Theme Store guidelines
 */
(function () {
  'use strict';

  function initLoadingScreen() {
    const screen = document.getElementById('AuraLoadingScreen');
    if (!screen) return;

    const logoEl = document.getElementById('LoadingScreenLogo');
    const logoTextEl = screen.querySelector('.loading-screen__logo-text');
    const numberEl = document.getElementById('LoadingScreenNumber');
    const barEl = document.getElementById('LoadingScreenBar');

    const targetText = (logoEl?.dataset?.targetText || 'AURALINK').trim();
    const durationSeconds = parseFloat(screen.dataset.duration || '2');
    const durationMs = Math.max(800, durationSeconds * 1000);
    const isFirstVisitOnly = screen.dataset.firstVisit === 'true';

    // In theme editor (designMode), never lock the merchant's view permanently
    const isDesignMode = Boolean(window.Shopify && window.Shopify.designMode);

    // Session-based check (if enabled)
    if (!isDesignMode && isFirstVisitOnly) {
      try {
        if (sessionStorage.getItem('auralink_loading_screen_shown')) {
          screen.remove();
          return;
        }
      } catch (e) {
        // Ignore sessionStorage restrictions in private browsing
      }
    }

    // Motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.body.classList.add('loading-screen-active');

    // Ensure letters have --letter-index for staggered ripple wave
    if (logoTextEl && logoTextEl.children.length === 0) {
      const chars = Array.from(targetText);
      logoTextEl.innerHTML = '';
      chars.forEach(function (char, idx) {
        const span = document.createElement('span');
        span.className = 'loading-screen__letter';
        span.style.setProperty('--letter-index', idx);
        span.innerHTML = char === ' ' ? '&nbsp;' : escapeHtml(char);
        logoTextEl.appendChild(span);
      });
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function dismissScreen() {
      screen.classList.add('loading-screen--done');
      document.body.classList.remove('loading-screen-active');

      if (!isDesignMode && isFirstVisitOnly) {
        try {
          sessionStorage.setItem('auralink_loading_screen_shown', 'true');
        } catch (e) {}
      }

      // Cleanup after transition finishes
      setTimeout(function () {
        screen.setAttribute('aria-hidden', 'true');
        screen.style.display = 'none';
      }, 700);
    }

    if (prefersReducedMotion) {
      if (numberEl) numberEl.textContent = '100';
      if (barEl) barEl.style.width = '100%';
      setTimeout(dismissScreen, 200);
      return;
    }

    let startTime = null;
    let lastPercent = -1;
    let frameId = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(1, elapsed / durationMs);
      const easedProgress = easeOutCubic(rawProgress);

      const percent = Math.min(100, Math.floor(easedProgress * 100));

      if (percent !== lastPercent) {
        lastPercent = percent;
        if (numberEl) {
          numberEl.textContent = String(percent);
        }
        if (barEl) {
          barEl.style.width = percent + '%';
        }
      }

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Guaranteed 100% completion
        if (numberEl) numberEl.textContent = '100';
        if (barEl) barEl.style.width = '100%';

        // Hold briefly at 100% so user sees full load before smooth entrance
        setTimeout(dismissScreen, 220);
      }
    }

    frameId = requestAnimationFrame(tick);

    // Safety fallback: if anything hangs, dismiss automatically
    setTimeout(function () {
      if (!screen.classList.contains('loading-screen--done')) {
        if (frameId) cancelAnimationFrame(frameId);
        dismissScreen();
      }
    }, durationMs + 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingScreen);
  } else {
    initLoadingScreen();
  }

  // Handle Shopify Theme Editor events cleanly
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function () {
      const screen = document.getElementById('AuraLoadingScreen');
      if (screen && screen.classList.contains('loading-screen--done')) {
        screen.style.display = 'none';
      }
    });
  }
})();
