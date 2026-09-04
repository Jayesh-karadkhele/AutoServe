# AutoServe Part 6D — Visual QA & Performance Report

## 1. Responsive Viewport Inspection

Tested viewports:
- 1440 × 900 (Desktop Standard / Large)
- 1280 × 800 (Desktop Medium)
- 1024 × 768 (Tablet Landscape)
- 768 × 1024 (Tablet Portrait)
- 430 × 932 (Mobile iPhone 14 Pro Max)
- 390 × 844 (Mobile iPhone 12/13/14)
- 360 × 800 (Mobile Android Standard)

Findings:
- Responsive light design system preserved across all screen sizes.
- Range slider and evidence comparison buttons function smoothly across touch, mouse, and keyboard interactions.
- WAI-ARIA tablists scroll horizontally without clipping or layout breaks on mobile.
- Minimum touch target size of 44×44px maintained for all interactive elements.
- Zero horizontal page scrollbar (`overflow-x-hidden`).
- Zero console errors or warnings.

---

## 2. Performance & Production Build Metrics

Vite production build output (`npm run build`):
- `index.html`: 1.57 kB | gzip: 0.74 kB
- `index-B1ur0voz.css`: 67.05 kB raw | gzip: 11.35 kB *(Below 13.00 kB ceiling)*
- `rolldown-runtime-CbXtAM7H.js`: 0.58 kB raw | gzip: 0.36 kB
- `gsap-vendor-BJZ90ViQ.js`: 112.83 kB raw | gzip: 44.35 kB
- `motion-vendor-Ab8VtKwn.js`: 132.52 kB raw | gzip: 43.36 kB
- `index-WcvN425f.js` (App chunk): 225.33 kB raw | gzip: 52.50 kB
- `react-vendor-DlijzrNC.js`: 274.22 kB raw | gzip: 87.17 kB

Totals:
- **Combined JavaScript Raw**: 745.48 kB
- **Combined JavaScript Gzip**: 227.74 kB *(Below 235.00 kB ceiling)*
- **CSS Raw**: 67.05 kB
- **CSS Gzip**: 11.35 kB

Initial Landing Request Network Chunks:
- `index-WcvN425f.js` (App code)
- `react-vendor-DlijzrNC.js` (React core & DOM)
- `motion-vendor-Ab8VtKwn.js` (Framer Motion)
- `gsap-vendor-BJZ90ViQ.js` (GSAP)
- `rolldown-runtime-CbXtAM7H.js`
- `index-B1ur0voz.css`

---

## 3. Automated Test Suite

- Executed via Vitest (`npm run test -- --run`).
- **Total Tests**: **32 passed** (0 failed).
- **Network Safety Assertion**: Verified that interacting with payment preview makes 0 fetch/axios calls.

---

## 4. Genuine Browser Screenshots (10 Previews)

All 10 visual QA screenshots were captured directly from the live running website via Playwright:
1. `desktop_repair_evidence.png` (Desktop view of `#repair-evidence`)
2. `desktop_invoice_payment.png` (Desktop view of `#transparent-payment`)
3. `desktop_roadside_assistance.png` (Desktop view of `#roadside-assistance`)
4. `desktop_trust.png` (Desktop view of `#trust`)
5. `mobile_repair_evidence.png` (Mobile view of `#repair-evidence`)
6. `mobile_invoice.png` (Mobile view of `#transparent-payment`)
7. `mobile_roadside_assistance.png` (Mobile view of `#roadside-assistance`)
8. `desktop_role_experience.png` (Desktop view of `#roles` - Part 6C catch-up)
9. `mobile_workflow_timeline.png` (Mobile view of `#how-it-works` - Part 6C catch-up)
10. `mobile_role_experience.png` (Mobile view of `#roles` - Part 6C catch-up)
