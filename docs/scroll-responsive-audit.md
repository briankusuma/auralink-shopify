# Scroll and responsive integration — 2026-10-22

Implemented the requested Lenis integration without a transformed page wrapper or fixed document height. Layout still renders header, main and footer as ordinary document siblings; Lenis measures document.documentElement, so the footer is included in the scroll limit. Full visual verification is pending: native browser inventory returns `Sky Computer Use native pipe startup failed`.

## Scroll integration

- Official Lenis 1.3.27 browser distribution and CSS are hosted in assets. MIT notice is preserved. JavaScript is 35,555 bytes, approximately 8,990 bytes gzip; no runtime package/CDN requests.
- One Lenis autoRaf instance on fine-pointer desktop without reduced motion. Native touch scrolling, reduced-motion and Theme Editor fallbacks. Lerp 0.18, no infinite scrolling, normal anchor support.
- Lenis scroll events update ScrollTrigger. Pin refresh, body/HTML size observation, image/font completion, section changes and page restoration recalculate dimensions. The measured content includes the entire footer and inserted spacers.
- Body/loading/modal scroll locks stop/start Lenis. Drawers, search, filters, localization lists, modal content and native form controls bypass smoothing. Alt-wheel and already-consumed wheel events are excluded.
- CTA/slider follow the already-smoothed native position directly while Lenis is active; hero/bento/impact do not add a second scrub delay.
- Ordinary wheel over the radio scrolls the page; Alt-wheel zooms. Knob wheel interaction remains. Radio pixel ratio is capped at 1.5 desktop / 1.25 coarse-pointer to reduce GPU fill cost; this slightly reduces maximum raster sharpness versus the previous cap of 2.

## Responsive source audit

Scanned the layout, section templates and CSS for fixed dimensions, overflow and pinning; inspected custom AuraLink modules, header/footer and product cards. There are 54 section files and no standalone files in blocks/; section blocks and shared rich text/app wrappers remain supported. This source review is not a rendered audit of every configurable block or third-party app.

| Area | Correction / retained behavior | Verification |
| --- | --- | --- |
| Document/footer | Natural document height; nonshrinking section/footer flex items; footer is outside main but inside Lenis content | Actual Lenis dimension tests with growing content and pin spacers |
| Hero/radio | Pinning limited to >=990px wide and >=700px tall; remove initial framing class when media query does not match; native wheel priority and lower DPR | Syntax/source review; rendered appearance pending |
| Bento | Existing mobile/tablet grid; static mobile/editor/reduced-motion fallback; Lenis avoids duplicate scrub | Existing sequence and source review; viewport fit pending |
| Impact | <=480px metrics wrap; logos scale within padded tiles; preserve 160px icon boxes and overlay/count/reverse behavior | Controlled sequence/geometry tests; source review |
| Showcase slider | Active card grows with mobile text; observed height updates stage/nav; horizontal swipe only; one-item navigation disabled; one shared text replay per slide | Mobile height, swipe, resize and lifecycle tests; existing reverse/current-image tests |
| CTA | Mobile flex basis released; image then text in DOM order; card/buttons can shrink/wrap; existing hand/overlay/reveal stages preserved | Controlled sequence/reverse/cleanup tests; source review |
| Testimonials | Shrinkable author/content columns, wrapping tags and author row, 24px dot hit targets; vertical scroll does not swipe; offscreen/hidden autoplay stops; event cleanup | Mobile gesture, visibility, focus/inert and unload tests |
| Footer | Flexible social rows, minmax(0,1fr) columns, long menu/policy wrapping and 24px menu target minimum | Source constraint review; rendered bottom/long-label fit pending |
| Shared product/rich text/app content | No two-line truncation for mobile product headings; price/action row wraps; long text and wide media constrained | Source review; merchant-content visual cases pending |

Review target widths: 320, 375, 390, 430, 768, 990 and 1440 CSS px, plus portrait/landscape changes. These are the manual QA matrix, not a claim of rendered tests at those widths. Mobile/short-view changes derive from existing layout tokens because complete Figma states were not supplied.

## Repeatable checks

From the repository root:

```sh
node tests/scroll-integration.cjs
node tests/mobile-components.cjs
shopify theme check
```

The integration test executes the actual local Lenis distribution with controlled DOM dimensions. It checks exact bottom reach after footer/content growth and pin refresh, ScrollTrigger synchronization, locks, nested-scroll exclusions, desktop/mobile switching and BFCache restoration. Component tests check natural 760/980px slide heights, desktop reset, horizontal versus vertical gestures, inactive-slide focus guards and offscreen/hidden/autoplay cleanup. These tests do not emulate browser layout or rasterization.

Additional controlled regressions passed for the existing impact, CTA and reversible showcase sequences. Changed JavaScript syntax and diff whitespace checks passed. Theme Check inspected 176 files with no offenses.

Still required in a working storefront browser: viewport screenshots, actual footer bottom reach by wheel/touch/End, keyboard focus and skip links, anchors, search/cart/filter/localization modals, live Theme Editor add/remove/reorder, long/missing/mixed-ratio merchant content, and Lighthouse across home/collection/product. No performance score or complete browser compatibility claim is made from source/unit checks.
