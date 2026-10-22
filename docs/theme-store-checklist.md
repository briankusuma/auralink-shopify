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

### Stable hero scene and delayed navbar — 2026-10-21

- Navbar no longer reveals on loading completion. The radio emits radio:standing once when its overhead hold ends (0.65s into the intro); the navbar then descends during the overhead-to-front move. Reduced/plain and fallback paths retain a visible header.
- Scroll framing now animates only clip-path inset and radius through GSAP variables. Wrapper/scene layout dimensions remain fixed throughout scroll; the visible frame is capped to the 1440px wrapper envelope with the existing gutters. No animated padding, height, or canvas resize. Desktop composition is centered within a stable 1440px area; mobile retains its natural content height.
- Pin spacing reserves the fixed scene height plus bottom spacing; existing quick scroll response and once-only tag sequencing retained.
- Local browser harness confirmed identical scene (1470 x 801) and WebGL buffer (1789 x 1602) at scroll 0 and 369px, while clip insets/radius changed. Following-section gap remained non-negative. This verifies fixed layout rather than a real DOM wrapper max-width of 1440px.
- JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes. Storefront, mobile, Theme Editor, keyboard and Lighthouse verification remain pending.

### Larger radio, zoom ceiling, and synchronized white navbar — 2026-10-21

- Moved the default camera from (2.96, 2.92, 6.12) to (2.55, 2.49, 5.26), keeping target (0.02, -0.16, 0). Target distance is approximately 6.410 units (previously 7.46), enlarging the default radio view. OrbitControls minimum distance now matches that framing, with an outward-only adjustment when the viewport needs extra clearance.
- Camera fitting samples actual mesh geometry once (bounded samples per mesh), rather than the empty corners of a global bounding box that prevented enlarging the rounded radio. Uses an 8% safety margin and a reused projection vector; fitting runs during intro/resize, not during ordinary scroll.
- The same scrubbed GSAP timeline now drives both rounded frame and header white-background opacity. Header remains transparent at zero progress, becomes white as the frame rounds, and reverses together on upward scroll; overrides existing sticky-threshold background behavior. Reduced motion retains the native header behavior.
- Local browser harness: repeated zoom-in attempts stop at distance 6.410 / minimum 6.410. Header opacity was 0 at initial frame, approximately 0.882 at partial rounded progress, then solid white at the 32px final radius. Scene/buffer dimensions remained stable and the following-section gap remained 0 after unpin.
- JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes. Screenshot is the user-approved reference; exact screenshot matching on the real store, mobile, Theme Editor and Lighthouse remain pending.

### Single-layer smooth text ripple — 2026-10-21

- Replaced the cloned text overlay and mismatched five-lobe/base cutout masks with one cursor-local SVG displacement applied to the original semantic text wrapper. The neutral field outside a feathered embedded radial mask preserves untouched glyphs; no duplicate text or thresholded blur layer remains.
- Position and strength use frame-time-based exponential easing. Strength eases out on pointer leave; filter/RAF are removed when settled. Touch/reduced motion are excluded; tab hiding, window blur, preference changes and section unload stop the effect. Intro text completion only remeasures filter bounds; hover waits until hero reveal completion.
- Native SVG feImage/feDisplacementMap behavior checked against MDN. No external requests, dependencies, Shopify API, Liquid or schema changes.
- Local desktop browser harness verified zero overlay nodes and an active filter on the original text; screenshot inspected during hover with no ghost copy behind glyphs. Exact motion preference in the real storefront, Safari/Firefox, mobile, Theme Editor and Lighthouse remain pending.
- JavaScript syntax, diff whitespace, and Theme Check passed (176 files, no offenses).

### Hover matches the thick entrance dissolve — 2026-10-21

- Replaced the subtle cursor displacement with the same per-line Gaussian blur and alpha threshold used during text entrance. Hover melts into the effect over 280ms, then resolves using the entrance easing and 1600ms duration; heading peak blur is 48px and body peak blur 24px.
- Reuses existing entrance filters on the original text lines, with no cloned overlay or additional image/filter graph. Each line plays once per pointer entry; repeated entry during an active animation is ignored. Hover remains gated on completed hero reveal and fine-pointer/non-reduced-motion preferences. Blur, visibility changes and section unload cancel active hover cleanly.
- Executed the actual hover function with controlled animation timestamps: verified both peak blur values, duplicate-trigger suppression, and final removal of filter/RAF state. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses).
- No Liquid/schema/Shopify API changes or new dependencies. Real-store visual preference, browser coverage, mobile, Theme Editor and Lighthouse checks remain pending.

