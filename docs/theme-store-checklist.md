# Theme Store submission checklist

Source: https://shopify.dev/docs/storefronts/themes/store/requirements
Last verified against the official page: **2026-10-01**
Re-verify at the start of every milestone and again right before submission. Update the date above when you do.

Any single missed requirement leads to rejection. Mark an item only after it is verified in a development store, not just written in code.

## 1. Exclusivity

- [ ] Theme is distributed only through the Shopify Theme Store
- [ ] No designer credits or links to the developer's website in theme files
- [ ] No affiliate links in theme files

## 2. Uniqueness

- [ ] Built on Shopify Skeleton; no Dawn or Horizon code
- [ ] Not reproducible by changing settings or styling in another Theme Store theme
- [ ] Distinct header and navigation system
- [ ] Distinct product card system
- [ ] Distinct media treatments
- [ ] Distinct page structure across core templates
- [ ] Differentiation is structural, not only color, type, spacing, gradients, blur, or animation
- [ ] Compared against current Theme Store themes (notes recorded)

## 3. Design and UX

- [ ] Targets a specific merchant type or industry with a deliberate visual style
- [ ] Images, graphics, and icons are high quality, consistent, never stretched or pixelated
- [ ] Simple, cohesive color palette; readable everywhere
- [ ] Logical grid; consistent spacing and alignment
- [ ] Clear content hierarchy
- [ ] Layouts stay balanced with short or long text, few or many images
- [ ] Consistent font pairing (no excess fonts)
- [ ] Buttons, links, and forms are consistent in style, size, color, and behavior
- [ ] Settings grouped logically in merchant-friendly language
- [ ] Clear path: home page -> discovery -> product -> cart -> checkout
- [ ] Product discovery is thoughtful (menus, featured collections, recommendations)
- [ ] Option selection, add to cart, cart editing, and checkout feel immediate and frictionless

## 4. Features

- [ ] Sections everywhere (OS 2.0)
- [ ] Discounts shown for items and orders (cart, checkout, order templates; cart page required)
- [ ] Accelerated checkout buttons on product and cart pages; brand colors unmodified
- [ ] Faceted filtering on collection and search pages (availability, price, type, vendor, variant options)
- [ ] Gift card template
- [ ] Image focal points supported
- [ ] `page_image` used for social sharing
- [ ] Country and currency selector per UX guidelines
- [ ] Language selector per UX guidelines
- [ ] Multi-level menus
- [ ] Newsletter signup form
- [ ] Pickup availability on product page
- [ ] Related product recommendations
- [ ] Complementary product recommendations
- [ ] Rich product media (3D, video, YouTube, Vimeo) in product template, featured product section, and quick view
- [ ] Search box or link to search, with search template and predictive search
- [ ] Selling plans shown in the cart (cart page required)
- [ ] Shop Pay Installments banner on product page
- [ ] Unit pricing on collection, product, and cart pages
- [ ] Variant images
- [ ] Follow on Shop via `login_button`; brand colors unmodified
- [ ] `<shopify-account>` in the header, visible on desktop and mobile

## 5. Templates, sections, blocks

- [ ] `theme.liquid`
- [ ] `404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.json`, `page.contact.json`, `password.json`, `product.json`, `search.json`
- [ ] `gift_card.liquid`
- [ ] `config/settings_data.json`, `config/settings_schema.json`
- [ ] All templates (except account, gift card, checkout) are JSON and support sections
- [ ] Custom Liquid section with a `liquid` setting, available on all section-capable templates
- [ ] Header and footer rendered through section groups
- [ ] Main product section uses blocks for all or most elements
- [ ] `@app` blocks supported in main product and featured product sections
- [ ] Custom Liquid block (with `liquid` setting) where an app block would go
- [ ] `config/markets.json` is **not** included

## 6. Lighthouse (home, collection, product; desktop and mobile; averages)

- [ ] Performance >= 60
- [ ] Accessibility >= 90
- [ ] Measured with real images and content in every section

## 7. Pages

**Layout**
- [ ] `<html lang="{{ request.locale.iso_code }}">`
- [ ] `routes` object for all dynamic URLs
- [ ] `content_for_header` untouched
- [ ] Payment icons (if shown) use `enabled_payment_types` and `payment_type_*` filters, full color

