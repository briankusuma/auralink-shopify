/**
 * AuraLink Testimonials Autoslider Component
 * Native Web Component with automatic sliding, pause on hover/focus,
 * dot indicators, and touch swipe accessibility.
 */

if (!customElements.get('auralink-testimonials')) {
  class AuraLinkTestimonials extends HTMLElement {
    constructor() {
      super();
      this.currentIndex = 0;
      this.timer = null;
      this.autoplaySpeed = parseInt(this.dataset.autoplaySpeed || '5000', 10);
      this.isPaused = false;
      this.startX = 0;
      this.currentX = 0;
      this.isSwiping = false;
    }

    connectedCallback() {
      this.slides = Array.from(this.querySelectorAll('.auralink-testimonials__slide'));
      this.dots = Array.from(this.querySelectorAll('.auralink-testimonials__dot'));

      if (this.slides.length <= 1) return;

      this.initEvents();
      this.startAutoplay();
    }

    initEvents() {
      // Dot indicators
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          this.goTo(index);
          this.restartAutoplay();
        });
      });

      // Pause on hover
      this.addEventListener('mouseenter', () => this.pause());
      this.addEventListener('mouseleave', () => this.resume());

      // Pause on focus
      this.addEventListener('focusin', () => this.pause());
      this.addEventListener('focusout', () => this.resume());

      // Keyboard navigation
      this.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
          this.restartAutoplay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
          this.restartAutoplay();
        }
      });

      // Touch swipe
      this.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        this.startX = e.touches[0].clientX;
        this.currentX = this.startX;
        this.isSwiping = true;
        this.pause();
      }, { passive: true });

      this.addEventListener('touchmove', (e) => {
        if (!this.isSwiping) return;
        this.currentX = e.touches[0].clientX;
      }, { passive: true });

      this.addEventListener('touchend', () => {
        if (!this.isSwiping) return;
        this.isSwiping = false;
        const diff = this.currentX - this.startX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            this.next();
          } else {
            this.prev();
          }
        }
        this.resume();
      });

      // Shopify Theme Editor Integration
      document.addEventListener('shopify:block:select', (e) => {
        const selectedIndex = this.slides.findIndex((s) => s.id === `Testimonial-${e.detail.sectionId}-${e.detail.blockId}`);
        if (selectedIndex >= 0) {
          this.goTo(selectedIndex);
          this.pause();
        }
      });

      document.addEventListener('shopify:block:deselect', () => {
        this.resume();
      });
    }

    startAutoplay() {
      this.clearAutoplay();
      if (this.autoplaySpeed <= 0) return;
      this.timer = setInterval(() => {
        if (!this.isPaused) {
          this.next();
        }
      }, this.autoplaySpeed);
    }

    clearAutoplay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    restartAutoplay() {
      this.clearAutoplay();
      this.startAutoplay();
    }

    pause() {
      this.isPaused = true;
    }

    resume() {
      this.isPaused = false;
    }

    next() {
      this.goTo((this.currentIndex + 1) % this.slides.length);
    }

    prev() {
      this.goTo((this.currentIndex - 1 + this.slides.length) % this.slides.length);
    }

    goTo(index) {
      if (index < 0 || index >= this.slides.length) return;
      this.currentIndex = index;

      this.slides.forEach((slide, idx) => {
        const isActive = idx === this.currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', (!isActive).toString());
      });

      this.dots.forEach((dot, idx) => {
        const isActive = idx === this.currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    disconnectedCallback() {
      this.clearAutoplay();
    }
  }

  customElements.define('auralink-testimonials', AuraLinkTestimonials);
}
