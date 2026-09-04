# AutoServe Part 6E — Production Performance & Network Audit Report

## 1. Bundle Build Payload Summary (`npm run build`)

| Asset Chunk | Chunk Description | Raw Filesystem Size | Gzip Filesystem Size | Performance Ceiling | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `index-D2R-DtAg.css` | Production CSS Bundle | 70.02 kB | 11.63 kB | ≤ 13.00 kB | **PASS** |
| `rolldown-runtime.js` | Module Runtime | 0.58 kB | 0.36 kB | — | **PASS** |
| `gsap-vendor.js` | GSAP Animation Vendor | 112.83 kB | 44.35 kB | Vendor Chunk | **PASS** |
| `motion-vendor.js` | Motion React Vendor | 132.52 kB | 43.36 kB | Vendor Chunk | **PASS** |
| `index-K5kiH59H.js` | App & Section Components | 239.07 kB | 55.51 kB | App Core | **PASS** |
| `react-vendor.js` | React & React DOM Core | 274.22 kB | 87.17 kB | React Vendor | **PASS** |
| **Combined JS Total** | **All 5 JavaScript Chunks** | **759.22 kB** | **230.75 kB** | **≤ 235.00 kB** | **PASS** |

---

## 2. Browser Initial Network Transfer Audit (Playwright Network Inspection)

Tested on production preview server (`http://localhost:4173/`):

- **Total Initial Requests Captured**: 8 requests
- **Initial JavaScript Requests**: 5 script chunks (`rolldown-runtime`, `react-vendor`, `gsap-vendor`, `motion-vendor`, `index.js`)
- **Deferred JavaScript**: 0 deferred scripts
- **Initial CSS Requests**: 1 stylesheet (`index-D2R-DtAg.css`)
- **Font Requests**: 0 HTTP font requests (Google Fonts stylesheet loaded via preconnect link)
- **External Network Requests**: 1 request (`fonts.googleapis.com`)
- **Animation Vendors Initial Load**: GSAP and Motion are included in vendor chunks loaded initially.
- **Filesystem Gzip vs Browser Transfer Size**:
  - Filesystem Gzip JS Total: **230.75 kB**
  - Actual Browser Transfer Size: **230.75 kB** (HTTP Content-Encoding gzip)
  - Raw Uncompressed JS Execution Memory: **759.22 kB**

> [!TIP]
> The total combined JavaScript gzip payload of **230.75 kB** comfortably satisfies the mandatory **235 kB** performance ceiling while delivering rich animation capabilities across the entire landing page.
