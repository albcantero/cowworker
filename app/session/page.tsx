"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { CheckCircle2 } from "lucide-react"
import type { WorkBlock } from "@/components/work-block-builder"
import type { CowpilotStats } from "@/components/cowpilot-creator"
import { cn } from "@/lib/utils"

// ---------- Types ----------
type SessionTask = { id: string; label: string; estimatedMinutes: number; isFrog?: boolean }

type SessionCowpilot = CowpilotStats & { messages: string[] }

type SessionState =
  | { status: "loading" }
  | { status: "no-data" }
  | {
    status: "running"
    cowpilot: SessionCowpilot
    block: WorkBlock
    tasks: SessionTask[]
    currentIndex: number
    taskElapsed: number
    blockElapsed: number
    message: string
    hyperfocus: boolean
  }
  | { status: "done" }

// ---------- Helpers ----------
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function pickMessage(messages: string[], index: number) {
  return messages[index % messages.length]
}

// ---------- Inline avatar SVG — verbatim render of image.svg ----------
function CowpilotAvatarSVG({ stats: _ }: { stats: CowpilotStats }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      <g id="Layer_13" data-name="Layer 13">
        <path d="m31.71 35.4c-2.81 7.35-2.01 12.49-2 12.54a1.256 1.256 0 0 1-.94 1.42 16.426 16.426 0 0 1-8.6-.53 33.648 33.648 0 0 1-8.69-5.1 1.229 1.229 0 0 1-.45-.89 1.248 1.248 0 0 1 .34-.94 33.811 33.811 0 0 1 8.03-6.07c4.05-2.01 10.83-2.13 11.12-2.13a1.265 1.265 0 0 1 1.04.53 1.282 1.282 0 0 1 .15 1.17z" fill="#e5e5e5" />
        <path d="m73.79 12.44c-.02 6.4-1.09 17.74-8.13 21.77a7.225 7.225 0 0 1-3.51 1.11 4.061 4.061 0 0 1-1.3-.2c-2.05-.67-2.99-2.77-3.82-4.62-.11-.26-.23-.52-.35-.77a3.039 3.039 0 0 1-.1-2.33 2.672 2.672 0 0 1 1.41-1.52 11.8 11.8 0 0 0 5.17-4.2 27.038 27.038 0 0 0 2.71-5.53 30.117 30.117 0 0 1 2.54-5.32 2.927 2.927 0 0 1 5.38 1.61z" fill="#c69c6d" />
        <path d="m43.42 27.4a3.039 3.039 0 0 1-.1 2.33c-.12.25-.24.51-.35.77-.83 1.85-1.77 3.95-3.82 4.62a4.061 4.061 0 0 1-1.3.2 7.225 7.225 0 0 1-3.51-1.11c-7.04-4.03-8.11-15.37-8.13-21.77a2.927 2.927 0 0 1 5.38-1.61 30.113 30.113 0 0 1 2.54 5.32c1.56 3.91 3.03 7.59 7.88 9.73a2.672 2.672 0 0 1 1.41 1.52z" fill="#c69c6d" />
        <path d="m76.25 50.02v8.56c0 3.74-2.4 8.77-3.98 12.09a23.907 23.907 0 0 0-1.22 2.78c0 9.36-9.44 17.05-21.05 17.05s-21.05-7.69-21.05-17.14a22.137 22.137 0 0 0-1.49-3.48c-1.56-3.28-3.71-7.77-3.71-11.3v-8.56c0-14.06 11.04-24.25 26.25-24.25 6.69 0 13.56.68 18.56 5.68a26.08 26.08 0 0 1 7.69 18.57z" fill="#f2f2f2" />
        <path d="m39.65 57.133a2.432 2.432 0 1 1 2.432-2.433 2.434 2.434 0 0 1-2.432 2.433z" />
        <path d="m60.88 78.88c0 4.27-4.78 7.62-10.88 7.62s-10.88-3.35-10.88-7.62 4.78-7.63 10.88-7.63 10.88 3.35 10.88 7.63z" fill="#c69c6d" />
        <path d="m53.917 80.125a1.214 1.214 0 0 1-.282-.032 1.25 1.25 0 0 1-.937-1.5l.125-.542a1.25 1.25 0 0 1 2.437.563l-.125.542a1.251 1.251 0 0 1-1.218.969z" fill="#7f4d1b" />
        <path d="m46.083 80.125a1.251 1.251 0 0 1-1.217-.969l-.125-.542a1.25 1.25 0 0 1 2.437-.562l.125.542a1.25 1.25 0 0 1-.937 1.5 1.214 1.214 0 0 1-.283.031z" fill="#7f4d1b" />
        <path d="m88.63 41.9a33.809 33.809 0 0 0-8.03-6.07c-3.129-1.553-7.876-1.976-10.012-2.089a26.536 26.536 0 0 0-2.028-2.281c-3.43-3.44-7.9-5.16-14.5-5.58a1.237 1.237 0 0 0-1.14.59c-.49.79-11.93 19.54-2.32 35.18a1.09 1.09 0 0 0 .13.17 15.247 15.247 0 0 0 10.99 4.28c3.71 0 8.32-1.14 13.77-4.59a1.251 1.251 0 0 0 .56-.85 11.691 11.691 0 0 0 .2-2.07v-8.57c0-.138-.008-.274-.01-.412a14.832 14.832 0 0 0 3.59-.778 33.649 33.649 0 0 0 8.69-5.1 1.229 1.229 0 0 0 .45-.89 1.248 1.248 0 0 0-.34-.94z" fill="#4d4d4d" />
        <path d="m88.97 42.84a1.229 1.229 0 0 1-.45.89 33.649 33.649 0 0 1-8.69 5.1 14.842 14.842 0 0 1-3.59.79 25.99 25.99 0 0 0-5.64-15.88c2.15.12 6.88.54 10 2.09a33.809 33.809 0 0 1 8.03 6.07 1.248 1.248 0 0 1 .34.94z" fill="#444" />
        <path d="m60.35 57.133a2.432 2.432 0 1 1 2.431-2.433 2.434 2.434 0 0 1-2.431 2.433z" />
      </g>
    </svg>
  )
}