### Four-stage bento scroll sequence — 2026-10-21

- Existing bento section, settings, assets and layout retained. Added a local GSAP/ScrollTrigger enhancement: centered heading, centered stat card, centered stacked/stat pair, then full grid with the large device card. Scroll reverses the sequence; explicit pin spacing reserves room for the following section.
- Mapping: existing section owns content; assets/auralink-bento-motion.js owns the timeline. Existing local GSAP libraries load only for desktop motion and reuse loaded scripts. No new dependencies, external hosts or merchant settings. Shopify asset_url documentation and current Theme Store requirements consulted.
- Excluded bento from the global text reveal to avoid duplicate animation ownership. Mobile/tablet, reduced motion, Theme Editor, missing JavaScript and library failures retain the readable static layout. Media changes and section unload revert animation state.
- Figma context, screenshot, variables and motion requests failed with Unknown tool despite the installed connector. Implemented the user's supplied four-frame reference; exact Figma timing/tokens remain unverified. Existing mobile layout is not in the supplied reference.
- Local desktop browser harness verified all four stages: stat centered at x735, paired stat at x864, final stat at x1122; large card hidden until the last stage. Following-section gap remained non-negative and reached 0 after unpin. This is not a development-store or Theme Editor test.
- JavaScript syntax and diff whitespace passed. Theme Check: 176 files inspected, no offenses. Actual storefront integration with the hero pin, mobile visual comparison, Theme Editor, keyboard and Lighthouse checks remain pending; no submission gates marked complete from the harness alone.

### Bento count and content reveals — 2026-10-21

- Percentage card counts from zero to the merchant-configured integer percentage in the existing scroll timeline; other statistic formats remain unchanged. Numeric spacing is stable and original merchant text is restored on animation cleanup.
- Card contents now reveal after their surfaces: stat badge/description, staggered connected label and shield icon/text, then large-card glass panel and its text. Existing sequence, local libraries, static/reduced-motion/editor fallbacks retained.
- JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). Actual counter tween exercised with local GSAP at initial, intermediate, final and reversed progress. No Liquid/schema/Shopify API changes. Updated visual playback, real-store integration, Theme Editor and Lighthouse remain pending; Figma motion source remains unavailable as recorded above.

### Bento heading visibility fix — 2026-10-21

- Root cause: global CSS hides data-liquid-reveal text, while the bento exclusion prevents that animator from restoring visibility. Scoped bento text now inherits visibility, preserving both a readable heading/static fallback and hidden card contents until their parent reveal.
- Moved the heading's starting position into an invalidatable timeline set at time zero. Heading starts centered, rises to its normal header position, then stays there through the remaining card reveals; refresh recalculates the centered offset.
- Local browser regression harness now includes the production global hiding rule and bento text attributes. Verified initial heading at y328 with all cards hidden and heading still visible at y70 during the final card stage. Controlled GSAP test passed center/top/intermediate/reverse/changed-center refresh checks.
- JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or new assets/dependencies. Existing Figma source limitation remains; real storefront, mobile, Theme Editor and Lighthouse verification remain pending.

### Consistent bento liquid text reveal — 2026-10-21

- Added a controlled interface to the existing global liquid reveal engine. Both global and bento reveals share the blur/matrix renderer, 2.5-power ease-out, heading/body blur amounts and 60ms line stagger. Bento heading plays the existing one-second entrance on section entry; card text uses the same treatment at its scheduled scroll stage. The numeric percentage retains count-up without text splitting.
- Bento remains excluded from automatic global observers, avoiding duplicate ownership. Controlled filters and split markup are removed when the bento timeline is destroyed. Plain/reduced-motion paths skip the controlled effect; static visibility fix retained.
- Renderer samples passed for heading/body/span blur strengths and forward/reverse progress against the existing formula. Local browser with both scripts verified three heading/subheading lines, visible centered heading with hidden cards, then visible heading at y70 with all card content available during the final stage. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses).
- No Liquid/schema/API changes, dependencies or new assets. Real storefront, mobile, Theme Editor and Lighthouse remain pending; Figma motion access limitation remains unchanged.

### Single bento heading entrance — 2026-10-21

