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
