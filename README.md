# cowworker.

Your friendly bovine accountability partner. An ADHD-friendly productivity app — no signup, no database, no data stored. Just you, your tasks, and a cow.

**[Try it live](https://cowworker.vercel.app)**

## What is this?

Cowworker is a client-only web app that helps you focus using three evidence-based techniques:

- **Body doubling** — A virtual Cowpilot sits with you during your work session, providing archetype-driven motivation messages. External presence activates the brain's social monitoring systems, increasing sustained attention.
- **Eat the Frog** — Pick the hardest task first. Committing to one concrete first task reduces the cognitive cost of starting, targeting the task-initiation deficit common in ADHD.
- **Timeboxing** — Set a hard stop for your work block. External time anchors compensate for time blindness (*temporal myopia*), making the session feel finite and manageable.

## How it works

### 1. Build your Cowpilot

Choose from 21 cow avatars (one is a secret unlock), give it a name, and tune three personality axes:

| Axis | Low | High |
|------|-----|------|
| **Intensity** | Chill | Relentless |
| **Warmth** | Blunt | Caring |
| **Discipline** | Loose | Strict |

The combination determines one of **16 archetypes** (Legend, Coach, Commander, Ghost, Drill Sergeant, Cheerleader, etc.), each with its own set of motivational messages.

### 2. Plan your Work Block

- Set a **hard stop** (25m to 4h)
- Add tasks with time estimates
- Pick your **Frog task** — the one you've been avoiding

### 3. Work session

A focused session window opens with:

- Live countdown timer per task and for the full block
- Your Cowpilot avatar with rotating motivational messages
- A "Done" button to advance through tasks
- Optional **Hyperfocus mode** for fewer interruptions

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, client-only SPA) |
| UI | Tailwind CSS v4, shadcn/ui (Radix UI), Framer Motion |
| Charts | Recharts (personality radar) |
| Fonts | Nunito, Sono, Fredoka (Google Fonts) |
| Icons | Lucide React, Font Awesome 6 |
| State | Pure React (`useState` / `useEffect`), `localStorage` |
| Deployment | Vercel |

No backend, no database, no API routes. All state lives in `localStorage` and `sessionStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