- Controlled liquid text now prepares hidden instead of rendering completed text first. The pending desktop enhancement hides the heading while libraries prepare; completion/failure/media change/unload removes that state. The section entry callback guards against replaying the heading in the same timeline lifecycle.
- Controlled-reveal test passed hidden preparation, playback, crisp completion, reset and filter/markup cleanup. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or new dependencies. Updated visual storefront/Theme Editor/Lighthouse checks remain pending.

### Sticky tag separation and directional navbar — 2026-10-21

- Hero tag reveal follows the user's three-stage image: one shared outline, touching individual pills, then an overshoot/settle to the existing 8px gap over 1.4s. Tags start after the existing text completion gate and retain the single completion callback. No duplicate text or SVG overlay introduced.
- Navbar groups enter from compressed positions with a small bounce on initial header visibility. Existing 1.3s entrance retained; directional scroll movement uses 0.5s. Uses existing sticky-header scroll handling and merchant setting; fixed overlay now translates itself when the section gets the hidden class. Focus within/open details keep it visible. Reduced motion, plain animation settings and editor suppress entry effects.
- Local browser harness using the actual existing StickyHeader class verified scroll down: hidden=true and negative navbar translation; scroll up: hidden=false and translation returning to zero. Tag group finishes with 8px gap and one reveal class. Controlled tag function test passed single start/completion and final sharp appearance. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses).
- No Liquid/schema/Shopify API changes, new scripts/dependencies or external assets. User image is the motion reference; exact Figma timing remains unavailable. Storefront/mobile/Theme Editor and Lighthouse checks remain pending.

### Navbar icon capsules and one tag entrance — 2026-10-21

- Clarified target: the search/account/language/cart cluster now separates from one outline into touching controls, then settles with a small overshoot to 12px desktop / 8px mobile gaps. Active language appearance and hover/focus behavior retained; directional hide/reveal unchanged.
- Tag opacity now belongs to its single CSS separation animation, instead of an additional JavaScript fade envelope. Final opacity is explicitly 1, preventing a fade-out/snap at completion. Existing text-completion gate retained; per-element guard prevents intro/fallback callbacks from restarting fades.
- Controlled function test verified only initial/final JS opacity writes and no new RAF/class restart on a repeated call. Local browser harness observed starting icon/tag gaps of 0, final gaps of 12px/8px and tag opacity 1 with one reveal group; downward scroll still hides the navbar. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses).
- No Liquid/schema/API changes or dependencies. Updated storefront/mobile/editor/Lighthouse visual checks remain pending; user screenshots are the reference and Figma timing remains unavailable.

### Final single tag fade and equal navbar gaps — 2026-10-21

- Removed tag capsule separation, shared-outline pseudo-element and per-pill animations. The existing text-completion gate now starts one 700ms monotonic fade into the final three-pill layout. Per-element replay guard retained; only the hero reveal script controls opacity.
- Navbar uses one gap variable (12px desktop / 8px mobile), including the final capsule animation state. Reset inherited icon margins/padding and align localization wrappers; absent localization content no longer reserves a flex slot.
- Controlled tag test passed monotonic opacity, one completion and suppression of repeated calls; confirmed no tag separation keyframes remain. Local browser harness with search/details, account host, nested language form and cart measured final visible-control gaps of 12px, 12px, 12px and tag opacity 1. Directional navbar hide retained.
- JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or dependencies. Real storefront/mobile/editor/Lighthouse verification remains pending.

### Three-stage tags with one animation owner — 2026-10-21

- Per the user's explicit three-frame reference, restored the shared-outline -> touching pills -> separated pills sequence after the existing text-completion gate. One hero RAF drives opacity, outline exchange and spring gap together over 1.4s; there are no separate tag CSS keyframes or secondary fade. Opacity rises once in the opening 18% and stays at 1; final gap remains 8px.
- Controlled test of the actual function verified the delay, all three stages, one animation start/completion, monotonic opacity and replay suppression. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses).
- Navbar spacing retained. No Liquid/schema/API changes, dependencies or new assets. Screenshot is the motion reference; real-store/mobile/editor/Lighthouse visual checks remain pending.

### Full-width header search repair — 2026-10-22

