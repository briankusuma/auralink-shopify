/**
 * AuraLink - Loading Screen Controller
 * Features:
 * - Scramble / rolling text logo resolving from 0% to 100%
 * - Bottom-left count up from 0% to 100%
 * - Schema settings integration (label, duration, text logo, session memory)
 * - Pure vanilla JavaScript adhering to Shopify Theme Store guidelines
 */
(function () {
  'use strict';

  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@*&~<>';

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
      if (logoTextEl) logoTextEl.textContent = targetText;
      setTimeout(dismissScreen, 200);
      return;
    }

    let startTime = null;
    let lastPercent = -1;
    let frameId = null;

    function renderScramble(progressRatio) {
      if (!logoTextEl) return;
      if (progressRatio >= 1) {
        logoTextEl.textContent = targetText;
        return;
      }

      const totalLen = targetText.length;
      const resolvedCount = Math.floor(progressRatio * totalLen);
      let html = '';

      for (let i = 0; i < totalLen; i++) {
        const char = targetText[i];
        if (char === ' ') {
          html += ' ';
          continue;
        }

        if (i < resolvedCount) {
          html += '<span class="loading-screen__char--resolved">' + escapeHtml(char) + '</span>';
        } else {
          const randGlyph = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
          html += '<span class="loading-screen__char--scrambled">' + randGlyph + '</span>';
        }
      }

      logoTextEl.innerHTML = html;
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

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

      renderScramble(easedProgress);

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Guaranteed 100% completion
        if (numberEl) numberEl.textContent = '100';
        if (barEl) barEl.style.width = '100%';
        if (logoTextEl) logoTextEl.textContent = targetText;

        // Brief hold so user sees full logo & 100% before transition
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
