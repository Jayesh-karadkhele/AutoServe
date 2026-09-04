# AutoServe Part 6C — Interactive "How It Works" Service Journey

## 1. Overview

Part 6C introduces the complete 7-step interactive "How It Works" service journey under `id="how-it-works"`, replacing the previous compact `WorkflowPreview` section.

## 2. Seven Logical Steps

1. **Add your vehicle**: Customer records vehicle make, model, year, license plate, and past service notes. Reusable profile.
2. **Book the service**: Customer selects vehicle, concern, date, and service requirement. Places appointment in queue.
3. **Review and assign**: Manager verifies request, allocates bay, and assigns lead mechanic. Customer receives instant status.
4. **Diagnose and repair**: Mechanic starts digital job card, logs diagnostic items, labor, and required spare parts.
5. **Verify the work**: Repair evidence (photos/videos) uploaded to evidence vault. Manager verifies quality before invoice.
6. **Invoice and pay**: Itemized breakdown (parts, labor, tax in ₹) rendered into invoice. Secure payment via Razorpay.
7. **Close with confidence**: Job card archived into vehicle's permanent service history. Feedback submitted.

## 3. Desktop "Service Run" Rail & Mobile Timeline

- **Desktop (`ServiceJourneyRail.tsx`)**: Displays an interactive horizontal SVG route lane with 7 checkpoints. Hovering or clicking checkpoints advances the vehicle token smoothly along the route.
- **Mobile Fallback**: Converts automatically into a clean vertical timeline with touch targets of at least 44×44px.
- **Code-Native Previews (`JourneyStepPreview.tsx`)**: Custom React/SVG interface compositions representing vehicle selector, appointment request, bay assignment, digital job card, evidence gallery, invoice breakdown, and completed record.

## 4. Accessibility & Keyboard Navigation

- Controls exposed as WAI-ARIA tabs and buttons with keyboard arrow navigation (`ArrowLeft` / `ArrowRight`).
- `prefers-reduced-motion: reduce` stops vehicle token movement and shows instant step transitions.
