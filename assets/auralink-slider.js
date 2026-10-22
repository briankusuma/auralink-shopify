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

    initEntrance() {
      if ((window.Shopify && window.Shopify.designMode) || !this.animate) return;
      this.motionMedia = window.matchMedia('(min-width: 990px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
      this.onMotionChange = () => {
        this.resetEntrance();
        if (this.motionMedia.matches) this.prepareEntrance();
      };
      this.motionMedia.addEventListener('change', this.onMotionChange);
      this.onMotionChange();
    }

    finishEntrance() {
      if (this.motionEvents) this.motionEvents.abort();
      cancelAnimationFrame(this.entranceFrame);
      clearTimeout(this.entranceWatchdog);
      (this.entranceAnimations || []).forEach((animation) => animation.cancel());
      this.entranceAnimations = [];
      if (this.entranceCover) this.entranceCover.remove();
      this.entranceCover = null;
      if (this.wrapper) this.wrapper.classList.remove('is-slider-entering');
      this.entrancePending = false;
      this.inert = false;
    }

    resetEntrance() {
      this.entranceVersion = (this.entranceVersion || 0) + 1;
      this.finishEntrance();
      if (this.wrapper) this.wrapper.classList.remove('is-slider-sequenced');
      if (this.entranceSection) this.entranceSection.classList.remove('is-slider-pin');
    }

    prepareEntrance() {
      this.wrapper = this.closest('.auralink-slider-wrapper');
      const active = this.slides[this.currentIndex];
      const media = active.querySelector('.auralink-slider__media');
      if (!this.wrapper || !media) return;
      try {
        this.entranceSection = this.wrapper.closest('.shopify-section');
        if (!this.entranceSection) return;
        // CSS keeps the scene in view; no dynamic script loading or pin wrappers.
        this.entranceSection.classList.add('is-slider-pin');
        this.wrapper.classList.add('is-slider-sequenced', 'is-slider-entering');
        this.entrancePending = true;
        this.inert = true;
        this.entranceAnimations = [];
        this.entranceStarted = false;
        const cover = document.createElement('div');
        cover.className = 'auralink-slider__entrance-cover';
        cover.setAttribute('aria-hidden', 'true');
        cover.appendChild(media.cloneNode(true));
        // A cloned lazy image must load before its section reaches the viewport.
        const image = cover.querySelector('img');
        if (image) {
          image.loading = 'eager';
          const original = media.querySelector('img');
          if (original.currentSrc) {
            image.removeAttribute('srcset');
            image.src = original.currentSrc;
          }
        }
        this.wrapper.appendChild(cover);
        this.entranceCover = cover;
        this.motionEvents = new AbortController();
        const signal = this.motionEvents.signal;
        const version = this.entranceVersion;
        const check = () => {
          this.entranceFrame = null;
          if (!this.entrancePending) return;
          const rect = this.entranceSection.getBoundingClientRect();
          if (rect.bottom <= 0) { this.finishEntrance(); return; }
          if (this.entranceStarted) return;
          if (rect.top <= 1) {
            this.entranceStarted = true;
            // Bound image readiness: a failed or stalled image never locks navigation.
            this.entranceWatchdog = setTimeout(() => this.finishEntrance(), 5500);
            const ready = image && image.decode ? image.decode() : Promise.resolve();
            ready.then(() => {
              if (version === this.entranceVersion && this.entrancePending) this.playEntrance(active, media);
            }).catch(() => {
              if (version === this.entranceVersion) this.finishEntrance();
            });
          }
        };
        window.addEventListener('scroll', () => {
          if (!this.entranceFrame) this.entranceFrame = requestAnimationFrame(check);
        }, { passive: true, signal });
        window.addEventListener('resize', () => {
          // Use the responsive carousel immediately rather than land on stale bounds.
          if (this.entranceStarted) this.finishEntrance();
        }, { passive: true, signal });
        this.entranceFrame = requestAnimationFrame(check);
      } catch (error) {
        this.resetEntrance();
      }
    }

    playEntrance(active, media) {
      try {
        const cover = this.entranceCover;
        const outer = this.wrapper.getBoundingClientRect();
        const target = media.getBoundingClientRect();
        const header = this.wrapper.querySelector('.auralink-slider__header');
        const left = this.querySelector('[data-slot="left"]');
        const right = this.querySelector('[data-slot="right"]');
        const content = active.querySelectorAll('.auralink-slider__number, .auralink-slider__content, .auralink-slider__overlay');
        const nav = this.querySelector('.auralink-slider__nav-container');
        const animate = (el, frames, delay, duration) => {
          if (!el) return null;
          const animation = el.animate(frames, {
            delay, duration, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'both'
          });
          this.entranceAnimations.push(animation);
          return animation;
        };
        const shrink = animate(cover, [
          { left: '0px', top: '0px', width: outer.width + 'px', height: outer.height + 'px', borderRadius: '0px' },
          { left: (target.left - outer.left) + 'px', top: (target.top - outer.top) + 'px', width: target.width + 'px', height: target.height + 'px', borderRadius: '32px' }
        ], 300, 1650);
        // Keep the real image underneath; remove the cover only at the matching bounds.
        shrink.finished.then(() => cover.remove()).catch(() => {});
        const rise = [{ opacity: 0, translate: '0 36px' }, { opacity: 1, translate: '0 0' }];
        animate(header, rise, 1650, 850);
        animate(left, [{ opacity: 0, translate: '-120px 0' }, { opacity: 1, translate: '0 0' }], 1700, 1000);
        animate(right, [{ opacity: 0, translate: '120px 0' }, { opacity: 1, translate: '0 0' }], 1800, 1000);
        content.forEach((el, index) => animate(el, rise, 1950 + index * 60, 1000));
        animate(nav, [{ opacity: 0 }, { opacity: 1 }], 2350, 1100);
        // Native translate composes with the carousel's existing transform rules.
        const version = this.entranceVersion;
        Promise.all(this.entranceAnimations.map((animation) => animation.finished)).then(() => {
          if (version === this.entranceVersion) this.finishEntrance();
        }).catch(() => {});
      } catch (error) {
        this.finishEntrance();
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
