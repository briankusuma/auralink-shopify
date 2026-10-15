# Theme standards (detailed rules)

Read this before writing code. `AGENTS.md` has the precedence and workflow; this file has the details.
Official source for requirements: https://shopify.dev/docs/storefronts/themes/store/requirements

## 1. Liquid

- Use current Shopify Liquid syntax, verified through Shopify Dev MCP.
- Prefer Shopify-native objects, filters, and tags over custom logic.
- Use `routes` for every storefront URL (never hard-code `/`, `/cart`, and so on).
- `<html lang="{{ request.locale.iso_code }}">`.
- Never modify or parse `content_for_header`.
- Every image has `alt` (`image.alt` or `image_tag` with `alt:`).
- Payment icons, if shown, use `shop.enabled_payment_types` with `payment_type_svg_tag` or `payment_type_img_url`, in full color.
- Keep Liquid readable: shallow nesting, shared logic in snippets.
- Treat `request.design_mode` and Theme Editor events as first class: every setting change must show in the editor preview.

## 2. CSS

- Native CSS only. No Sass/SCSS. No committed minified CSS.
- Design tokens as CSS custom properties, driven by theme settings.
- Component-scoped styles, low specificity, no `!important` except documented overrides.
- Mobile-first, relative units, no horizontal scroll.
- Visible `:focus-visible` on every interactive element. Respect `prefers-reduced-motion`.
- Rich text (`h1`-`h6`, `blockquote`, `ul`, `ol`) looks consistent in product descriptions, collection descriptions, articles, and pages.
- `h1`-`h6` are visually distinct from each other.
- Link assets through Shopify filters. Never hard-code `http://` or `https://`.

## 3. JavaScript

- Ask first: can HTML, CSS, or Shopify do this natively? If yes, do that.
- Progressive enhancement. Browsing, options, add to cart, cart, and checkout degrade gracefully wherever Shopify's architecture allows.
- Scripts live in `assets/`. No external script hosts unless Shopify's requirements allow them.
- Do not minify committed JS (ES modules are fine).
- No JS that interferes with or augments native Shopify features in the Theme Editor or Admin.
- Handle `shopify:section:*` and `shopify:block:*` events so sections re-initialize after edits.
- New libraries need a clear need, a license check, and a performance justification.

## 4. Required functionality

Never remove these to simplify code. Full list in `docs/theme-store-checklist.md`.

- **Product**: title (not truncated), price, unit price, compare-at price, description, option names and values, quantity, add to cart, selected-or-first-available variant on load, variant images, swatches (`swatch.color`, `swatch.image`), `cart.taxes_included` note, all images viewable at any ratio, rich media (3D, video, YouTube, Vimeo), accelerated checkout (on by default), pickup availability, Shop Pay Installments, related and complementary recommendations, gift card recipient form (`form.email`, `form.name`, `form.message`, `send_on`).
- **Collection**: title, description, image, grid or list, sort, faceted filtering (availability, price, type, vendor, variant options), pagination or lazy loading, empty message, sale badge, price range via `price_varies`, unit price.
- **Collection list**: `collection.title`, `collection.featured_image`, pagination or lazy loading.
- **Cart**: line title, unit price, image, final price, quantity, options with values; total; tax note; quantity change refreshes all lines; empty message; checkout button; notes; selling plans; automatic discounts; accelerated checkout (on by default).
- **Search**: predictive search, search template, mixed result types via `object_type`, no-results message, filtering, pagination or lazy loading.
- **Blog and article**: `blog.title`; article title (linked, untruncated), image, `excerpt_or_content`; `published_at`; paginated comments with working success and error messages, no moderation needed.
- **Page**: `page.title`, `page.content`, contact form alternate template.
- **404**: clear message plus search or home link.
- **Gift card**: Apple Wallet, code, QR code (min 120 x 120px), logo or `shop.name`.
- **Password**: logo or `shop.name`, `shop.password_message`, storefront password form.
- **Global**: country and language selectors (Shopify UX guidelines), multi-level menus, newsletter signup, Follow on Shop (`login_button`), `<shopify-account>` in the header on desktop and mobile, social media icons, Open Graph and Twitter card tags, `page_image`, SEO metadata (title, description, canonical), structured product data, image focal points, favicon setting, logo that works at any aspect ratio.
- Accelerated checkout and Follow on Shop brand colors must not be modified.

## 5. Merchant settings and copy

The editor must be merchant-first: simple, grouped logically, opinionated defaults with real flexibility. Every setting justifies its existence.

- Every setting has a `label`. Section, block, preset, and category names use sentence case.
- American English (color, center, customize, gray, organize, canceled, catalog, dialog).
- No ampersands. Declarative statements, not questions. Active voice. Actions start with a verb.
- No numbered options ("Position 1"); colors and palettes are the only exception.
- State a section's subject once in its heading; do not repeat it in every label.
- Shopify terminology: home page, top bar, bottom bar, slideshow, heading, subheading, body text, signup, favicon, sidebar, button label, social media, navigation, main menu, secondary menu, footer menu, cart type (drawer/page/modal).
- Spec formats: `64 x 64px required`, `3:2 aspect ratio recommended`, `32 words max`.
- Header `link_list` default `main-menu`; footer `footer`.
- Resource defaults must exist in every store. `metaobject` settings use standard definitions only.
- `settings_schema.json` includes `theme_info`.
- Fonts: `font_picker` only, with a default from the available font list (for example `work_sans_n6`); CSS loads bold, italic, and bold-italic via `font_modify`.
- Colors: at least 4; every background setting has a foreground pair; type `color`.
- Social media placeholder text stays empty.

## 6. Accessibility

- Valid, semantic HTML; correct heading order; DOM order equals focus order.
- Everything keyboard-operable, including dropdown navigation, drawers, modals, and filters. Manage focus on open and close; support `Escape`.
- Visible focus on all focusable elements.
- Contrast: 4.5:1 body text; 3:1 for large text (18pt+), icons, and non-text UI.
- Touch targets at least 24 x 24 CSS px (WCAG 2.2 exceptions apply).
- Inputs have unique `id` and matching `label[for]`.
- ARIA only where native HTML cannot do the job. Do not rely on color alone.

## 7. Performance

- Lighthouse averages across home, collection, and product pages, desktop and mobile: Performance >= 60, Accessibility >= 90. Test with real images and content, never empty sections. Aim well above the minimum.
- Responsive images (`image_url` plus `image_tag` with `widths` and `sizes`). Lazy-load below the fold; prioritize only the LCP image.
- Minimize JS, third-party requests, DOM size, duplicated CSS, and render-blocking resources.
- Do not trade away required functionality or design fidelity for a score; find a better implementation.

## 8. Content, assets, exclusivity

- No Lorem Ipsum, onboarding text, profanity, fake reviews, sales numbers, visitor counts, stock levels, urgency, scarcity, or countdown timers.
- No designer credits, developer promo links, or affiliate links in theme files. `powered_by_link` stays unaltered.
- Links to Shopify domains include `rel="nofollow"`.
- No app dependencies. No app-like features needing API access (wishlist, scheduling, cart-level discount codes, Instagram feed).
- License every image, font, icon, and library. Record sources in `docs/third-party-licenses.md`.
- The theme is exclusive to the Shopify Theme Store.
- Theme and preset names: 1-2 words, under 30 characters, a noun, distinct from Shopify products, company names, industries, and generic benefits ("Performance"), and unique in the Theme Store.
- Preset placeholders: image icon, logo icon, lifestyle image, default YouTube video.