**Product**
- [ ] `product.title` untruncated, `variant.price`, `variant.unit_price`, compare-at price, `product.description`, option names and values
- [ ] All images viewable; varying ratios never break layout
- [ ] Variant image shown when variant selected
- [ ] `cart.taxes_included` indication
- [ ] Separate option selectors, quantity, add to cart (disabled or replaced when unavailable)
- [ ] Price, compare-at price, and sold-out message update on variant change
- [ ] First available variant loads
- [ ] Recommendations, rich media, accelerated checkout (default on), pickup availability, Shop Pay Installments
- [ ] Gift card recipient form: `form.email`, `form.name`, `form.message`, `send_on`
- [ ] Swatches with `swatch.image` and `swatch.color`

**Collection**
- [ ] `collection.title` (untruncated), `collection.description`, `collection.image`
- [ ] Grid or list with title (linked, untruncated), price, images, unit price, at least one media item
- [ ] Grid survives varying image ratios
- [ ] Sale badge or `compare_at_price_max` when appropriate
- [ ] Sorting
- [ ] Empty-collection message
- [ ] `price_varies` range using `price_min` and `price_max`
- [ ] Pagination or lazy loading

**Collection list**
- [ ] `collection.title` untruncated
- [ ] `collection.featured_image`
- [ ] Pagination or lazy loading

**Cart**
- [ ] Line item: title, unit price, image, final price, quantity, options with values
- [ ] `cart.total_price`
- [ ] `cart.taxes_included` indication
- [ ] Checkout button submits the cart form
- [ ] Quantity change refreshes all lines and the total
- [ ] Empty-cart message
- [ ] Cart notes, selling plans, automatic discounts, accelerated checkout (default on)

**Page**
- [ ] `page.title`, `page.content`, contact form alternate template

**Blog**
- [ ] `blog.title`
- [ ] Article title (linked, untruncated), `article.image`, `article.excerpt_or_content`
- [ ] Pagination or lazy loading

**Article**
- [ ] `article.title`, `article.comments`, `article.published_at` (not `created_at`)
- [ ] Paginated comments
- [ ] Comment workflow works without moderation; all success and error messages shown

**Search**
- [ ] No-results message
- [ ] Mixed result types via `object_type`
- [ ] Pagination or lazy loading

**404**
- [ ] Clear not-found message plus search or home link

**Gift card**
- [ ] Apple Wallet support, code, QR code (min 120 x 120px), logo or `shop.name`

**Password**
- [ ] Logo or `shop.name`, `shop.password_message`, storefront password form

## 8. Consistency and functionality

- [ ] RTE content (`h1`-`h6`, `blockquote`, `ul`, `ol`) consistent across all templates
- [ ] Scripts hosted on Shopify (except approved third-party libraries)
- [ ] No JS that interferes with or augments native Shopify features in the editor or Admin
- [ ] Links to Shopify domains have `rel="nofollow"`
- [ ] Protocol-relative URLs only (no hard-coded `http` or `https`)
- [ ] All third-party plugins and images licensed
- [ ] No app-dependent functionality
- [ ] No app-like features needing API access (wishlist, scheduling, cart-level discount codes, Instagram feed)
- [ ] No fake urgency, scarcity, stock levels, or viewer counts

## 9. Browser compatibility (layout, browsing, purchasing)

- [ ] Safari: latest 2 (Mac)
- [ ] Chrome: latest 3 (Mac and PC)
- [ ] Firefox: latest 3 (Mac and PC)
- [ ] Edge: latest 2 (PC)
- [ ] Mobile Safari: latest 2 (iOS)
- [ ] Chrome Mobile: latest 3 (Android and iOS)
- [ ] Samsung Internet: latest 2 (Android)
- [ ] Webviews: Instagram, Facebook, Pinterest (latest, Android and iOS)
- [ ] Fully mobile responsive

## 10. Assets

- [ ] Native CSS only; no `.scss` or `.scss.liquid`
- [ ] No minified `.css` or `.js` (exceptions: ES6 and third-party libraries)

## 11. SEO

- [ ] Metadata snippet: title, meta description, canonical URL
- [ ] Rich product snippets (structured data) validated
- [ ] No `robots.txt.liquid`

## 12. Accessibility

