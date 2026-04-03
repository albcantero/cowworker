# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (TypeScript errors are ignored — see next.config.mjs)
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Cowworker** is a client-only ADHD-friendly productivity app with a "bovine accountability partner." No backend, no database — all state lives in `localStorage`.

### User Flow (3 phases)

1. **Landing** (`app/page.tsx`) — Hero + explainer, reads `cowworker.userName` from localStorage
2. **Work Setup** (`app/work/page.tsx`) — Two-step form: configure a Cowpilot, then build a Work Block
3. **Active Session** (`app/session/page.tsx`) — Live timer, task tracking, animated Cowpilot avatar with archetype-driven messages

### Type ownership

All shared types live in `lib/cow-data.ts` and are **re-exported** from the component files for backwards compatibility:
- `CowpilotStats` → defined in `lib/cow-data.ts`, re-exported from `components/cowpilot-creator.tsx`
- `Task`, `WorkBlock` → defined in `lib/cow-data.ts`, re-exported from `components/work-block-builder.tsx`

Always import shared types from `lib/cow-data.ts` directly in new code.

### Domain Model (`lib/cow-data.ts`)

- **CowpilotStats** — `name`, `avatarIndex`, `intensity` (0–100), `warmth` (0–100), `discipline` (0–100)
- **16 Archetypes** — Personality buckets derived from stat combinations (Legend, Coach, Commander, Ghost, etc.). Each archetype has its own message set.
- **21 Preset Cows** — Pre-configured cows (Connie, Bella, Daisy, Luna…) users can pick or customize.
- **WorkBlock** — `hardStopMinutes`, `frogTaskId`, `tasks[]`, `hyperfocus` flag
- **Task** — `id`, `label`, `estimatedMinutes`

### State Management

Pure React (`useState` / `useEffect`). No global state library. Everything is in Client Components (`"use client"`). Session state and user preferences are persisted to `localStorage`.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Theme tokens (colors, fonts, radii) are CSS custom properties in `styles/globals.css`. Dark mode uses `@custom-variant dark`. Fonts (Nunito, Sono, Fredoka) are embedded as `@font-face` declarations. Font Awesome icons are loaded from CDN in `app/layout.tsx`.

### UI Components

`components/ui/` contains 65+ shadcn/ui components (Radix UI based). Add new shadcn components with:

```bash
npx shadcn@latest add <component>
```

`components.json` controls shadcn config (style: "new-york", baseColor: "zinc", cssVariables: true).

### Key Notes

- `next.config.mjs` sets `ignoreBuildErrors: true` — TypeScript errors do not block builds.
- Images are unoptimized (`images.unoptimized: true`) — use plain `<img>` tags, not `next/image`.
- No API routes or server-side logic; this is a pure SPA deployed on Vercel.
- `@vercel/analytics` is included in the root layout.
