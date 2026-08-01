# tony-shrimp

Next.js App Router storefront/admin application migrated from an approved Figma Make visual baseline.

## Development Server

Use npm.

```bash
npm install
npm run dev
npm run build
```

The app runs on Next.js. If a preview server is already active, use that preview instead of starting a duplicate server.

## Project Structure

- `src/app` - Next.js App Router route files and layouts only.
- `src/features/<feature>/index.tsx` - Feature orchestration and client boundary.
- `src/features/<feature>/components` - Presentational components owned by that feature.
- `src/shared/ui` - Source-owned shadcn/ui primitives.
- `src/components/common` - Reusable app-level layout and motion components.
- `src/service` - Axios clients and domain API services.
- `src/hooks` - Reusable hooks and TanStack Query hooks.
- `src/store` - Zustand global client stores.
- `src/types` - Shared and domain types.
- `src/config` - Environment, route, and endpoint configuration.
- `src/providers/AppProviders.tsx` - Root theme, i18n, TanStack Query, navigation, and page-motion providers.
- `src/data` - Current mock catalog/order data.
- `src/hooks` - Client hooks for theme, i18n, and cart persistence.
- `src/i18n` - English and Vietnamese translation resources.
- `public/shrimp` - Mock storefront shrimp image folders. Each image key has `01.jpg` through `05.jpg`.
- `public/background-vid` - Landing background video assets.
- `src/index.css` - Tailwind CSS v4 import, design tokens, theme variables, and global utilities.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/postcss`
- Motion for React (`motion/react`)
- shadcn/ui conventions and Radix primitives
- Lucide React
- Axios and TanStack Query
- Zustand
- React Hook Form and Zod
- npm lockfile

## Migration Rules

The existing Tony Shrimp UI is the approved design reference. Do not redesign while refactoring.

Preserve:

- layout, typography, color tokens, spacing, and responsive behavior
- image usage and asset framing
- Motion variants, transitions, spring behavior, drag/swipe behavior, hover/tap states, and `AnimatePresence`
- light, dark, and system theme behavior
- English and Vietnamese UI copy

Prefer Server Components by default in `src/app`. Put `"use client"` only on client boundaries or components that need state, effects, browser APIs, event handlers, or Motion.

Keep future refactors incremental and feature-scoped. Do not replace custom storefront UI with generic component-library layouts.
