# AutoServe Part 6C — Visual QA & Performance Report

## 1. Responsive Viewport Inspection

Inspected viewports:
- 1440 × 900 (Desktop Large)
- 1280 × 800 (Desktop Standard)
- 1024 × 768 (Tablet Landscape)
- 768 × 1024 (Tablet Portrait)
- 430 × 932 (Mobile iPhone 14 Pro Max)
- 390 × 844 (Mobile iPhone 12/13/14)
- 360 × 800 (Mobile Android Standard)

Findings:
- SVG Service Run route displays cleanly on desktop and transforms into a responsive vertical timeline on mobile viewports.
- WAI-ARIA tablist scrolls horizontally without layout shifts or text clipping on mobile screens.
- Touch target sizes meet the minimum 44×44px accessibility requirement across all interactive controls.
- Zero horizontal overflow (`overflow-x-hidden` enforced).
- Zero console warnings/errors.

## 2. Performance & Bundle Size Analysis

Build Tool output (`npm run build`):
- `index.html`: 1.57 kB | gzip: 0.74 kB
- `index-DD_BJaWQ.css`: 56.12 kB raw | gzip: 10.12 kB
- `rolldown-runtime-CbXtAM7H.js`: 0.58 kB raw | gzip: 0.36 kB
- `gsap-vendor-BJZ90ViQ.js`: 112.83 kB raw | gzip: 44.35 kB
- `motion-vendor-Ab8VtKwn.js`: 132.52 kB raw | gzip: 43.36 kB
- `index-C2dlEKXU.js`: 179.41 kB raw | gzip: 42.80 kB
- `react-vendor-DlijzrNC.js`: 274.22 kB raw | gzip: 87.17 kB

Totals:
- **Combined JavaScript Raw**: 699.56 kB
- **Combined JavaScript Gzip**: 218.04 kB (Below 240 kB ceiling)
- **CSS Raw**: 56.12 kB
- **CSS Gzip**: 10.12 kB

Initial Landing Request Chunks:
- `index-C2dlEKXU.js` (App code)
- `react-vendor-DlijzrNC.js` (React core & DOM)
- `motion-vendor-Ab8VtKwn.js` (Framer Motion)
- `gsap-vendor-BJZ90ViQ.js` (GSAP)
- `rolldown-runtime-CbXtAM7H.js`
- `index-DD_BJaWQ.css`

## 3. Automated Test Results

- Total unit tests: 20 passed (0 failed).
- Linter output: 0 warnings, 0 errors.