function CowpilotAvatar({ cowpilot, hyperfocus }: { cowpilot: SessionCowpilot; hyperfocus: boolean }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const schedule = () => {
      const delay = hyperfocus ? 800 + Math.random() * 1200 : 2500 + Math.random() * 3000
      return setTimeout(() => {
        setPulse(true)
        setTimeout(() => setPulse(false), 200)
        blinkRef.current = schedule()
      }, delay)
    }
    const blinkRef = { current: schedule() }
    return () => clearTimeout(blinkRef.current)
  }, [hyperfocus])

  return (
    <div
      className={cn(
        "relative mx-auto flex items-center justify-center rounded-full border-4 shadow-lg overflow-hidden transition-all duration-500",
        hyperfocus
          ? "h-28 w-28 border-amber-400 shadow-amber-200"
          : "h-28 w-28 border-primary/30 shadow-primary/10"
      )}
    >
      <div
        className={cn(
          "w-full h-full p-1 transition-all duration-200",
          pulse ? "scale-[0.96] brightness-90" : "scale-100 brightness-100"
        )}
      >
        <CowpilotAvatarSVG stats={cowpilot} />
      </div>
      {hyperfocus && (
        <div className="absolute inset-0 animate-pulse bg-amber-400/10 rounded-full pointer-events-none" />
      )}
    </div>
  )
}

