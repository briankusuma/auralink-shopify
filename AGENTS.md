# AGENTS.md

Original Shopify theme for the Shopify Theme Store. Built from the official Shopify Skeleton Theme, designed in Figma.

## Read these files (on demand, with your file tools)

- `docs/theme-standards.md`: detailed Liquid, CSS, JS, settings copy, accessibility, performance, content, and required-functionality rules. **Read it before writing any code.**
- `docs/theme-store-checklist.md`: full Theme Store requirement checklist. **Check it before declaring any task done** and update the items you verified.

This file is the short core. The two files above are part of the rules.

## 0. Precedence

When rules conflict, higher wins:

1. Safety and legality (licenses, no deceptive content, no secrets in the repo)
2. Shopify Theme Store requirements (hard gate; one miss means rejection): https://shopify.dev/docs/storefronts/themes/store/requirements
3. Shopify documented behavior (verified through Shopify Dev MCP or shopify.dev)
4. Accessibility, performance, browser compatibility
5. Figma design
6. Existing repo conventions
7. Convenience

If Figma conflicts with 1-4, adapt, keep the visual intent, and **report the deviation**. If unclear, research or ask. Do not guess. Requirements change, so re-fetch the official page at the start of each milestone.

## 1. Figma MCP (design source)

For every component or page:

1. Fetch design context, screenshot, and variables/tokens through the Figma MCP (use the tools the server exposes). Never work from memory.
2. Extract tokens first: colors, type scale, spacing, radii, borders, shadows, breakpoints, image ratios.
3. Propose the Shopify mapping before coding (table below). Ask if ambiguous.
4. Implement, then compare to the Figma screenshot at desktop and mobile.
5. If a frame, breakpoint, or state is missing, build it from existing tokens and flag it as "not in Figma". Never invent silently.

| Figma | Shopify |
| --- | --- |
| Color styles | `settings_schema.json` color settings and color schemes, exposed as CSS custom properties |
| Text styles | `font_picker` settings plus CSS type-scale tokens |
| Page module | Section |
| Repeatable item in a module | Block (theme block in `blocks/` if reused across sections) |
| Markup reused in 2+ places | Snippet |
| Icons | Inline SVG in snippets (no icon fonts, no CDNs) |
| Auto-layout | CSS grid/flex, relative units |

Known traps:

- **Custom fonts are not accepted.** Map Figma fonts to Shopify's font library and tell the user when no exact match exists.
- Figma shows one content length. The layout must hold with short and long text, 1 or 12 images, mixed ratios, and missing optional content.
- Figma rarely shows: empty cart, empty collection, no results, 404, password, gift card, sold out, unavailable variant, errors, loading, focus, disabled. All are required.
- Figma copy is not default setting text. Defaults are instructive, sentence case, American English, never Lorem Ipsum.

## 2. Shopify Dev MCP (technical source)

Mandatory before writing or changing Liquid, objects, filters, tags, schema, setting types, templates, or any Shopify behavior.

1. Search or fetch the official docs through the MCP (or shopify.dev if unavailable).
2. Verify the object, filter, tag, property, return type, and theme support.
3. Implement the documented pattern.
4. Validate Liquid with the MCP validation tools if available.
5. Run `shopify theme check`; fix relevant findings.

Never invent Liquid objects, filters, tags, properties, schema keys, or setting types. Do not rely on memory, blogs, or other themes.

## 3. Foundation and originality

- Base: **Shopify Skeleton only.** Never use or copy Dawn, Horizon, their derivatives, or any other theme's code. Read docs examples for understanding; write independent code.
- Uniqueness is architectural: header and navigation system, product cards, media treatment, page composition, component relationships, editing experience. Colors, fonts, spacing, gradients, blurs, shadows, and animation tweaks do **not** count.
- The theme targets one merchant type or industry. Keep decisions consistent with it.

## 4. Structure and required files

```text
assets/ blocks/ config/ layout/ listings/ locales/ sections/ snippets/ templates/
```

(`listings/` only when there are 2+ presets.)

