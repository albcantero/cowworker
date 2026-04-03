"use client"

import { motion, usePresence, AnimatePresence } from "framer-motion"
import * as React from "react"

const SPEED = 15
const CHAR_DELAY = 1000 / SPEED
const TYPING_DELAY = 2500
const AUTO_HIDE_DELAY = 5000

const transition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 50,
  default: { duration: 0.4 },
}

// ── Audio ─────────────────────────────────────────────────────────────────────

let actx: AudioContext | null = null
function ensureCtx() {
  if (!actx) actx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return actx
}
function clickSound() {
  try {
    const ctx = ensureCtx()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = "square"; o.frequency.value = 220 + Math.random() * 180
    g.gain.value = 0.0001
    g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.005)
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.07)
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.08)
  } catch { }
}
function popSound() {
  try {
    const ctx = ensureCtx()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = "sine"
    o.frequency.setValueAtTime(700, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12)
    g.gain.value = 0.0001
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01)
    g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2)
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22)
  } catch { }
}

// ── Typing dots ───────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <>
      <style>{`
        @keyframes wave {
          0%, 40%, 100% { transform: translateY(0); opacity: .5; }
          20% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
      <span className="inline-flex items-center gap-[4px] py-[2px]">
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            display: "inline-block", width: 6, height: 6,
            borderRadius: "50%", background: "currentColor", opacity: 0.7,
            animation: `wave 1s ${i * 0.1}s infinite ease-in-out`,
          }} />
        ))}
      </span>
    </>
  )
}

// ── BubbleItem ────────────────────────────────────────────────────────────────

type Phase = "typing" | "writing" | "done"

function BubbleItem({
  id,
  message,
  dy,
  onRemove,
  onHeight,
  onDone,
}: {
  id: number
  message: string
  dy: number
  onRemove: () => void
  onHeight: (h: number) => void
  onDone: () => void
}) {
  const [isPresent, safeToRemove] = usePresence()
  const [phase, setPhase] = React.useState<Phase>("typing")
  const [displayed, setDisplayed] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      onHeight(el.getBoundingClientRect().height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  React.useEffect(() => {
    let cancelled = false
    const typingTimer = setTimeout(() => {
      if (cancelled) return
      setPhase("writing")
      let i = 0
      function tick() {
        if (cancelled) return
        if (i < message.length) {
          i++
          setDisplayed(message.slice(0, i))
          clickSound()
          setTimeout(tick, CHAR_DELAY)
        } else {
          setPhase("done")
          popSound()
          onDone()
          setTimeout(() => { if (!cancelled) onRemove() }, AUTO_HIDE_DELAY)
        }
      }
      tick()
    }, TYPING_DELAY)
    return () => { cancelled = true; clearTimeout(typingTimer) }
  }, [])

  const animations = {
    layout: "position" as const,
    initial: "out",
    animate: "in",
    variants: {
      in: { opacity: 1, translateY: 0 },
      out: { opacity: 1, translateY: `${dy}px` },
    },
    exit: { opacity: 0, translateY: 0 },
    onAnimationComplete: () => !isPresent && safeToRemove?.(),
    transition,
  }

  return (
    <motion.div key={id} ref={ref} {...animations} className="w-full flex justify-center">
      <div className="max-w-[90%] px-[14px] py-[10px] rounded-[20px] rounded-bl-[4px] bg-white dark:bg-[#2a2f3a] border border-black/8 dark:border-white/4 text-[13px] leading-snug text-black dark:text-[#e6edf3] text-center wrap-break-word">
        {phase === "typing" ? (
          <TypingDots />
        ) : (
          <>
            {displayed}
            {phase === "writing" && (
              <span className="inline-block w-px h-[1em] bg-current ml-px align-middle animate-pulse" />
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── SpeechBubble ──────────────────────────────────────────────────────────────

interface BubbleEntry { id: number; message: string; dy: number; height: number }

interface SpeechBubbleProps {
  message: string | undefined
  onSpeakingChange?: (speaking: boolean) => void
}

let _id = 0

export function SpeechBubble({ message, onSpeakingChange }: SpeechBubbleProps) {
  const [bubbles, setBubbles] = React.useState<BubbleEntry[]>([])
  const prevMessage = React.useRef<string | undefined>(undefined)
  const dyRef = React.useRef(0)
  const speakingCount = React.useRef(0)

  function setSpeaking(delta: 1 | -1) {
    speakingCount.current += delta
    onSpeakingChange?.(speakingCount.current > 0)
  }

  React.useEffect(() => {
    if (!message) {
      prevMessage.current = undefined
      setBubbles([])
      dyRef.current = 0
      speakingCount.current = 0
      onSpeakingChange?.(false)
      return
    }
    if (message === prevMessage.current) return
    prevMessage.current = message

    const id = _id++
    const dy = dyRef.current

    setSpeaking(+1)
    setBubbles(prev => [...prev, { id, message, dy, height: 0 }])
  }, [message])

  React.useEffect(() => {
    if (bubbles.length === 0) dyRef.current = 0
  }, [bubbles.length])

  return (
    <div className="flex flex-col gap-[7px] w-full">
      <AnimatePresence>
        {bubbles.map(b => (
          <BubbleItem
            key={b.id}
            id={b.id}
            message={b.message}
            dy={b.dy}
            onRemove={() => setBubbles(prev => prev.filter(x => x.id !== b.id))}
            onHeight={(h) => {
              dyRef.current = h //+ 7
              setBubbles(prev =>
                prev.map(x => x.id === b.id ? { ...x, height: h } : x)
              )
            }}
            onDone={() => setSpeaking(-1)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}