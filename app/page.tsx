"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GridPattern } from "@/components/ui/grid-pattern"
import { CircleQuestionMark } from "lucide-react"
import CowworkerLogo from "@/components/logo"

export default function HomePage() {
  return (
    <div className="relative bg-background">
      <GridPattern className="fixed inset-0 opacity-40 stroke-border" />
      <main className="relative">
        <div className="sticky top-0 z-0">
          <HeroSection />
        </div>
        <div className="relative z-10 bg-background rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
          <CowpilotSection />
          <WorkBlockSection />
          <CtaSection />
        </div>
      </main>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [userName, setUserName] = React.useState("")

  React.useEffect(() => {
    setUserName(localStorage.getItem("cowworker.userName") ?? "")
  }, [])

  return (
    <section className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">

      <div className="items-center justify-center">
        {userName && (
          <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
            Welcome back, <span className="font-bold text-foreground">{userName}</span> 👋
          </p>
        )}
      </div>

      <CowworkerLogo className="h-10 lg:h-20 w-auto" />

      <div className="items-center justify-center">
        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          No signup, no install, no data stored.
        </p>
        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          Just <span className="font-bold">you</span>, your <span className="font-bold">tasks</span>, and a <span className="font-bold">cow</span>.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 pt-2">
        <Button asChild size="lg" className="rounded-full px-10 shadow-none">
          <Link href="/work">Start now</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-10 shadow-none">
          <a href="#how-it-works">
            <CircleQuestionMark />
            How it works
          </a>
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground pb-4 mt-4">
        ADHD-friendly productivity tool
      </p>
    </section>
  )
}

// ── Cowpilot section ──────────────────────────────────────────────────────────

function CowpilotSection() {
  return (
    <section id="how-it-works" className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-4">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Step 1
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Build your Cowpilot
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Your Cowpilot is a virtual accountability partner. Give it a name, then tune its personality across three axes. The higher the stats, the more it pushes you.
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            {[
              { icon: "🔥", label: "Intensity", desc: "How hard it pushes you to keep going" },
              { icon: "💛", label: "Friendliness", desc: "Warm encouragement vs. blunt feedback" },
              { icon: "📐", label: "Discipline", desc: "Structure and schedule-keeping" },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3 list-none">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm p-8 flex flex-col items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-muted border-2 border-border flex items-center justify-center text-5xl">
            🐄
          </div>
          <div className="w-full flex flex-col gap-3">
            {[["Intensity", "75"], ["Friendliness", "60"], ["Discipline", "80"]].map(([stat, val]) => (
              <div key={stat} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-display font-semibold text-foreground">{stat}</span>
                  <span className="font-mono tabular-nums">{val}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-foreground/40" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Work Block section ────────────────────────────────────────────────────────

function WorkBlockSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col gap-3 order-last md:order-first">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-primary text-primary-foreground">
            <span>🐸</span>
            <span className="flex-1 text-sm font-medium">Fix the login bug</span>
            <span className="text-xs opacity-70 tabular-nums font-mono">30m</span>
          </div>
          {[
            { label: "Write release notes", time: "15m" },
            { label: "Reply to PR comments", time: "20m" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-3 rounded-xl px-4 py-3 bg-muted">
              <span className="text-muted-foreground">•</span>
              <span className="flex-1 text-sm font-medium text-foreground">{t.label}</span>
              <span className="text-xs text-muted-foreground tabular-nums font-mono">{t.time}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Total</span>
            <span className="font-mono font-medium tabular-nums">65m / 90m</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Step 2
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Plan your work block
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A work block is a finite, intentional chunk of time. Set a hard stop, pick your frog task — the thing you've been avoiding — and add anything else you want to tackle.
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            {[
              { icon: "🐸", label: "Frog task", desc: "Do the hardest thing first. Starting it breaks the inertia." },
              { icon: "⏱️", label: "Hard stop", desc: "A fixed end time makes the work feel finite and manageable." },
              { icon: "⚡", label: "Hyperfocus mode", desc: "Fewer interruptions when you're already in the zone." },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3 list-none">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="border-t border-border">
      <div className="flex flex-col items-center gap-4 px-6 py-20 text-center md:py-28">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Ready to focus?
        </h2>
        <p className="max-w-md text-muted-foreground">
          No signup, no install. Open it and go.
        </p>
        <Button size="sm" asChild className="h-[31px] rounded-lg shadow-none mt-2">
          <Link href="/work">
            Let's work <i className="fa-solid fa-cow ml-1.5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