Required: `layout/theme.liquid`; `templates/` `404.json`, `article.json`, `blog.json`, `cart.json`, `collection.json`, `index.json`, `list-collections.json`, `page.json`, `page.contact.json`, `password.json`, `product.json`, `search.json`, `gift_card.liquid`; `config/settings_schema.json`, `config/settings_data.json`.

Never include: `config/markets.json`, `robots.txt.liquid`, `.scss`/`.scss.liquid`, minified CSS/JS (ES modules and approved third-party libs excepted), demo-store-specific resources in JSON (custom metafields, `shopify://` URLs).

- All templates except account, gift card, and checkout are JSON and support sections.
- Header and footer render through **section groups**.
- Required **Custom Liquid** section (with a `liquid` setting) on every section-capable template, and a **Custom Liquid** block wherever an app block would fit.
- Main product section is block-based and supports `@app` blocks; the featured product section also supports `@app` blocks.
- Sections have one clear job. Blocks exist for merchant reorder/add/remove, not to inflate settings. Snippets are for reusable logic, not every fragment.

## 5. Core rules digest (details in `docs/theme-standards.md`)

- Liquid: verified syntax, `routes` for all URLs, `<html lang="{{ request.locale.iso_code }}">`, never touch `content_for_header`, `alt` on every image.
- CSS: native only, no minified files, CSS custom properties driven by settings, low specificity, `:focus-visible`, `prefers-reduced-motion`.
- JS: native first, progressive enhancement, hosted in `assets/`, no external hosts, handle Theme Editor events, no interference with native Shopify features.
- Accessibility: valid semantic HTML, full keyboard use, visible focus, contrast 4.5:1 text and 3:1 large text and UI, touch targets at least 24 x 24px.
- Performance: Lighthouse averages on home, collection, and product pages (desktop and mobile) must be Performance >= 60 and Accessibility >= 90, with real content. Responsive images, lazy-load below the fold.
- Content: no Lorem Ipsum, fake urgency, scarcity, stock, visitors, or reviews. No credits, promo links, or affiliate links. Links to Shopify domains carry `rel="nofollow"`. No app dependencies or app-like features (wishlist, scheduling, Instagram feed, cart-level discount codes). License every third-party asset.

## 6. Workflow and definition of done

```text
Figma context + tokens -> Shopify mapping -> Dev MCP docs -> implement
-> shopify theme check -> Theme Editor test -> compare with Figma
-> a11y + performance -> update checklist
```

Before creating a section, block, snippet, setting, or script, ask: does Shopify or the repo already provide it? Does Figma require it? Does it add editor complexity, performance cost, a11y risk, or Theme Store risk? Before modifying code, understand why it exists and make the smallest correct change.

Run `shopify theme check` after meaningful Liquid or JSON changes. Never silence a rule just to pass; justify any disabled rule in a comment.

A task is done only when:

- [ ] Matches Figma at desktop and mobile (deviations listed)
- [ ] Shopify APIs verified in official docs
- [ ] Theme Check clean for relevant findings
- [ ] Works in the Theme Editor (add, remove, reorder, edit, live preview)
- [ ] Keyboard and focus verified
- [ ] Empty, long-content, and mixed-ratio cases handled
- [ ] No new minified files, external hosts, or unlicensed assets
- [ ] Relevant checklist items updated

Final report: files changed, Shopify docs used, Theme Check result, Figma deviations, states not in Figma, risks, open questions.

Ask the user instead of guessing when Figma is ambiguous or missing a required state, a design conflicts with a hard requirement, a font has no Shopify equivalent, or a requirement is unclear.

## 7. Never

Use or copy Dawn, Horizon, or other themes. Invent Shopify APIs. Skip Theme Check, accessibility, or performance. Add Sass, minified assets, external script hosts, or unlicensed assets. Ship fake urgency, scarcity, or social proof. Add credits or affiliate links. Build features that need an app or external API. Hard-code merchant content that belongs in settings or blocks. Interfere with native behavior in the Theme Editor or Admin. Silently deviate from Figma or invent design it does not contain.

When in doubt: compliance over convenience, Shopify's documented practice over generic practice, research before guessing.