- Root cause: the animated, positioned icon cluster became the absolute search modal's containing block. Open search now makes that cluster and inner header static, anchoring the existing dialog to the full header wrapper. The home-page overlay becomes fixed and untransformed while open; ordinary page headers retain their normal flow. Open-search background overrides transparent hero framing.
- Opening a header search sets a persistent header interaction class to finish icon entry motion, preventing the modal from inheriting a compressed group or restarting the navbar animation on close. Existing search form, predictive logic, reset, focus trap, Escape, outside-click close and Shopify routes remain intact. No Liquid/schema/Shopify API changes.
- Native Chrome local harness with production base/header/search CSS and existing global/details-modal/search-form scripts verified a 1470px modal on a 1470px viewport, focused input, locked body, no icon animation and no header transform. Text entry worked. Further native interaction failed with Sky Computer Use native pipe startup failed, including after resetting the UI runtime.
- Controlled tests of the actual modal/search-form classes passed open/input-focus calls, scroll lock, Escape focus return, outside-click close, persistent entrance guard and input reset. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). Browser submit/close/reset regression, live predictive results, ordinary-page comparison, mobile, Theme Editor and Lighthouse remain pending; no full submission gate marked complete.
- Consulted current [Shopify Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) and [MDN containing block guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Display/Containing_block). Existing search design retained; no Figma visual redesign or new assets/dependencies.

### Smooth search/close glyph exchange — 2026-10-22

- Search and close SVG wrappers now share an absolute 22px centered slot, overriding the old display swap that introduced extra layout width. The open state crossfades opacity over 280ms and rotates/scales gently over 360ms; hover no longer compounds button and SVG scaling. Button size and focus indicators retained, reduced motion disables the transitions.
- CSS-only change in component-auralink-header.css; existing dialog input/focus/close behavior and full-width search fix retained. No Liquid/schema/API changes, assets or dependencies. Diff whitespace and Theme Check passed (176 files, no offenses).
- Visual replay remains pending: native UI connection was unavailable from the prior check, and the attempted in-app browser fallback returned Browser is not available: iab. Live storefront, mobile, Theme Editor and Lighthouse remain unverified.

### Four-stage impact scroll sequence — 2026-10-22