- [ ] Everything keyboard accessible, including dropdown navigation
- [ ] Visible focus state on all focusable elements
- [ ] `alt` on all images (`image.alt` or `image_tag` with `alt:`)
- [ ] Unique input IDs with matching `label[for]`
- [ ] Valid HTML
- [ ] Contrast 4.5:1 body text; 3:1 large text, borders, icons
- [ ] Focus order matches DOM order
- [ ] Touch targets >= 24 x 24 CSS px
- [ ] `h1`-`h6` visually different from each other

## 13. Social media

- [ ] Set of social media icons to choose from
- [ ] Open Graph tags
- [ ] Twitter card tags
- [ ] Social placeholder text left empty

## 14. Settings

- [ ] Labels grammatically correct, no typos
- [ ] Sentence case; American English; no ampersands; declarative; active voice; verb-first actions
- [ ] No numbered option names (except colors)
- [ ] Shopify terminology used (home page, top bar, slideshow, signup, etc.)
- [ ] Spec formats correct (`64 x 64px required`, `3:2 aspect ratio recommended`, `32 words max`)
- [ ] Defaults explain how to use the setting; no Lorem Ipsum
- [ ] Favicon setting
- [ ] Logo works with any aspect ratio
- [ ] Every setting has a `label`
- [ ] Header `link_list` default `main-menu`; footer default `footer`
- [ ] Resource defaults exist in every store
- [ ] `metaobject` / `metaobject_list` use standard definitions only
- [ ] `theme_info` section present
- [ ] Editor changes reflect live in preview
- [ ] Preset placeholder content: image icon, logo icon, lifestyle image, default YouTube video

## 15. Font picker

- [ ] All fonts use `font_picker`
- [ ] Default font set (for example `work_sans_n6`)
- [ ] Defaults and presets use currently available fonts
- [ ] CSS loads bold, italic, bold-italic using `font_modify`
- [ ] No custom fonts

## 16. Color system

- [ ] At least 4 colors
- [ ] Every background setting has a foreground counterpart
- [ ] All color settings use type `color`

## 17. Responsive images

- [ ] Responsive image strategy (icons excepted)
- [ ] Images load only when needed

## 18. Naming and presets

- [ ] Names are 1-2 words and under 30 characters
- [ ] Distinct from Shopify products, company or Partner names, platforms and benefits, industries, and existing themes
- [ ] One preset carries the parent theme's name
- [ ] Multiple presets: each has a `/listings/<preset-name>/templates` folder (optional `sections`)
- [ ] Install state matches the demo store (layout, color, typography)
- [ ] Demo copy adjusted where it could cause support issues

## 19. Version and release notes

- [ ] Version number defined
- [ ] Release notes written

## 20. Demo store

- [ ] Created as a Client transfer store (not a development store with developer preview)
- [ ] At least one demo store per preset, matching the tagged industry and catalog size
- [ ] Bogus Gateway or Shopify Payments test mode on; other checkout options off
- [ ] Authentic text; no Lorem Ipsum, onboarding text, or profanity
- [ ] `powered_by_link` unaltered
- [ ] No affiliate links; Shopify-domain links have `rel="nofollow"`
- [ ] Shows only built-in theme features (no apps)
- [ ] No text or buttons embedded in images (exceptions: physical products, infographics, badges, Instagram images)
- [ ] No animated GIFs that could look like theme functionality
- [ ] Rights obtained for all brand names, images, and content
- [ ] Recommended: sale item, sold-out item, multi-variant product, gift card product

## 21. Documentation and contact form

- [ ] Merchant documentation, accurate, consistent with theme settings, with FAQ
- [ ] Support policy stated; customization services not bundled into theme price
- [ ] Custom code tutorials warn merchants to duplicate the theme first
- [ ] Public contact form: name, email, store URL (with example), problem (textarea), file upload, auto-responder, theme name
- [ ] Both linked from the Theme Store listing

## 22. Support readiness

- [ ] Reply to merchants within two business days
- [ ] Process for fixing bugs quickly and critical bugs immediately
- [ ] No demo-store-specific resources in JSON (custom metafields, `shopify://` URLs)

## Repository and tooling gates

- [ ] `shopify theme check` clean for relevant findings
- [ ] No disabled Theme Check rules without justification
- [ ] Third-party assets and licenses recorded in `docs/third-party-licenses.md`
- [ ] Figma deviations recorded in `docs/figma-deviations.md`
- [ ] Final re-read of the official requirements page completed on: ____-__-__

## Radio canvas change — 2026-10-21

