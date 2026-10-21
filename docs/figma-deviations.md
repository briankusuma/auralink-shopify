# Figma Deviations Log

Document every intentional or necessary deviation from the Figma designs, including reason and affected component/file.

| Date | Component / Section | Figma Frame / Node | Deviation | Reason (Shopify / A11y / Performance) |
| --- | --- | --- | --- | --- |
| 2026-10-21 | Hero radio canvas / assets/auralink-radio-3d.js | Existing hero reference 2899:1059; no new Figma frame supplied | Radio geometry, material, LCD, and lighting follow the user-supplied HTML reference. Existing AuraLink camera, intro, and layout retained; reference toolbar excluded. | Explicit user-requested reference change; keyboard access added without visual controls. Desktop/mobile visual comparison remains pending. |
| 2026-10-21 | Hero radio intro | User-supplied four-stage image sequence; no new Figma node | Camera pulls back as needed to keep the entire radio inside the canvas during the existing top/front/docking sequence, with a 12% framing margin. | Explicit user direction to prevent clipping across canvas aspect ratios; browser visual confirmation pending. |
