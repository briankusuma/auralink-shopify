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
    }

    initEvents() {
      // Navigation buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.prev();
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.next();
        });
      }

      // Slide click interaction
      this.slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
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
        });
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
      });

      // Touch / Swipe support
      if (this.stage) {
        this.stage.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.stage.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.stage.addEventListener('touchend', (e) => this.handleTouchEnd(e));
      }

      // Shopify Theme Editor integration
      document.addEventListener('shopify:block:select', (e) => {
        const selectedIndex = this.slides.findIndex((s) => s.id === `Slide-${e.detail.sectionId}-${e.detail.blockId}`);
        if (selectedIndex >= 0) {
          this.goTo(selectedIndex);
        }
      });
    }

    handleTouchStart(e) {
      if (e.touches.length !== 1) return;
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
      if (this.isAnimating) return;
      this.isAnimating = true;

      const total = this.slides.length;
      this.currentIndex = (this.currentIndex + 1) % total;
      this.updateSlots(1);

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }

    prev() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      const total = this.slides.length;
      this.currentIndex = (this.currentIndex - 1 + total) % total;
      this.updateSlots(-1);

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }

    goTo(index) {
      if (index === this.currentIndex || index < 0 || index >= this.slides.length) return;
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
    }
  }

  customElements.define('auralink-slider', AuraLinkSlider);
}
