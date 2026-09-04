# AutoServe Light Automotive Design System (Part 6A)

## 1. Palette Tokens
The design system enforces a strict light automotive aesthetic:

| Token Name | Hex / Value | Role / Usage |
| :--- | :--- | :--- |
| `--canvas` | `#F7F5EF` | Primary editorial background canvas |
| `--surface` | `#FFFFFF` | Elevated card & navigation surface |
| `--surface-soft` | `#F2F7F8` | Soft technical background fill |
| `--ice-blue` | `#EAF7FA` | Illumination glow & status highlight |
| `--silver` | `#E5EBEE` | Fine borders & subtle dividers |
| `--text-primary` | `#17212B` | High-contrast body & heading typography |
| `--text-secondary` | `#66737E` | Secondary captions & technical telemetry |
| `--accent-orange` | `#F4512C` | Controlled action CTAs & high-priority signals |
| `--accent-orange-hover` | `#DC3F1E` | Hover state for primary action CTAs |
| `--signal-cyan` | `#00A7B5` | Telemetry node, status pulse & tech highlights |
| `--success` | `#178A68` | Verification & positive status signals |
| `--warning` | `#E89B24` | Cautionary problem markers |
| `--danger` | `#D84D4D` | Error & critical alert signals |
| `--border` | `rgba(23, 33, 43, 0.12)` | Subtle precise structural borders |

## 2. Typography Scale
- **Display Headings**: `Space Grotesk` (Google Fonts)
- **Body & Interface**: `Inter` (Google Fonts)
- **Telemetry & Technical Labels**: `IBM Plex Mono` (Google Fonts)

### Fluid Scales via `clamp()`
- **Hero Heading**: `clamp(3.2rem, 6.8vw, 7.2rem)`
- **Section Heading**: `clamp(2.2rem, 4.5vw, 4.8rem)`
- **Editorial Body**: `clamp(1rem, 1.2vw, 1.18rem)`

## 3. Shape & Automotive Detail
- **Precision Clipped Corners**: `polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)` used selectively for technical surfaces.
- **Fine Tech Grid**: `32px x 32px` fine background grid (`rgba(23,33,43,0.04)`).
- **Control Buttons**: Directional arrow shift on hover, surface compression (`active:scale-[0.98]`), high-visibility focus ring (`focus-visible:ring-2 focus-visible:ring-[#F4512C]`).
