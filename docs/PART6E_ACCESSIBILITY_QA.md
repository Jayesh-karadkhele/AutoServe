# AutoServe Part 6E — Accessibility & Responsive QA Report

## 1. Accessibility Architecture Highlights

### Skip Link & Main Content Landmark
- **Skip Link**: `<a href="#main-content">Skip to main content</a>` positioned at top of `LandingPage.tsx` with high z-index and focus-visible visibility.
- **Main Landmark**: Entire landing body wrapped inside `<main id="main-content" className="flex-1">`.

### Accessible Invoice Modal Dialog (`InvoicePreview.tsx`)
- **Dialog Role**: Implemented using `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="invoice-modal-title"`.
- **Keyboard Escape Close**: Window keydown listener listens for `Escape` and triggers `closeModal()`.
- **Focus Trap & Restoration**: Modal contains focus trap algorithm (`Tab` / `Shift+Tab` boundary cycling), sets initial focus on close button, and restores focus to `triggerButtonRef` upon close.
- **Application Inert Background**: Applies `mainContent.setAttribute('inert', 'true')` to `#main-content` while modal is open to block background interactions cleanly.
- **Backdrop Interaction**: Backdrop click triggers `closeModal()` only when clicking directly on backdrop overlay (inner modal handles `e.stopPropagation()`).

### Native FAQ Accordion (`FaqAccordionItem.tsx`)
- **Native <button>**: Uses native HTML `<button type="button">` without manual Enter or Space keydown listeners (preventing double-toggling).
- **ARIA Expansion State**: `aria-expanded={isOpen}` dynamically toggled.
- **ARIA Controls Linkage**: `aria-controls="faq-answer-${item.id}"` referencing panel `id="faq-answer-${item.id}"`.

---

## 2. Responsive Overflow Audit Across 7 Viewports

Verification tested using Playwright on live preview server `http://localhost:4173/` checking real browser DOM condition:
`document.documentElement.scrollWidth <= document.documentElement.clientWidth`

| Viewport Width | Viewport Type | `scrollWidth` | `clientWidth` | Real Overflow (`scrollWidth > clientWidth`) | Audit Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1440px** | Desktop Full | 1440px | 1440px | `false` | **PASS** |
| **1280px** | Desktop Laptop | 1280px | 1280px | `false` | **PASS** |
| **1024px** | Tablet Landscape | 1024px | 1024px | `false` | **PASS** |
| **768px** | Tablet Portrait | 768px | 768px | `false` | **PASS** |
| **430px** | Mobile Large | 430px | 430px | `false` | **PASS** |
| **390px** | Mobile Medium | 390px | 390px | `false` | **PASS** |
| **360px** | Mobile Small | 360px | 360px | `false` | **PASS** |

> [!NOTE]
> All 7 viewports passed responsive width checks without relying on global `overflow-x: hidden` or `overflow-x: clip`.
