/**
 * AuraLink Showcase Slider Component
 * Position-based 3D slot carousel ensuring active slide is ALWAYS mathematically centered.
 */

if (!customElements.get('auralink-slider')) {
  class AuraLinkSlider extends HTMLElement {
    constructor() {
      super();
      this.currentIndex = 0;
      this.isSwiping = false;
      this.startX = 0;
      this.startY = 0;
      this.currentX = 0;
      this.touchThreshold = 40;
      this.isAnimating = false;
    }

    connectedCallback() {
      this.stage = this.querySelector('.auralink-slider__stage');
      this.slides = Array.from(this.querySelectorAll('.auralink-slider__slide'));
      this.prevBtn = this.querySelector('.auralink-slider__nav-btn--prev');
      this.nextBtn = this.querySelector('.auralink-slider__nav-btn--next');

      if (this.slides.length === 0) return;

      // Find initial active index
      const initialActiveIndex = this.slides.findIndex(
        (s) => s.getAttribute('data-slot') === 'center' || s.classList.contains('is-active')
      );
      this.currentIndex = initialActiveIndex >= 0 ? initialActiveIndex : 0;

      this.initEvents();
      this.updateSlots(0, true);
      this.initEntrance();
    }

    disconnectedCallback() {
      if (this.events) this.events.abort();
      if (this.motionMedia) this.motionMedia.removeEventListener('change', this.onMotionChange);
      this.resetEntrance();
      clearTimeout(this.navigationTimer);
      this.isAnimating = false;
    }

    async loadMotionLibrary(url, key) {
      if (window[key]) return;
      await new Promise((resolve, reject) => {
        const src = new URL(url, window.location.href).href;
        let script = Array.from(document.scripts).find((item) => item.src === src);
        const exists = Boolean(script);
        if (!script) script = document.createElement('script');
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', reject, { once: true });
        if (!exists) { script.src = src; document.head.appendChild(script); }
      });
      if (!window[key]) throw new Error('Slider animation library unavailable');
    }

    initEntrance() {
      if (window.Shopify && window.Shopify.designMode) return;
      this.motionMedia = window.matchMedia('(min-width: 990px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
      this.onMotionChange = () => {
        this.resetEntrance();
        if (this.motionMedia.matches) this.prepareEntrance();
      };
      this.motionMedia.addEventListener('change', this.onMotionChange);
      this.onMotionChange();
    }

    resetEntrance() {
      // Invalidate pending image/library work after unload or breakpoint changes.
      this.entranceVersion = (this.entranceVersion || 0) + 1;
      if (this.entranceContext) this.entranceContext.revert();
      this.entranceContext = null;
      if (this.entranceCover) this.entranceCover.remove();
      this.entranceCover = null;
      if (this.wrapper) this.wrapper.classList.remove('is-slider-sequenced', 'is-slider-entering');
      this.entrancePending = false;
      this.inert = false;
    }

    async prepareEntrance() {
      const version = this.entranceVersion;
      this.wrapper = this.closest('.auralink-slider-wrapper');
      const active = this.slides[this.currentIndex];
      const media = active.querySelector('.auralink-slider__media');
      if (!this.wrapper || !media) return;
      this.entrancePending = true;
      this.inert = true;
      try {
        await this.loadMotionLibrary(this.dataset.gsapUrl, 'gsap');
        await this.loadMotionLibrary(this.dataset.scrolltriggerUrl, 'ScrollTrigger');
        if (version !== this.entranceVersion || !this.isConnected) return;
        const image = media.querySelector('img');
        if (image && image.decode) await image.decode().catch(() => {});
        if (version !== this.entranceVersion || !this.isConnected) return;
        const gsap = window.gsap;
        gsap.registerPlugin(window.ScrollTrigger);
        this.wrapper.classList.add('is-slider-sequenced', 'is-slider-entering');
        const cover = document.createElement('div');
        cover.className = 'auralink-slider__entrance-cover';
        cover.setAttribute('aria-hidden', 'true');
        cover.appendChild(media.cloneNode(true));
        this.wrapper.appendChild(cover);
        this.entranceCover = cover;
        const header = this.wrapper.querySelector('.auralink-slider__header');
        const left = this.querySelector('[data-slot="left"]');
        const right = this.querySelector('[data-slot="right"]');
        const content = active.querySelectorAll('.auralink-slider__number, .auralink-slider__content, .auralink-slider__overlay');
        const nav = this.querySelector('.auralink-slider__nav-container');
        const section = this.wrapper.closest('.shopify-section') || this.wrapper;
        let destination;
        const measure = () => {
          const outer = this.wrapper.getBoundingClientRect();
          const inner = media.getBoundingClientRect();
          destination = { x: inner.left - outer.left, y: inner.top - outer.top, width: inner.width, height: inner.height };
        };
        measure();
        this.entranceContext = gsap.context(() => {
          const hidden = [header, left, right, nav, ...content].filter(Boolean);
          gsap.set(hidden, { autoAlpha: 0 });
          const intro = gsap.timeline({
            paused: true,
            defaults: { ease: 'power3.inOut' },
            onComplete: () => {
              gsap.set(hidden, { clearProps: 'transform,opacity,visibility' });
              this.wrapper.classList.remove('is-slider-entering');
              this.entrancePending = false;
              this.inert = false;
            }
          });
          intro.fromTo(cover, {
            x: 0, y: 0, width: () => this.wrapper.clientWidth,
            height: () => this.wrapper.clientHeight, borderRadius: 0
          }, {
            x: () => destination.x, y: () => destination.y,
            width: () => destination.width, height: () => destination.height,
            borderRadius: 32, duration: 1.65
          }, 0.3);
          // The same image covers the real slide until both rectangles match exactly.
          intro.set(cover, { autoAlpha: 0 }, 1.96);
          if (header) intro.fromTo(header, { y: 40 }, { y: 0, autoAlpha: 1, duration: 0.85 }, 1.65);
          if (left) intro.fromTo(left, { x: -120 }, { x: 0, autoAlpha: 1, duration: 1 }, 1.7);
          if (right) intro.fromTo(right, { x: 120 }, { x: 0, autoAlpha: 1, duration: 1 }, 1.8);
          intro.fromTo(content, { y: 28 }, { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.06 }, 1.95);
          if (nav) intro.to(nav, { autoAlpha: 1, duration: 0.5 }, 2.35);
          intro.call(() => {
            if (window.AuraLinkLiquidReveal) {
              if (header) window.AuraLinkLiquidReveal.replay(header);
              window.AuraLinkLiquidReveal.replay(active);
            }
          }, null, 1.95);
          // Let the shared one-second liquid reveal finish before enabling input.
          intro.to({}, { duration: 0.6 }, 2.85);
          window.ScrollTrigger.create({
            trigger: section, pin: section, pinSpacing: true,
            start: 'top top', end: () => '+=' + Math.round(this.wrapper.clientHeight * 0.65),
            refreshPriority: -3,
            onEnter: () => intro.play(),
            onEnterBack: () => intro.play(),
            onLeave: () => intro.progress(1),
            onRefreshInit: () => {
              if (!this.entrancePending) return;
              measure();
              intro.invalidate().render(intro.time(), true, true);
            }
          });
        }, this.wrapper);
        window.ScrollTrigger.sort();
        window.ScrollTrigger.refresh();
      } catch (error) {
        if (version === this.entranceVersion) this.resetEntrance();
      }
    }

    initEvents() {
      this.events = new AbortController();
      const options = { signal: this.events.signal };
      // Navigation buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.prev();
        }, options);
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.next();
        }, options);
      }

      // Slide click interaction
      this.slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
          if (this.entrancePending) { e.preventDefault(); return; }
          const slot = slide.getAttribute('data-slot');
          if (slot === 'center') {
            // Click inside active card: if link/button, let it navigate
            return;
          }

          e.preventDefault();
          if (slot === 'left') {
            this.prev();
          } else if (slot === 'right') {
            this.next();
          } else {
            this.goTo(index);
          }
        }, options);
      });

      // Keyboard accessibility
      this.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      }, options);

      // Touch / Swipe support
      if (this.stage) {
        this.stage.addEventListener('touchstart', (e) => this.handleTouchStart(e), { ...options, passive: true });
        this.stage.addEventListener('touchmove', (e) => this.handleTouchMove(e), { ...options, passive: true });
        this.stage.addEventListener('touchend', (e) => this.handleTouchEnd(e), options);
      }

      // Shopify Theme Editor integration
      document.addEventListener('shopify:block:select', (e) => {
        const selectedIndex = this.slides.findIndex((s) => s.id === `Slide-${e.detail.sectionId}-${e.detail.blockId}`);
        if (selectedIndex >= 0) {
          this.goTo(selectedIndex);
        }
      }, options);
    }

    handleTouchStart(e) {
      if (this.entrancePending || e.touches.length !== 1) return;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.currentX = this.startX;
      this.isSwiping = true;
    }

    handleTouchMove(e) {
      if (!this.isSwiping) return;
      this.currentX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
      if (!this.isSwiping) return;
      this.isSwiping = false;

      const diffX = this.currentX - this.startX;
      if (Math.abs(diffX) > this.touchThreshold) {
        if (diffX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }

    next() {
      if (this.isAnimating || this.entrancePending) return;
      this.isAnimating = true;

      const total = this.slides.length;
      this.currentIndex = (this.currentIndex + 1) % total;
      this.updateSlots(1);

      this.navigationTimer = setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }

    prev() {
      if (this.isAnimating || this.entrancePending) return;
      this.isAnimating = true;

      const total = this.slides.length;
      this.currentIndex = (this.currentIndex - 1 + total) % total;
      this.updateSlots(-1);

      this.navigationTimer = setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }

    goTo(index) {
      if (this.entrancePending || index === this.currentIndex || index < 0 || index >= this.slides.length) return;
      const direction = index > this.currentIndex ? 1 : -1;
      this.currentIndex = index;
      this.updateSlots(direction);
    }

    updateSlots(direction = 0, immediate = false) {
      const total = this.slides.length;
      if (total === 0) return;

      const current = this.currentIndex;
      const prevIdx = (current - 1 + total) % total;
      const nextIdx = (current + 1) % total;

      // When moving forward (direction > 0): the slide coming to nextIdx was at prevIdx.
      // Reposition it at 'right' instantly without flying across the center!
      if (direction > 0 && !immediate) {
        const repositionSlide = this.slides[nextIdx];
        if (repositionSlide) {
          repositionSlide.classList.add('no-transition');
          repositionSlide.setAttribute('data-slot', 'right');
          repositionSlide.style.opacity = '0';
          void repositionSlide.offsetWidth; // force reflow
          requestAnimationFrame(() => {
            repositionSlide.classList.remove('no-transition');
            repositionSlide.style.opacity = '';
          });
        }
      } else if (direction < 0 && !immediate) {
        // When moving backward (direction < 0): the slide coming to prevIdx was at nextIdx.
        // Reposition it at 'left' instantly without flying across the center!
        const repositionSlide = this.slides[prevIdx];
        if (repositionSlide) {
          repositionSlide.classList.add('no-transition');
          repositionSlide.setAttribute('data-slot', 'left');
          repositionSlide.style.opacity = '0';
          void repositionSlide.offsetWidth; // force reflow
          requestAnimationFrame(() => {
            repositionSlide.classList.remove('no-transition');
            repositionSlide.style.opacity = '';
          });
        }
      }

      this.slides.forEach((slide, idx) => {
        if (immediate) {
          slide.classList.add('no-transition');
        }

        if (idx === current) {
          slide.setAttribute('data-slot', 'center');
          slide.setAttribute('aria-hidden', 'false');
          slide.setAttribute('tabindex', '0');
        } else if (idx === prevIdx) {
          slide.setAttribute('data-slot', 'left');
          slide.setAttribute('aria-hidden', 'true');
          slide.setAttribute('tabindex', '-1');
        } else if (idx === nextIdx) {
          slide.setAttribute('data-slot', 'right');
          slide.setAttribute('aria-hidden', 'true');
          slide.setAttribute('tabindex', '-1');
        } else {
          slide.setAttribute('data-slot', 'hidden');
          slide.setAttribute('aria-hidden', 'true');
          slide.setAttribute('tabindex', '-1');
        }

        if (immediate) {
          void slide.offsetWidth;
          requestAnimationFrame(() => {
            slide.classList.remove('no-transition');
          });
        }
      });

      if (!immediate) {
        const activeSlide = this.slides[current];
        if (activeSlide) {
          if (window.AuraLinkLiquidReveal && typeof window.AuraLinkLiquidReveal.replay === 'function') {
            window.AuraLinkLiquidReveal.replay(activeSlide);
          }
          activeSlide.dispatchEvent(new CustomEvent('auralink:slide:active', { bubbles: true }));
        }
      }
    }
  }

  customElements.define('auralink-slider', AuraLinkSlider);
}
