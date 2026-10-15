---
description: Build a Shopify theme section from a Figma node, following AGENTS.md and the Theme Store checklist
---

# Build section from Figma

Use as: `/build-section <figma link> | name: <section name> | used on: <templates> | editable: <what merchants can change>`

1. Read `AGENTS.md`, `docs/theme-standards.md`, and the relevant parts of `docs/theme-store-checklist.md`.
2. Use the Figma MCP to fetch the design context, screenshot, and variables for the given node. If other states or breakpoints exist (mobile, hover, empty), ask for their links instead of guessing.
3. Write a short plan and **stop for approval before coding**. The plan covers: section vs block vs snippet mapping, settings and block types (with sentence-case labels), tokens used or added, font mapping to Shopify's font library, states not in Figma, and any conflict with Theme Store requirements.
4. After approval, use Shopify Dev MCP to verify every Shopify object, filter, tag, and schema key you will use.
5. Implement the section: Liquid, schema with presets and sensible defaults, native CSS, minimal JS only if needed. Use the Skeleton conventions already in the repo.
6. Run `shopify theme check` and fix relevant findings. Do not silence rules to pass.
7. Verify: Theme Editor behavior (add, remove, reorder, edit, live preview), responsive layout at mobile and desktop, keyboard and focus, empty and long-content cases, mixed image ratios.
8. Compare against the Figma screenshot and list every deviation with a reason.
9. Update the relevant items in `docs/theme-store-checklist.md`.
10. Report: files changed, Shopify docs used, Theme Check result, Figma deviations, states not in Figma, risks, open questions.
