# AutoServe Part 6B — Problem & Solution Scroll Story Specification

## 1. Overview
Part 6B transforms the short problem teaser into an immersive, scroll-driven narrative showcasing why traditional vehicle servicing feels uncertain and demonstrating how AutoServe solves every stage of vehicle care.

## 2. Narrative Architecture & Section Anchors

| Section ID | Section Name | Primary Heading | Core Interactive Pattern |
| :--- | :--- | :--- | :--- |
| `#why-autoserve` | Problem Story | *Your car disappears behind a workshop door.* | Layered card stack with 1-2° rotation & left sticky chapter tracker (01 to 05) |
| `—` | Transformation Bridge | *There is a better service lane.* | Animated route convergence from muted error lines to cyan/orange signals |
| `#experience` | Solution Story | *One connected lane—from booking to back on the road.* | Desktop sticky `ProductWindow` interface stage synced with left chapter scroll (01 to 06) |
| `—` | Capability Rail | *Integrated vehicle care modules.* | Draggable & controlled capability module rail (01 to 08) with boundary states |
| `#how-it-works` | Workflow Preview | *From request to road-ready.* | 7-step compact workflow grid transitioning to Part 6C |

## 3. Chapter Content Breakdown

### Problem Chapters (`#why-autoserve`):
1. **01 — No clear timeline**: Disconnected status line showing missing updates.
2. **02 — Surprise costs**: Initial quote vs final pickup bill discrepancy (+68% unannounced).
3. **03 — No repair visibility**: Workshop bay view restricted with zero photo proof.
4. **04 — Scattered service history**: Separated paper invoices and WhatsApp messages.
5. **05 — Roadside uncertainty**: Stranded driver request with no live responder tracking.

### Solution Chapters (`#experience`):
1. **01 — Book in minutes**: Vehicle selection, date/slot, symptom description, and photo attachment.
2. **02 — Connect the right team**: Role-based assignment connecting customer, manager, and mechanic.
3. **03 — Track every stage**: Real-time service stage progress with live mechanic indicator.
4. **04 — See the work**: Before/after photographic evidence vault with manager timestamps.
5. **05 — Understand every rupee**: Itemized line items, GST breakdown, ₹ currency, and snapshot pricing.
6. **06 — Get moving again**: Location-aware RSA dispatch connecting driver, service bay, and flatbed tow.

## 4. GSAP & Motion Architecture
- **Desktop Pinning**: `gsap.matchMedia('(min-width: 1024px)')` initializes `ScrollTrigger` instances scoped via `useGSAP()` for clean unmount and zero memory leaks.
- **Mobile Fallback**: Natural stacked document flow with accessible tab/button selector.
- **Reduced Motion**: All pinning, parallax, and card rotations disabled; content displayed cleanly in natural sequence.
