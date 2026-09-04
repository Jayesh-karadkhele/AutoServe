# AutoServe Frontend Architecture & Module Structure (Part 6A)

## 1. Overview
The AutoServe frontend is built with React 19, TypeScript, and Vite. It enforces strict component modularity, fluid light automotive aesthetics, responsive design tokens, and smooth motion synchronization.

## 2. Directory Hierarchy
```text
frontend/src/
├── app/
│   ├── App.tsx             # Root Application component with Providers & Router
│   ├── router.tsx          # React Router v7 configuration (memory & browser routes)
│   └── providers.tsx       # Global Motion & Smooth Scroll context providers
├── assets/                 # SVGs, brand assets & imagery
├── components/
│   ├── ui/                 # Reusable atomic design system primitives
│   │   ├── BrandMark.tsx   # Code-native SVG logo mark
│   │   ├── Wordmark.tsx    # AutoServe brand typography
│   │   ├── Container.tsx   # Responsive max-width wrapper
│   │   ├── Section.tsx     # Semantic section with fine tech grid
│   │   ├── Button.tsx      # Primary/Secondary buttons with arrow motion
│   │   ├── IconButton.tsx # Touch-target compliant icon buttons
│   │   ├── Badge.tsx       # Telemetry status badges with pulse
│   │   └── Surface.tsx     # Elevation surfaces with clipped automotive corners
│   ├── layout/
│   │   ├── Navigation.tsx         # Desktop floating navbar with scroll shrink
│   │   └── MobileNavigation.tsx   # Accessible mobile drawer sheet
│   └── marketing/
│       ├── Hero.tsx               # Cinematic landing page hero
│       ├── ServicePulseVisual.tsx # Interactive automotive vehicle pulse visual
│       ├── FloatingStatusCard.tsx # Restrained spring status preview cards
│       ├── ServiceMarquee.tsx     # Light service lifecycle marquee
│       ├── ProblemTeaser.tsx      # Problem signals grid (#why-autoserve)
│       └── ScrollIndicator.tsx    # Accessible scroll prompt
├── hooks/
│   ├── useReducedMotion.ts # Media query hook for prefers-reduced-motion
│   └── useScrollPosition.ts# Passive window scroll listener
├── lib/
│   └── utils.ts            # Class merging utility (clsx + tailwind-merge)
├── motion/
│   ├── ReducedMotionContext.ts  # Context for reduced motion state
│   ├── ReducedMotionProvider.tsx# Context provider for accessibility
│   └── SmoothScrollProvider.tsx # Lenis smooth scroll synchronization
├── pages/
│   ├── marketing/
│   │   └── LandingPage.tsx # Assembled landing page
│   └── auth/
│       ├── LoginPage.tsx    # Part 7 authentication gateway preview
│       └── RegisterPage.tsx # Part 7 registration preview
├── styles/
│   └── globals.css         # Tailwind v4 directives & fluid typography tokens
└── test/
    └── setup.ts            # Vitest environment setup with mocks
```

## 3. Technology Stack & Packages
- **Core Framework**: React 19.2.8, React DOM 19.2.8, TypeScript 6.0.2
- **Build Tool**: Vite 8.2.2 with `@tailwindcss/vite`
- **Routing**: `react-router-dom` 7.18.3
- **Styling**: Tailwind CSS 4.3.3, `clsx` 2.1.1, `tailwind-merge` 3.6.0
- **Motion & Smooth Scroll**: `motion` 13.2.0 (`motion/react`), `lenis` 1.3.26
- **Icons**: `lucide-react` 1.41.0
- **Testing**: Vitest 5.0.0, JSDOM 29.1.1, `@testing-library/react` 16.3.3