- Mapping: existing Impact story section owns the author, quote, metrics and merchant logo blocks; new assets/auralink-impact-motion.js owns the scroll timeline. Settings, content, images and logo links retained. Local GSAP/ScrollTrigger assets load on eligible desktop viewports and reuse existing script elements; no new library/dependency or external runtime host.
- User screenshot sequence: author centered on a full cream scene; author slides left and quote/divider reveal while the row remains centered; row rises, rounded main panel forms, metrics and plain logos appear; logo tile backgrounds/radii form last. Pin spacing is explicit, reverse scroll replays the same timeline, and layout dimensions remain stable through the four stages.
- Quote and metric text use the shared controlled liquid renderer. Impact is excluded from global text observers; scoped visibility inheritance preserves static text and parent-controlled hidden states. Desktop motion uses width >=1100px and height >=700px; small/short screens, reduced motion, missing libraries and Theme Editor retain the original readable layout. Section unload/media changes revert GSAP and restore split text/filter markup.
- Controlled test executes the actual section script against local GSAP with measured layout fixtures: passed four stage states, transparent-to-rounded tiles, reverse, resized centered offsets and seven text-controller cleanups. JavaScript syntax/diff whitespace passed; Theme Check inspected 176 files with no offenses. Browser verification remains blocked by Sky Computer Use native pipe startup failed. Actual pin spacing/hero+bento integration, desktop/mobile visual comparison, Theme Editor and Lighthouse remain pending.
- Official [asset_url](https://shopify.dev/docs/api/liquid/filters/asset_url), [Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) docs consulted. User screenshot is the explicit motion source; Figma context/timing remains unavailable as recorded earlier. Mobile motion is not supplied in the reference; existing static responsive layout retained and not marked visually verified.

### Impact metric descent and shared logo panel — 2026-10-22

- Metrics now descend from y=-72px in left-to-right order with 0.32s timeline stagger. Text follows its own metric's start. Main panel background/radius and divider wait until all three metric movements and liquid text reveals finish.
- Logos appear afterward inside one full rounded cream panel with transparent individual tiles. Individual tile surfaces form at the end while the shared panel fades away to expose the grid gaps. Increased pin span to three viewport heights (minimum 1800px) to give the additional stages room; reverse/media cleanup retained.
- Actual script/local GSAP controlled test passed staggered downward positions, completed metrics/text before panel background, main panel before shared logo panel, shared panel before tile backgrounds, and reverse/resize/text cleanup. Syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or dependencies. Native browser connection remains unavailable; storefront/mobile/Theme Editor/Lighthouse checks remain pending.

### Impact explicit dimensions — 2026-10-22

- Set logo tile height to 117px and main background panel padding-block to 100px through two section-scoped CSS properties. Applied to static, animated, tablet and mobile rules; existing horizontal responsive padding retained. Removed viewport-dependent overrides for these requested dimensions.
- CSS-only change, no Liquid/schema/API changes or dependencies. Diff whitespace and Theme Check passed (176 files, no offenses). Visual viewport/pin fitting, mobile, Theme Editor and Lighthouse remain unverified because browser UI access is unavailable.

### Clear impact background during upward text transition — 2026-10-22

- Removed the full-scene cream-to-white background tween. The animated wrapper keeps the merchant color-scheme background throughout the author/quote move; wrapper/main panel cast no shadow. The main rounded panel still forms only after metric movement/text complete, followed by the shared logo panel and individual tiles.
- Existing timeline/reverse/resize/cleanup test, JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or dependencies. Visual storefront/viewport/Theme Editor/Lighthouse checks remain pending because browser access is unavailable.

### Icon-only descent, metric counters and hard background cut — 2026-10-22

- Metrics descend left-to-right with content hidden and each icon box centered in its column. After all boxes finish, boxes shift to their text layout, content reveals, and numeric portions count from zero to merchant-configured values. Prefix/suffix/decimal precision preserved; original text restored on cleanup. Numeric statistics stay outside liquid text splitting; labels retain the shared liquid reveal.
- Fixed metric dimensions across responsive/static/animated rules: 160px white box, 72px yellow badge, 40px SVG. Animated metrics use equal grid columns to accommodate the larger boxes. Existing 117px logo tiles and 100px main-panel top/bottom padding retained.
- Per latest instruction, initial author/quote scene is #F5F3F0. A zero-duration timeline set switches the section to #FFFFFF at the icon/main-panel stage; no color tween. Main panel now begins with icons, superseding the prior wait-for-text order. Shared logo panel is visible before metric text; final individual logo tile phase retained.
- Actual script/local GSAP test passed exact cream/white boundary, icon-only descent, hidden text/zero values before settling, intermediate/final 80M+/50+/$120M+ counts, centered-to-final boxes, reverse, resize and original-content/filter cleanup. Syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or dependencies. Browser/storefront/mobile/Theme Editor/Lighthouse verification remains pending.

### Full scene color boundaries synchronized to the reference — 2026-10-22

- Opening centered profile is on white. At the author/quote transition start, the full animated wrapper cuts to #F5F3F0; author movement, quote/divider visibility and liquid text now begin together. Author destination follows the second supplied image (profile to the left of the quote).
- Full wrapper stays cream through the three-icon descent, then cuts to #FFFFFF exactly when the last icon lands, exposing the rounded main panel. No background-color interpolation. Delayed metric text/counts and subsequent logo stages retained.
- Actual script/local GSAP test passed both hard boundaries, simultaneous author/quote movement, cream before the final icon completes, white after completion, counts, reverse/resize/cleanup. Syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or dependencies. Native browser visual comparison remains unavailable; storefront/mobile/editor/Lighthouse checks pending.

### Timed profile intro before the scroll-driven metrics — 2026-10-22

- Initial profile/quote now uses a separate one-shot timed GSAP timeline started when the pinned section enters. After a 250ms centered hold, background eases to cream over 450ms while the profile moves to its left-hand destination over 1.35s. Divider starts at 1.72s and quote at 1.86s, after the profile has settled at 1.6s; shared liquid quote reveal runs for one second.
- Scroll progress is buffered while this intro plays. A 600ms release then hands off to the existing scroll timeline, preventing fast scrolling from skipping the photo/divider/quote sequence. Intro does not restart on repeated entry; remaining metric/count/logo stages stay reversible. Refresh remeasures layout, and all intro/driver/release tweens belong to the section context for cleanup.
- Actual script/local GSAP test passed photo moving with divider/quote hidden, settled photo before divider/quote, blocked fast-scroll progression before intro completion, one-shot entry guard, background cut after all icons, counts, reverse, resize and cleanup. Syntax/diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes or new dependencies. Native browser/storefront/mobile/Theme Editor/Lighthouse checks remain pending.

### Reversible timed profile intro — 2026-10-22

- Supersedes the one-shot entrance: scrolling upward to the opening pin boundary rewinds the metric/logo stages and reverses the timed quote/divider/profile entrance back to a centered profile on white. Scrolling down resumes the intro from its current position; a small boundary dead band prevents repeated direction toggles. Photo still settles before quote/divider enter.
- Actual script/local GSAP regression passed repeated down/up cycles, direction changes during the intro, liquid quote reset, buffered fast scroll, metric counters, background boundaries, resized centering and cleanup. JavaScript syntax, diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/schema/API changes, dependencies or interactive-element changes. Official Theme Store requirements rechecked. Visual storefront/mobile/Theme Editor, keyboard and Lighthouse verification remain pending because native browser access is unavailable.

### Product showcase fullscreen-to-card entrance — 2026-10-22

- Reuses the existing showcase section, merchant slide blocks and currently active slide media. On desktop (990px wide/700px high and above, no reduced-motion preference), a section-local copy of that media starts at viewport size. At the top-of-viewport trigger, a timed 1.65s image contraction after a 300ms hold lands on the measured active-card rectangle; the cover hides only after the rectangles match. No image/card crossfade, shadow or filter tween. The section is pinned with spacing, with no native scrolling lock.
- Header and card content rise from below; neighbouring slides enter from their respective sides. Existing liquid text replay is retained. Carousel clicks, links, arrow keys and swipes are gated with inert and method guards until the timed entrance completes; fast forward leave completes the scene and restores input. Existing carousel works afterward. Aborted listeners, local GSAP context, cover and pending image/library work are cleaned up on disconnect/media changes.
- Mobile/short viewports, reduced motion and the Theme Editor retain the existing usable carousel layout without the fullscreen entrance. These responsive states are not specified in the supplied reference. No new setting, dependency, minified asset or external host. Two asset URLs use the documented asset_url filter: https://shopify.dev/docs/api/liquid/filters/asset_url . ScrollTrigger pin/callback behavior checked against https://gsap.com/docs/v3/Plugins/ScrollTrigger/ . Theme Store requirements rechecked this session.
- Actual script/local GSAP regression passed current active-image selection, full-size/intermediate/exact destination geometry, directional side entry, content timing, interaction guards, fast-scroll completion, subsequent navigation, reduced-motion/editor fallback and cleanup. JavaScript syntax and diff whitespace passed. Theme Check: 176 files inspected, no offenses. Browser inventory still fails with native pipe startup error; desktop/mobile visual comparison, keyboard/focus in-browser, Theme Editor live preview and Lighthouse remain pending. Empty optional header and missing image use the existing slider/media fallback; long-content fitting still needs visual review.

### Native showcase entrance and loading recovery — 2026-10-22

- Supersedes the GSAP showcase entrance above. Shopify asset_url usage is documented and both local library files exist; no live CDN/network failure could be confirmed because browser access remains unavailable. The previous implementation locked input before unbounded library/image awaits. Removed showcase library loading and its two Liquid data URLs entirely. Normal section JS/CSS/image URLs retain Shopify's documented asset_url filter.
- Opening now uses Element.animate and CSS sticky with reserved section height. Fullscreen active-image cover is prepared synchronously, cloned image loads eagerly using currentSrc when available, and timed contraction starts at the viewport top. Exact image/card geometry, upward text/content and directional neighbour entrances retained. Native translate composes with existing carousel transforms. Finished animation effects are cancelled so normal carousel positioning resumes without inline transform overrides or GSAP refresh interference.
- Image readiness is guarded by a 5.5s watchdog at entry. Rejected/stalled images, resize while running, fast scrolling past the section and disconnect restore usable controls. AbortController, animation cancellation, version guards and frame/timer cleanup prevent stale completion handlers. Reduced motion, missing animation API, short/mobile viewports and Theme Editor keep the existing carousel. No new dependencies or external requests for the intro.
- Controlled execution of the actual script without GSAP/ScrollTrigger passed active/eager image selection, viewport trigger, exact landing keyframes, side/text ordering, interaction gating/unlock, rejected and stalled image recovery, resize/unload cleanup, reduced motion and editor fallback. Syntax/diff whitespace passed. Theme Check: 176 files, no offenses. Official asset_url/Theme Store docs and browser API docs rechecked. Native browser inventory still returns startup failure: rendered desktop/mobile, keyboard/focus, editor live preview and Lighthouse remain unverified.

### Reversible showcase scrub with current center media — 2026-10-22

- Supersedes the one-shot native entrance. Native animations stay paused and currentTime follows normalized sticky-section scroll progress in both directions, with a short frame-rate-independent smoothing catch-up. The same scroll stages reverse the text, side slides and fullscreen/card geometry. No timer, library loader, image decode wait or additional asset URL is needed.
- At the completed carousel state all animation effects/cover are removed and input unlocks, while scroll/resize observation remains active. On upward re-entry, build a fresh cover from slides[currentIndex] and its currentSrc, so a clicked center slide becomes the next fullscreen image. Final card bounds come from the stable center navigation rectangle even while a carousel slot transition is running. Image error handlers have their own abort scope; resize rebuilds geometry and unload/media changes cancel frames, effects and listeners.
- Actual-script controlled test passed smoothed scroll forward/backward, repeated full cycles, selecting different center slides before reverse, fullscreen source changes, stable destination dimensions, locked mid-transition input, resize, cleanup and reduced-motion fallback. Syntax/diff whitespace passed. Theme Check: 176 files inspected, no offenses. No Liquid/API/schema change or dependency. Official Theme Store requirements rechecked; visual browser/mobile/editor/keyboard/Lighthouse checks remain pending because native browser access is unavailable.

### CTA lime tile and curved hand sequence — 2026-10-22

- Reuses the existing call-to-action section, content, buttons, desktop layout choice and assets. Added a local native motion script through the documented asset_url filter. For the existing default composite image, the animated view uses the existing transparent cta-hand-device.png and an independent lime surface; the composite remains the static/no-JS/editor/mobile fallback. Merchant-selected images remain merchant-selected (their whole image moves; an opaque upload cannot independently separate hand/background).
- Desktop/no-reduced-motion sequence uses CSS sticky with reserved height and a reversible smoothed scroll playhead: full lime surface contracts to a centered rounded tile at progress 0.04–0.25; hand rises at 0.32–0.63 along a quadratic lateral/vertical arc with eased rotation and gentle settling; tile/hand settle into the existing left/right layout at 0.68–0.88; CTA card enters at 0.89–1. Card controls stay inert until fully visible. No new dependency, library loading, decoding wait or added shadow.
- Responsive, reduced-motion and Theme Editor states retain the original content/layout. Missing media skips motion; oversized panels fall back to the static layout. Resize remeasures; media changes/unload restore original inline styles, inert state and remove listeners, frames and decorative surface.
- Actual-script regression passed fullscreen/centered/final surface geometry, hand hidden before entry, curved rotated intermediate pose and settled hand before text, delayed card visibility, repeated forward/reverse, resized centering, reduced-motion reset and unload cleanup. Syntax, diff whitespace and Theme Check passed (176 files, no offenses). Official asset_url and Theme Store requirements checked. Screenshot is the motion source; rendered desktop/mobile comparison, keyboard/focus, Theme Editor live preview and Lighthouse remain pending because native browser access is unavailable.

### Keep CTA lime background visible — 2026-10-22

- Explicit #F2FE63 fallback on the moving surface and opening scene; the scene becomes white only once the lime surface begins contracting. Isolated stacking keeps the surface above the scene and below the hand/content. Added a persistent matching lime backplate directly behind the media, sized from the measured tile height, so the final rounded background stays present independently of the full-scene layer.
- Actual-script regression passed initial/reversed #F2FE63 scene, white surround after shrink begins, measured backplate height, full/center/final geometry, curve/text order, resize and cleanup. Syntax/diff whitespace passed; Theme Check passed: 176 files, no offenses. CSS/JS only, no Shopify API/schema or asset changes. Same supplied reference; no new design state. Native browser visual/mobile/editor/keyboard/Lighthouse checks remain pending.

### CTA critical color paint from screenshot evidence — 2026-10-22

- User DevTools screenshot shows generated surface dimensions but an older white wrapper rule and no inline scene color. This differs from the current local fallback; live asset delivery could not be inspected (browser unavailable and CDN fetch inaccessible). Do not claim a confirmed CDN cache cause.
- Paint #F2FE63 directly on the generated surface, with explicit position/stacking/visibility. Render also writes the opening lime/contracted white scene background directly on the wrapper; original wrapper inline styles restore on reset. Added section-scoped critical color rules in the Liquid style block so the color does not rely solely on a separately loaded stylesheet/custom-property declaration. Existing curve/stage/reverse behavior unchanged.
- Actual-script checks passed inline opening/reversed lime, permanently lime surface, explicit surface stack, white surround after contraction starts, stage geometry, curve/text order, resize and restoration. Syntax and diff whitespace passed. Theme Check passed: 176 files, no offenses. No new Liquid object/filter/schema, asset or dependency. Screenshot is the same design source. Rendered storefront/color/keyboard/editor/Lighthouse verification remains pending; local tests do not prove live asset delivery.

### White CTA scene with one shrinking lime overlay and aligned hand portal — 2026-10-22

- Latest user correction supersedes the scene color switch and extra persistent backplate above. Animated section stays #FFFFFF throughout; exactly one independent #F2FE63 surface contracts continuously from the full section to the centered tile. Removed the duplicate media pseudo-background. Widened contraction to progress 0.04–0.32, then hand enters 0.39–0.69, media settles at 0.73–0.90 and card reveals at 0.91–1. Existing curve, direct overlay paint and reversible scroll retained.
- The media stage keeps its desktop/compact dimensions while the inner image portal uses the measured green-tile height. Its bottom edge matches the tile; bottom corners clip at 32px and a negative top inset allows the hand to rise above the tile. The hand remains bottom-anchored inside that portal, making the entry emerge through the green area without extending below it.
- Actual-script regression passed constant white scene, lime overlay at every contraction sample, monotonically decreasing intermediate width/height, centered/final rectangles, tile/portal bottom alignment math, hidden hand until contraction completes, curved hand before card, reverse cycles, resize and cleanup. CSS portal/clipping rules reviewed; rendered fit remains unverified. Syntax/diff whitespace and Theme Check passed (176 files, no offenses). Official style-tag docs and Theme Store requirements rechecked; no new setting, dependency or asset. Screenshot/user instructions remain source; native browser/mobile/keyboard/editor/Lighthouse checks still pending.

### CTA invisible overlay root cause — 2026-10-22

- Confirmed cause: base.css lines 496–509 hide div:empty, including the intentionally empty lime overlay. Added display:block inline and a scoped .auralink-cta__motion-surface:empty rule whose specificity exceeds div:empty. Global empty-element handling remains unchanged. Supersedes earlier unconfirmed color/delivery explanations; motion/design unchanged.
- Actual-script regression now asserts the overlay display is block through contraction/reversal; sequence/geometry/cleanup and syntax/diff checks pass. Theme Check passed: 176 files, no offenses. Native rendered browser verification remains unavailable.

### Hand wrist crop and full cream impact overlay — 2026-10-22

- CTA hand overscans the portal at scale 1.12 with a 4%-of-tile-width right offset, putting the cut source wrist edge beyond the rounded lower/right clipping boundary. The existing quadratic path now uses smootherstep progress (zero endpoint velocity/acceleration) and gentler -18°/4° rotation control. Existing tile/card stages, bottom-aligned portal and reversible scroll remain.
- Impact animated wrapper stays white. A single literal #F5F3F0 overlay initially fills its width/height; it contracts over 1.3 timeline seconds from the icon stage onto the measured main-card rectangle/radius32, replacing the prior hard scene-color cut and card-background fade. Initial fullscreen cream follows the latest requested overlay logic, superseding the earlier white-centered opening. Header/quote/icon/count/logo timing otherwise retained. Overlay has display:block inline and a :empty display override; isolated stacking keeps content above it. Resize remeasures the panel, reverse restores full size and cleanup removes the overlay.
- Actual-script/local-GSAP tests passed full/intermediate/final overlay rectangles on a constant white wrapper, reverse intro and content cycles, preserved quote/icon/count/logo order, resize and cleanup. CTA actual-script regression passed updated curved pose/overscan, stage order, reverse/resize/cleanup. Syntax/diff whitespace and Theme Check passed (176 files, no offenses). No Liquid/API/schema change, dependency or asset change. User screenshots are the source; rendered wrist crop/panel comparison, mobile/editor/keyboard/Lighthouse checks remain pending because native browser access is unavailable.

### Confirm impact target from supplied live markup — 2026-10-22

- Matched the pasted wrapper section-template--27437339738214__auralink_impact-padding to sections/auralink-impact.liquid. Place data-impact-surface directly under that wrapper in Liquid and bind the existing animation to that exact child. White wrapper/full #F5F3F0 overlay/measured-card contraction remains; no CTA changes in this correction. Static/reduced-motion/editor styling hides the decorative child; cleanup restores its styles instead of removing server markup. Scoped :empty override retained.
- Actual-script regression passed with the section-provided surface, full/intermediate/final geometry, reverse, counters, resize and cleanup. Syntax/diff whitespace passed; Theme Check passed: 176 files, no offenses. Pasted markup lacked both the active motion class and overlay, so local correctness is not proof the live preview has loaded the latest assets. Browser/editor/Lighthouse checks remain pending.
