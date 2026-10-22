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
      if (this.prevBtn) this.prevBtn.disabled = this.slides.length < 2;
      if (this.nextBtn) this.nextBtn.disabled = this.slides.length < 2;

      // Find initial active index
      const initialActiveIndex = this.slides.findIndex(
        (s) => s.getAttribute('data-slot') === 'center' || s.classList.contains('is-active')
      );
      this.currentIndex = initialActiveIndex >= 0 ? initialActiveIndex : 0;

      this.initEvents();
      this.updateSlots(0, true);
      this.initSizing();
      this.initEntrance();
    }

    disconnectedCallback() {
      if (this.events) this.events.abort();
      if (this.motionMedia) this.motionMedia.removeEventListener('change', this.onMotionChange);
      this.resetEntrance();
      if (this.sizeObserver) this.sizeObserver.disconnect();
      cancelAnimationFrame(this.sizingFrame);
      clearTimeout(this.navigationTimer);
      this.isAnimating = false;
    }

    initSizing() {
      this.sizingMedia = window.matchMedia('(max-width: 768px)');
      this.sizeObserver = new ResizeObserver(() => this.updateStageHeight());
      this.slides.forEach((slide) => this.sizeObserver.observe(slide));
      window.addEventListener('resize', () => this.updateStageHeight(), { passive: true, signal: this.events.signal });
      this.updateStageHeight();
    }

    updateStageHeight() {
      if (!this.sizingMedia || this.sizingFrame) return;
      this.sizingFrame = requestAnimationFrame(() => {
        this.sizingFrame = null;
        if (!this.isConnected) return;
        if (!this.sizingMedia.matches) {
          this.style.removeProperty('--slide-stage-height');
          return;
        }
        const height = Math.ceil(this.slides[this.currentIndex].offsetHeight);
        if (height > 0 && this.style.getPropertyValue('--slide-stage-height') !== height + 'px') {
          this.style.setProperty('--slide-stage-height', height + 'px');
        }
      });
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
      this.entranceFrame = null;
      this.clearEntranceEffects();
      if (this.wrapper) this.wrapper.classList.remove('is-slider-entering');
      this.entrancePending = false;
      this.inert = false;
    }

    resetEntrance() {
      this.finishEntrance();
      if (this.wrapper) this.wrapper.classList.remove('is-slider-sequenced');
      if (this.entranceSection) this.entranceSection.classList.remove('is-slider-pin');
    }

    prepareEntrance() {
      this.wrapper = this.closest('.auralink-slider-wrapper');
      if (!this.wrapper) return;
      try {
        this.entranceSection = this.wrapper.closest('.shopify-section');
        if (!this.entranceSection) return;
        this.entranceSection.classList.add('is-slider-pin');
        this.wrapper.classList.add('is-slider-sequenced');
        this.entranceProgress = null;
        this.entranceLastTime = null;
        this.entranceAnimations = [];
        this.motionEvents = new AbortController();
        const signal = this.motionEvents.signal;
        const tick = (now) => {
          this.entranceFrame = null;
          try {
            const rect = this.entranceSection.getBoundingClientRect();
            const span = Math.max(1, this.entranceSection.offsetHeight - this.wrapper.offsetHeight);
            const target = Math.max(0, Math.min(1, -rect.top / span));
            const elapsed = Math.min(64, Math.max(1, now - (this.entranceLastTime || now - 16)));
            this.entranceLastTime = now;
            const previous = this.entranceProgress;
            const follow = window.AuraLinkSmoothScroll && window.AuraLinkSmoothScroll.active ? 1 : 1 - Math.exp(-elapsed / 100);
            let progress = previous === null ? target : previous + (target - previous) * follow;
            if (Math.abs(progress - target) < 0.0005) progress = target;
            this.entranceProgress = progress;
            this.renderEntrance(progress);
            if (progress !== target) this.entranceFrame = requestAnimationFrame(tick);
          } catch (error) {
            this.resetEntrance();
          }
        };
        const schedule = () => {
          if (!this.entranceFrame) this.entranceFrame = requestAnimationFrame(tick);
        };
        window.addEventListener('scroll', schedule, { passive: true, signal });
        window.addEventListener('resize', () => {
          this.clearEntranceEffects();
          this.entranceLastTime = null;
          schedule();
        }, { passive: true, signal });
        window.addEventListener('auralink:layout', () => {
          this.clearEntranceEffects();
          schedule();
        }, { signal });
        schedule();
      } catch (error) {
        this.resetEntrance();
      }
    }

    clearEntranceEffects() {
      if (this.coverEvents) this.coverEvents.abort();
      (this.entranceAnimations || []).forEach((animation) => animation.cancel());
      this.entranceAnimations = [];
      if (this.entranceCover) this.entranceCover.remove();
      this.entranceCover = null;
    }

    renderEntrance(progress) {
      if (progress >= 1) {
        // Release all effects so carousel slot changes retain their native CSS transforms.
        this.clearEntranceEffects();
        this.wrapper.classList.remove('is-slider-entering');
        this.entrancePending = false;
        this.inert = false;
        return;
      }
      if (!this.entranceAnimations.length) this.buildEntrance();
      this.entrancePending = true;
      this.inert = true;
      const time = progress * 3450;
      this.entranceAnimations.forEach((animation) => { animation.currentTime = time; });
      // The clone is hidden only while it exactly overlaps the underlying card.
      this.entranceCover.style.visibility = time >= 1950 ? 'hidden' : 'visible';
    }

    buildEntrance() {
      const active = this.slides[this.currentIndex];
      const media = active.querySelector('.auralink-slider__media');
      if (!media) throw new Error('Slider media unavailable');
      this.wrapper.classList.add('is-slider-entering');
      const cover = document.createElement('div');
      cover.className = 'auralink-slider__entrance-cover';
      cover.setAttribute('aria-hidden', 'true');
      cover.appendChild(media.cloneNode(true));
      const image = cover.querySelector('img');
      if (image) {
        this.coverEvents = new AbortController();
        image.loading = 'eager';
        const original = media.querySelector('img');
        if (original.currentSrc) {
          image.removeAttribute('srcset');
          image.src = original.currentSrc;
        }
        image.addEventListener('error', () => this.resetEntrance(), { once: true, signal: this.coverEvents.signal });
      }
      this.wrapper.appendChild(cover);
      this.entranceCover = cover;
      const outer = this.wrapper.getBoundingClientRect();
      const nav = this.querySelector('.auralink-slider__nav-container');
      // Navigation bounds always describe the final center slot, even mid-carousel transition.
      const target = (nav || media).getBoundingClientRect();
      const header = this.wrapper.querySelector('.auralink-slider__header');
      const left = this.querySelector('[data-slot="left"]');
      const right = this.querySelector('[data-slot="right"]');
      const content = active.querySelectorAll('.auralink-slider__number, .auralink-slider__content, .auralink-slider__overlay');
      const animate = (el, frames, delay, duration) => {
        if (!el) return;
        const animation = el.animate(frames, {
          delay, duration, easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'both'
        });
        animation.pause();
        animation.currentTime = 0;
        animation.finished.catch(() => {});
        this.entranceAnimations.push(animation);
      };
      animate(cover, [
        { left: '0px', top: '0px', width: outer.width + 'px', height: outer.height + 'px', borderRadius: '0px' },
        { left: (target.left - outer.left) + 'px', top: (target.top - outer.top) + 'px', width: target.width + 'px', height: target.height + 'px', borderRadius: '32px' }
      ], 300, 1650);
      const rise = [{ opacity: 0, translate: '0 36px' }, { opacity: 1, translate: '0 0' }];
      animate(header, rise, 1650, 850);
      animate(left, [{ opacity: 0, translate: '-120px 0' }, { opacity: 1, translate: '0 0' }], 1700, 1000);
      animate(right, [{ opacity: 0, translate: '120px 0' }, { opacity: 1, translate: '0 0' }], 1800, 1000);
      content.forEach((el, index) => animate(el, rise, 1950 + index * 60, 1000));
      animate(nav, [{ opacity: 0 }, { opacity: 1 }], 2350, 1100);
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
        this.stage.addEventListener('touchcancel', () => { this.isSwiping = false; }, options);
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
      this.currentY = this.startY;
      this.currentX = this.startX;
      this.isSwiping = true;
    }

    handleTouchMove(e) {
      if (!this.isSwiping) return;
      this.currentX = e.touches[0].clientX;
      this.currentY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
      if (!this.isSwiping) return;
      this.isSwiping = false;

      const diffX = this.currentX - this.startX;
      if (Math.abs(diffX) > this.touchThreshold && Math.abs(diffX) > Math.abs(this.currentY - this.startY) * 1.2) {
        if (diffX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }

    next() {
      if (this.isAnimating || this.entrancePending || this.slides.length < 2) return;
      this.isAnimating = true;

      const total = this.slides.length;
      this.currentIndex = (this.currentIndex + 1) % total;
      this.updateSlots(1);

      this.navigationTimer = setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }

    prev() {
      if (this.isAnimating || this.entrancePending || this.slides.length < 2) return;
      this.isAnimating = true;

      const total = this.slides.length;
      this.currentIndex = (this.currentIndex - 1 + total) % total;
      this.updateSlots(-1);

      this.navigationTimer = setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }

    goTo(index) {
      if (!Number.isInteger(index) || this.entrancePending || index === this.currentIndex || index < 0 || index >= this.slides.length) return;
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
          // The shared engine handles this event once; do not also replay directly.
          activeSlide.dispatchEvent(new CustomEvent('auralink:slide:active', { bubbles: true }));
        }
      }
      this.updateStageHeight();
    }
  }

  customElements.define('auralink-slider', AuraLinkSlider);
}
