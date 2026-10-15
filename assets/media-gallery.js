if (!customElements.get('media-gallery')) {
  customElements.define(
    'media-gallery',
    class MediaGallery extends HTMLElement {
      constructor() {
        super();
        this.elements = {
          liveRegion: this.querySelector('[id^="GalleryStatus"]'),
          viewer: this.querySelector('[id^="GalleryViewer"]'),
          thumbnails: this.querySelector('[id^="GalleryThumbnails"]') || this.querySelector('.thumbnail-slider'),
        };
        this.mql = window.matchMedia('(min-width: 750px)');

        this.initViewerNavigation();

        if (!this.elements.thumbnails) return;

        this.elements.viewer.addEventListener('slideChanged', debounce(this.onSlideChanged.bind(this), 500));
        this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
          const btn = mediaToSwitch.querySelector('button') || mediaToSwitch;
          btn.addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false));
        });
        if (this.dataset.desktopLayout && this.dataset.desktopLayout.includes('thumbnail') && this.mql.matches) this.removeListSemantic();
      }

      initViewerNavigation() {
        if (!this.elements.viewer) return;
        const prevBtn = this.elements.viewer.querySelector('.slider-buttons button[name="previous"]');
        const nextBtn = this.elements.viewer.querySelector('.slider-buttons button[name="next"]');

        if (prevBtn) {
          prevBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.stepActiveMedia(-1);
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.stepActiveMedia(1);
          });
        }
      }

      stepActiveMedia(direction) {
        const allMedia = Array.from(this.elements.viewer.querySelectorAll('[data-media-id]'));
        if (allMedia.length < 2) return;
        let activeIndex = allMedia.findIndex((el) => el.classList.contains('is-active'));
        if (activeIndex === -1) activeIndex = 0;
        let nextIndex = activeIndex + direction;
        if (nextIndex < 0) nextIndex = allMedia.length - 1;
        if (nextIndex >= allMedia.length) nextIndex = 0;
        const targetMedia = allMedia[nextIndex];
        if (targetMedia && targetMedia.dataset.mediaId) {
          this.setActiveMedia(targetMedia.dataset.mediaId, false);
        }
      }

      onSlideChanged(event) {
        if (!this.elements.thumbnails) return;
        const thumbnail = this.elements.thumbnails.querySelector(
          `[data-target="${event.detail.currentElement.dataset.mediaId}"]`
        );
        this.setActiveThumbnail(thumbnail);
        const currentCounter = this.elements.viewer.querySelector('.slider-counter--current');
        if (currentCounter && event.detail.currentPage) {
          currentCounter.textContent = event.detail.currentPage;
        }
      }

      setActiveMedia(mediaId, prepend) {
        const activeMedia =
          this.elements.viewer.querySelector(`[data-media-id="${mediaId}"]`) ||
          this.elements.viewer.querySelector('[data-media-id]');
        if (!activeMedia) {
          return;
        }
        this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
          element.classList.remove('is-active');
        });
        activeMedia?.classList?.add('is-active');

        // Update pagination counter
        const allMedia = Array.from(this.elements.viewer.querySelectorAll('[data-media-id]'));
        const activeIndex = allMedia.findIndex((el) => el === activeMedia);
        const currentCounter = this.elements.viewer.querySelector('.slider-counter--current');
        const totalCounter = this.elements.viewer.querySelector('.slider-counter--total');
        if (currentCounter && activeIndex !== -1) {
          currentCounter.textContent = activeIndex + 1;
        }
        if (totalCounter && allMedia.length > 0) {
          totalCounter.textContent = allMedia.length;
        }

        if (prepend) {
          activeMedia.parentElement.firstChild !== activeMedia && activeMedia.parentElement.prepend(activeMedia);

          if (this.elements.thumbnails) {
            const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
            if (activeThumbnail) {
              activeThumbnail.parentElement.firstChild !== activeThumbnail && activeThumbnail.parentElement.prepend(activeThumbnail);
            }
          }

          if (this.elements.viewer.slider) this.elements.viewer.resetPages();
        }

        this.preventStickyHeader();
        window.setTimeout(() => {
          if (!this.mql.matches || this.elements.thumbnails) {
            activeMedia.parentElement.scrollTo({ left: activeMedia.offsetLeft, behavior: 'smooth' });
          }
          const activeMediaRect = activeMedia.getBoundingClientRect();
          // Don't scroll if the image is already in view
          if (activeMediaRect.top > -0.5) return;
          const top = activeMediaRect.top + window.scrollY;
          window.scrollTo({ top: top, behavior: 'smooth' });
        });
        this.playActiveMedia(activeMedia);

        if (!this.elements.thumbnails) return;
        const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
        this.setActiveThumbnail(activeThumbnail);
        if (activeThumbnail && activeThumbnail.dataset.mediaPosition) {
          this.announceLiveRegion(activeMedia, activeThumbnail.dataset.mediaPosition);
        }
      }

      setActiveThumbnail(thumbnail) {
        if (!this.elements.thumbnails || !thumbnail) return;

        this.elements.thumbnails
          .querySelectorAll('button')
          .forEach((element) => element.removeAttribute('aria-current'));
        const btn = thumbnail.querySelector('button') || thumbnail;
        btn.setAttribute('aria-current', true);

        if (this.elements.thumbnails.isSlideVisible && this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

        const scrollContainer = this.elements.thumbnails.slider || this.elements.thumbnails.querySelector('ul') || this.elements.thumbnails;
        if (scrollContainer && scrollContainer.scrollTo) {
          scrollContainer.scrollTo({ left: thumbnail.offsetLeft - 24, behavior: 'smooth' });
        }
      }

      announceLiveRegion(activeItem, position) {
        const image = activeItem.querySelector('.product__modal-opener--image img');
        if (!image) return;
        image.onload = () => {
          this.elements.liveRegion.setAttribute('aria-hidden', false);
          this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace('[index]', position);
          setTimeout(() => {
            this.elements.liveRegion.setAttribute('aria-hidden', true);
          }, 2000);
        };
        image.src = image.src;
      }

      playActiveMedia(activeItem) {
        window.pauseAllMedia();
        const deferredMedia = activeItem.querySelector('.deferred-media');
        if (deferredMedia) deferredMedia.loadContent(false);
      }

      preventStickyHeader() {
        this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
        if (!this.stickyHeader) return;
        this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
      }

      removeListSemantic() {
        if (!this.elements.viewer.slider) return;
        this.elements.viewer.slider.setAttribute('role', 'presentation');
        this.elements.viewer.sliderItems.forEach((slide) => slide.setAttribute('role', 'presentation'));
      }
    }
  );
}
