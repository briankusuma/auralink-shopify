# Third-Party Assets and Licenses

Record every third-party asset (fonts, icons, external libraries, images) used in the theme, along with source and license details.

| Asset | Type | Source / Author | License | Notes |
| --- | --- | --- | --- | --- |
| Three.js, including ShapeGeometry and SphereGeometry helpers | JavaScript library | Three.js Authors; helpers extracted from the user-supplied radio reference; https://github.com/mrdoob/three.js | MIT; copyright 2010–2026 Three.js Authors | Bundled locally in assets/auralink-radio-3d.js; existing library retained; license header preserved. |
| GSAP 3.15.0 and ScrollTrigger 3.15.0 (includes Observer) | JavaScript libraries | Official npm gsap@3.15.0; https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | GSAP Standard No Charge License; https://gsap.com/community/standard-license/ | Unminified official dist/gsap.js and dist/ScrollTrigger.js hosted in assets/. Copyright and license notices preserved. Explicitly requested for the hero scroll animation; no visual animation builder exposed. |
