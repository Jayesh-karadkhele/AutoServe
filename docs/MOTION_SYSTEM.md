# AutoServe Motion & Scroll System (Part 6A)

## 1. Core Motion Architecture
- **Framework**: `motion` (`import { motion } from "motion/react"`).
- **Smooth Scroll Engine**: `lenis` configured for 1.2s duration with custom exponential easing (`(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`).
- **Reduced Motion Support**: `ReducedMotionProvider` hooks into `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active:
  - Motion transitions set `duration: 0` and `y: 0`.
  - Marquee animation pauses or displays static reader list.
  - Lenis smooth scroll engine is safely bypassed.

## 2. Coordinated Entrance Sequence
1. Navigation header settles into place on page load.
2. Eyebrow badge reveals with cyan status pulse.
3. Editorial headline lines fade and rise cleanly.
4. Supporting paragraph copy enters.
5. Primary CTA (`Book your service`) & secondary CTA enter.
6. Service Pulse visual resolves with layer depth on right column.
7. Floating status cards (`Appointment confirmed`, `Manager assigned`, `Service in progress`, `Repair evidence added`) arrive with staggered spring delays (`0.4s` to `1.0s`).
8. Base scroll indicator initiates subtle bounce prompt.