- Source: user-supplied HTML radio reference; this task explicitly uses that reference instead of a new Figma frame.
- Mapping: retain the existing hero section, canvas container, settings, fallback image, intro timeline, and Theme Editor lifecycle; replace radio geometry, procedural materials, LCD, and studio lighting in the existing asset. No new section, block, setting, or external host.
- Reference navbar and control bar excluded. Power, station, bass, volume, and orbit remain on the radio; keyboard shortcuts added without visible controls. Synthetic audio starts only after a user power-on action.
- Local checks: JavaScript syntax, added geometry construction, and Theme Check passed (176 files, no offenses).
- Still pending: storefront desktop/mobile visual comparison, keyboard/focus and touch interaction, Theme Editor reload, and Lighthouse with real content. Chrome automation encountered an unrelated extension-install permission dialog; no extension permissions were granted. These submission gates remain unchecked.
- Official requirements page retrieved on 2026-10-21 for this change; this is not a full re-verification of every checklist item.

### Radio framing follow-up — 2026-10-21

- Increased the default camera distance using the supplied reference position (2.132, 2.426, 6.49), reducing the final radio framing by approximately 22%. The intro final pose and narrow-canvas resize use this same default.
- JavaScript syntax and diff whitespace checks passed. Storefront visual confirmation remains pending; no additional submission gates marked complete.

### Uncropped radio intro — 2026-10-21

- Added camera fitting against the complete radio world-space bounding box, excluding the shadow floor. A 12% framing margin applies throughout the existing top/front/final camera sequence and on canvas resize.
- The current camera distance is retained when it already fits; OrbitControls maximum distance accommodates narrow canvases. The final reduced camera distance from the previous change remains the baseline.
- Verified JavaScript syntax and whitespace. A projection check using an enclosing radio-sized test box passed 310 interpolated poses across five aspect ratios (0.45–2.0). This is a mathematical framing check, not a browser visual test.
- Storefront desktop/mobile playback, Theme Editor and Lighthouse remain pending; submission gates remain unchecked.

### Shadow reveal timing — 2026-10-21

- Contact shadow starts hidden. It fades to the existing opacity over 800ms only after the radio docks and the title, subtitle, CTA, and badge reveals finish. Empty reveal groups complete immediately; plain/reduced-motion modes signal readiness directly, and reduced motion skips the shadow fade.
- Changed assets/auralink-radio-3d.js and assets/section-auralink-hero.js; no Liquid, schema, or Shopify APIs changed. JavaScript syntax and diff whitespace checks passed. Storefront playback and Theme Editor verification remain pending.

### Radio camera view — 2026-10-21

- Set the default final camera position to the user-specified (2.94, 2.9, 6.07), targeting (0.02, -0.16, 0). Existing intro framing and shadow reveal timing retained.
- JavaScript syntax and diff whitespace checks passed; browser visual confirmation remains pending. No Shopify APIs, Liquid, or schema changed.

### Navbar and hero reveal sequencing — 2026-10-21

- Fixed header hidden-state selector specificity: it now excludes header--visible, and the transition is shared by both states. Navbar enters downward over 1.3s after the loading overlay completes, independently of radio docking.
- Hero title/subtitle/CTA reveal now starts at radio:glide; existing docking fallback remains idempotent. Radio camera and CSS translation both run over 1.6s; text reveal runs over 1.6s, CTA/badges over 1.4s. Safety timeouts extended to accommodate the loading screen and slower intro.
- Contact shadow continues to wait for docking and completion of all hero reveals. Existing reduced-motion handling retained.
- JavaScript syntax and diff whitespace checks passed. No Liquid, schema, or Shopify APIs changed; desktop/mobile visual playback and Theme Editor verification remain pending.

### Radio zoom adjustment — 2026-10-21

- Updated the final default camera to the user-selected (2.96, 2.92, 6.12), keeping target (0.02, -0.16, 0). Intro fit, reveal sequence, and delayed shadow remain unchanged.
- JavaScript syntax and diff whitespace checks passed; browser visual confirmation remains pending. No Liquid, schema, or Shopify APIs changed.

### Full-width hero entrance — 2026-10-21