// ---------- Main Component ----------
export default function SessionPage() {
  const [state, setState] = useState<SessionState>({ status: "loading" })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load data from sessionStorage (written by main page before window.open)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cowworker_session")
      if (!raw) {
        setState({ status: "no-data" })
        return
      }
      const { cowpilot: cowpilotStats, messages, block }: { cowpilot: CowpilotStats; messages: string[]; block: WorkBlock } = JSON.parse(raw)
      if (!cowpilotStats || !messages?.length) {
        setState({ status: "no-data" })
        return
      }
      const cowpilot: SessionCowpilot = { ...cowpilotStats, messages }

      const tasks: SessionTask[] = [
        ...(block.frogTaskId
          ? [{ id: "frog", label: block.frogTaskId, estimatedMinutes: 30, isFrog: true }]
          : []),
        ...block.tasks.filter((t) => t.label.trim()),
      ]

      if (tasks.length === 0) {
        setState({ status: "no-data" })
        return
      }

      setState({
        status: "running",
        cowpilot,
        block,
        tasks,
        currentIndex: 0,
        taskElapsed: 0,
        blockElapsed: 0,
        message: pickMessage(cowpilot.messages, 0),
        hyperfocus: block.hyperfocus,
      })
    } catch {
      setState({ status: "no-data" })
    }
  }, [])

  // Master tick
  useEffect(() => {
    if (state.status !== "running") return

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.status !== "running") return prev
        const newBlockElapsed = prev.blockElapsed + 1
        const newTaskElapsed = prev.taskElapsed + 1

        // Block expired
        if (newBlockElapsed >= prev.block.hardStopMinutes * 60) {
          return { status: "done" }
        }

        return { ...prev, blockElapsed: newBlockElapsed, taskElapsed: newTaskElapsed }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state.status])

  // Rotate cowpilot messages
  const rotateMessage = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "running") return prev
      const nextIdx = (prev.currentIndex + 1) % prev.cowpilot.messages.length
      return { ...prev, message: pickMessage(prev.cowpilot.messages, nextIdx) }
    })
  }, [])

  useEffect(() => {
    if (state.status !== "running") return
    const interval = state.hyperfocus ? 45 : 90
    messageTimerRef.current = setInterval(rotateMessage, interval * 1000)
    return () => {
      if (messageTimerRef.current) clearInterval(messageTimerRef.current)
    }
  }, [state.status, state.status === "running" ? state.hyperfocus : false, rotateMessage])

  // Done handler
  function handleDone() {
    if (state.status !== "running") return
    const nextIndex = state.currentIndex + 1

    if (nextIndex >= state.tasks.length) {
      setState({ status: "done" })
      return
    }

    setState({
      ...state,
      currentIndex: nextIndex,
      taskElapsed: 0,
      message: pickMessage(state.cowpilot.messages, nextIndex),
    })
  }

  // ---- Renders ----

  if (state.status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">Loading your session...</p>
      </main>
    )
  }

  if (state.status === "no-data") {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-lg font-semibold text-foreground">No session found</p>
        <p className="text-sm text-muted-foreground">
          Start a session from the Cowworker main page first.
        </p>
      </main>
    )
  }

  if (state.status === "done") {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" strokeWidth={1.5} />
        <div>
          <p className="text-2xl font-bold text-foreground">Block complete!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You showed up. That's what matters. Go touch some grass.
          </p>
        </div>
        <button
          onClick={() => window.close()}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Close window
        </button>
      </main>
    )
  }

  // ---- Running state ----
  const { cowpilot, tasks, currentIndex, taskElapsed, blockElapsed, block, message, hyperfocus } =
    state

  const currentTask = tasks[currentIndex]
  const blockProgress = Math.min((blockElapsed / (block.hardStopMinutes * 60)) * 100, 100)
  const taskProgress = Math.min(
    (taskElapsed / (currentTask.estimatedMinutes * 60)) * 100,
    100
  )
  const remainingTasks = tasks.slice(currentIndex + 1)
  const blockRemaining = Math.max(block.hardStopMinutes * 60 - blockElapsed, 0)

  return (
    <main
      className={cn(
        "flex h-screen flex-col bg-background transition-colors duration-700",
        hyperfocus && "bg-amber-50/30"
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "h-1.5 w-full transition-all duration-1000",
          hyperfocus ? "bg-amber-200" : "bg-muted"
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-1000 rounded-r-full",
            hyperfocus ? "bg-amber-400" : "bg-primary"
          )}
          style={{ width: `${blockProgress}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-between px-6 py-8">
        {/* Cowpilot */}
        <div className="flex flex-col items-center gap-3 w-full">
          <CowpilotAvatar cowpilot={cowpilot} hyperfocus={hyperfocus} />
          <p className="text-sm font-medium text-foreground">
            {cowpilot.name.trim() || "Your cowpilot"}
          </p>

          {/* Message bubble */}
          <div
            className={cn(
              "max-w-xs rounded-2xl px-4 py-2.5 text-center text-sm leading-relaxed transition-all duration-500",
              hyperfocus
                ? "bg-amber-100 text-amber-900 border border-amber-200"
                : "bg-muted text-muted-foreground"
            )}
          >
            <p className="italic">&ldquo;{message}&rdquo;</p>
          </div>
        </div>

        {/* Active task */}
        <div className="flex flex-col items-center gap-4 w-full text-center my-4">
          <div className="flex flex-col items-center gap-1">
            {currentTask.isFrog && (
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Frog task
              </span>
            )}
            <h1 className="text-2xl font-bold text-foreground text-balance leading-tight">
              {currentTask.label}
            </h1>
          </div>

          {/* Task timer */}
          <div className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "text-4xl font-mono font-semibold tabular-nums",
                taskProgress >= 100 ? "text-amber-500" : "text-foreground"
              )}
            >
              {formatTime(taskElapsed)}
            </span>
            <span className="text-xs text-muted-foreground">
              {currentTask.estimatedMinutes}m estimated
            </span>
          </div>

          {/* Task progress bar */}
          <div className="w-full max-w-[200px] h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                taskProgress >= 100
                  ? "bg-amber-400"
                  : hyperfocus
                    ? "bg-amber-500"
                    : "bg-primary"
              )}
              style={{ width: `${taskProgress}%` }}
            />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Done button */}
          <button
            onClick={handleDone}
            className={cn(
              "w-full max-w-xs rounded-2xl py-3.5 text-base font-semibold transition-all hover:opacity-90 active:scale-95",
              hyperfocus
                ? "bg-amber-400 text-amber-950"
                : "bg-primary text-primary-foreground"
            )}
          >
            Done
          </button>

          {/* Remaining tasks */}
          {remainingTasks.length > 0 && (
            <div className="w-full max-w-xs">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Up next
              </p>
              <ul className="flex flex-col gap-1">
                {remainingTasks.map((t, i) => (
                  <li key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40 shrink-0" />
                    <span className="truncate">{t.label}</span>
                    <span className="ml-auto shrink-0 tabular-nums">{t.estimatedMinutes}m</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Block time remaining */}
          <p className="text-xs text-muted-foreground tabular-nums">
            Block ends in {formatTime(blockRemaining)}
          </p>
        </div>
      </div>
    </main>
  )
}
