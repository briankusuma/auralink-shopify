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
      const active = this.slides.findIndex((slide) => slide.classList.contains('is-active'));
      this.currentIndex = active >= 0 ? active : 0;
      this.slides.forEach((slide, index) => { slide.inert = index !== this.currentIndex; });

      if (this.slides.length <= 1) return;

      this.initEvents();
      this.isInView = true;
      this.viewObserver = new IntersectionObserver((entries) => {
        this.isInView = entries[0].isIntersecting;
        if (this.isInView) this.startAutoplay();
        else this.clearAutoplay();
      });
      this.viewObserver.observe(this);
      this.startAutoplay();
    }

    initEvents() {
      this.eventController = new AbortController();
      const listen = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: this.eventController.signal });
      // Dot indicators
      this.dots.forEach((dot, index) => {
        listen(dot, 'click', (e) => {
          e.preventDefault();
          this.goTo(index);
          this.restartAutoplay();
        });
      });

      // Pause on hover
      listen(this, 'mouseenter', () => this.pause());
      listen(this, 'mouseleave', () => this.resume());

      // Pause on focus
      listen(this, 'focusin', () => this.pause());
      listen(this, 'focusout', () => this.resume());

      // Keyboard navigation
      listen(this, 'keydown', (e) => {
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
      listen(this, 'touchstart', (e) => {
        if (e.touches.length !== 1) return;
        this.startY = e.touches[0].clientY;
        this.currentY = this.startY;
        this.startX = e.touches[0].clientX;
        this.currentX = this.startX;
        this.isSwiping = true;
        this.pause();
      }, { passive: true });

      listen(this, 'touchmove', (e) => {
        if (!this.isSwiping) return;
        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;
      }, { passive: true });

      listen(this, 'touchend', () => {
        if (!this.isSwiping) return;
        this.isSwiping = false;
        const diff = this.currentX - this.startX;
        if (Math.abs(diff) > 40 && Math.abs(diff) > Math.abs(this.currentY - this.startY) * 1.2) {
          if (diff < 0) {
            this.next();
          } else {
            this.prev();
          }
        }
        this.resume();
      });

      listen(this, 'touchcancel', () => { this.isSwiping = false; this.resume(); });
      listen(document, 'visibilitychange', () => {
        if (document.hidden) this.clearAutoplay();
        else this.startAutoplay();
      });

      // Shopify Theme Editor Integration
      listen(document, 'shopify:block:select', (e) => {
        const selectedIndex = this.slides.findIndex((s) => s.id === `Testimonial-${e.detail.sectionId}-${e.detail.blockId}`);
        if (selectedIndex >= 0) {
          this.goTo(selectedIndex);
          this.pause();
        }
      });

      listen(document, 'shopify:block:deselect', () => {
        this.resume();
      });
    }

    startAutoplay() {
      this.clearAutoplay();
      if (this.autoplaySpeed <= 0 || this.isInView === false || document.hidden || (window.Shopify && window.Shopify.designMode) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      if (this.slides.length < 2) return;
      this.goTo((this.currentIndex + 1) % this.slides.length);
    }

    prev() {
      if (this.slides.length < 2) return;
      this.goTo((this.currentIndex - 1 + this.slides.length) % this.slides.length);
    }

    goTo(index) {
      if (!Number.isInteger(index) || index === this.currentIndex || index < 0 || index >= this.slides.length) return;
      this.currentIndex = index;

      this.slides.forEach((slide, idx) => {
        const isActive = idx === this.currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.inert = !isActive;
        slide.setAttribute('aria-hidden', (!isActive).toString());
      });

      this.dots.forEach((dot, idx) => {
        const isActive = idx === this.currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });

      // Replay 1.0s liquid text reveal animation on the incoming active slide
      const activeSlide = this.slides[this.currentIndex];
      if (activeSlide) {
        // The shared engine handles this event once; do not also replay directly.
        activeSlide.dispatchEvent(new CustomEvent('auralink:slide:active', { bubbles: true }));
      }
    }

    disconnectedCallback() {
      this.clearAutoplay();
      if (this.eventController) this.eventController.abort();
      if (this.viewObserver) this.viewObserver.disconnect();
    }
  }

  customElements.define('auralink-testimonials', AuraLinkTestimonials);
}