- Hero wrapper uses the existing 3D radio is-intro-center state: initially full section width with zero horizontal gutters and zero container radius. On radio glide it transitions over 1.6s to the existing page-width, responsive gutters, and configured section radius.
- CSS only; no template ID hardcoding, settings, or Shopify behavior added. Reduced motion, no-JS, Theme Editor and static-image heroes retain their normal framing.
- Diff whitespace check and Theme Check passed (176 files, no offenses). Browser visual confirmation of the width/radius transition remains pending.

### Docking resize and top gap fix — 2026-10-21

- ResizeObserver now queues canvas dimensions. Projection, fitting, buffer resize, and redraw run in the same animation frame, preventing presentation of a cleared WebGL buffer during wrapper transitions. Removed the post-intro narrow-canvas camera reset that could jump during animated resizing.
- Removed top padding for 3D hero wrappers and bottom margin from the home page overlay header; other hero bottom spacing remains unchanged.
- JavaScript syntax, diff whitespace, and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes. Visual desktop/mobile playback, Theme Editor, and Lighthouse remain unverified.

### Overhead opening and restored final top gutter — 2026-10-21

- Opening camera is directly above the radio at (0, 6.5, 0), targeting the model origin. Added a stable fitting basis for the overhead singularity and bypassed OrbitControls updates during the cinematic phase so polar constraints do not tilt this view.
- Removed the permanent zero-top-padding override. Only the centered intro starts flush; the wrapper restores the merchant-configured top padding alongside the width and radius transition over 1.6s.
- JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). An enclosing-box projection check passed five aspect ratios for the overhead pose. Browser visual confirmation and Theme Editor playback remain pending.

### GSAP scroll framing — 2026-10-21

- Added official, unminified local GSAP 3.15.0 and ScrollTrigger 3.15.0 assets. Scripts load only with the 3D hero. No external runtime script hosts. License source recorded in third-party-licenses.md.
- Mapping: existing hero section and settings retained; new assets/auralink-hero-scroll.js owns wrapper width, height, gutters and radius through CSS custom properties. No new merchant settings or section types.
- Replaced timed wrapper shrink on docking with scroll framing. Hero stays at full section width and viewport height throughout the radio/content intro, then pins its outer section for a scroll span of 1.5 viewport heights (minimum 900px). Scrub smoothing is 2.5s; final wrapper width is capped at 1440px. Native scrolling remains active; no scroll hijacking library.
- Reduced motion, no-JS, missing library and Theme Editor retain the normal static layout. MatchMedia cleanup removes the timeline, pin and observer; section unload cleans up. Intro and delayed contact shadow retained.
- Shopify asset_url and script inclusion verified in official docs; current Theme Store requirements and GSAP ScrollTrigger docs/license consulted.
- Local browser harness verified fullscreen at scroll 0 (1470 x 801, radius 0) and scroll completion (1440px wrapper, 883px hero, radius 32). Reverse scrolling observed with gradual scrub interpolation. This is a local harness, not a development-store or Theme Editor test.
- JavaScript syntax, diff whitespace, and Theme Check passed (176 files, no offenses). Performance cost: GSAP and ScrollTrigger add approximately 295KB uncompressed / 70KB gzip; production Lighthouse and mobile/keyboard checks remain pending. No submission gates marked complete based on harness alone.

### Scroll responsiveness, intro speed, and single tag reveal — 2026-10-21

- Corrected the timing interpretation: slow applies to the initial radio sequence (now 5.2s total; docking glide 2.6s), while scroll framing responds over 280–480px with 0.35s scrub smoothing.
- Excluded the entire hero container from the global liquid text animator. Previously its standalone tag spans were independently initialized in addition to the hero fade. CTA/tags now wait for both actual text completion callbacks and reveal once; duplicate trigger calls remain guarded.
- Pin spacing is explicit and the section reserves the maximum of fullscreen and final framed heights, including top/bottom gutters. The pin spacer therefore accounts for growth during scroll, preventing the following section from overlapping. Original min-height restored on cleanup.
- Local browser harness with both text animation scripts: tags have zero global split-line wrappers, one Smart/Safe/Secure group appears, and at scroll 369px the wrapper is already approximately 1442px / radius 30px while scrub settles to 1440px / 32px. Following-section gap was non-negative (0px after unpin).
- JavaScript syntax, diff whitespace, and Theme Check passed (176 files, no offenses). No Liquid, schema or Shopify APIs changed. Actual storefront, mobile, Theme Editor and Lighthouse checks remain pending.
