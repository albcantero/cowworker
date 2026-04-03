"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── SecondsTooltip ───────────────────────────────────────────────────────────

function SecondsTooltip({
  children,
  enabled,
  onEnable,
}: {
  children: React.ReactNode
  enabled: boolean
  onEnable: () => void
}) {
  const [visible, setVisible] = React.useState(false)
  const [pos, setPos] = React.useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent) {
    setPos({ x: e.clientX, y: e.clientY })
  }

  if (enabled) return <>{children}</>

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {visible && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: pos.x + 14, top: pos.y + 14 }}
        >
          <div className="bg-popover text-popover-foreground rounded-md border p-3 shadow-md flex flex-col gap-2 w-52 pointer-events-auto">
            <div className="text-sm font-semibold">Seconds disabled</div>
            <div className="text-xs text-muted-foreground">The timer works in minutes by default. Want more precision?</div>
            <Button size="sm" className="mt-1 shadow-none" onClick={onEnable}>
              Yes, enable seconds
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── DurationInput ─────────────────────────────────────────────────────────────

export interface DurationInputProps {
  totalMinutes: number
  onChange: (totalMinutes: number) => void
  className?: string
}

export function DurationInput({ totalMinutes, onChange, className }: DurationInputProps) {
  const [secondsEnabled, setSecondsEnabled] = React.useState(false)
  const hh = Math.floor(totalMinutes / 60)
  const mm = totalMinutes % 60

  const h0Ref = React.useRef<HTMLInputElement>(null)
  const h1Ref = React.useRef<HTMLInputElement>(null)
  const m0Ref = React.useRef<HTMLInputElement>(null)
  const m1Ref = React.useRef<HTMLInputElement>(null)
  const s0Ref = React.useRef<HTMLInputElement>(null)
  const s1Ref = React.useRef<HTMLInputElement>(null)

  const refs = [h0Ref, h1Ref, m0Ref, m1Ref, s0Ref, s1Ref]

  const digits = [
    Math.floor(hh / 10),
    hh % 10,
    Math.floor(mm / 10),
    mm % 10,
    0,
    0,
  ]

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    const key = e.key

    if (key === "ArrowRight") {
      e.preventDefault()
      refs[index + 1]?.current?.focus()
      return
    }
    if (key === "ArrowLeft") {
      e.preventDefault()
      refs[index - 1]?.current?.focus()
      return
    }
    if (key === "Backspace") {
      e.preventDefault()
      const newDigits = [...digits]
      newDigits[index] = 0
      commitDigits(newDigits)
      refs[index - 1]?.current?.focus()
      return
    }
    if (key === "Tab") return
    if (!/^\d$/.test(key)) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    const digit = parseInt(key)

    if (index === 0 && digit > 9) return

    const newDigits = [...digits]
    newDigits[index] = digit
    commitDigits(newDigits)
    refs[index + 1]?.current?.focus()
  }

  function commitDigits(d: number[]) {
    const newHH = d[0] * 10 + d[1]
    const newMM = d[2] * 10 + d[3]
    onChange(newHH * 60 + newMM)
  }

  // Maximos por slot: [9][9]:[5][9]:[5][9]
  const SLOT_MAX = [9, 9, 5, 9, 5, 9]

  function increment(index: number) {
    const newDigits = [...digits]
    if (newDigits[index] < SLOT_MAX[index]) {
      newDigits[index] += 1
    } else {
      newDigits[index] = 0
      if (index > 0) {
        // carry al slot de la izquierda
        let carry = index - 1
        while (carry >= 0) {
          if (newDigits[carry] < SLOT_MAX[carry]) {
            newDigits[carry] += 1
            break
          } else {
            newDigits[carry] = 0
            carry -= 1
          }
        }
      }
    }
    commitDigits(newDigits)
  }

  function decrement(index: number) {
    const newDigits = [...digits]
    newDigits[index] = newDigits[index] <= 0 ? SLOT_MAX[index] : newDigits[index] - 1
    commitDigits(newDigits)
  }

  function renderSlot(index: number, ref: React.RefObject<HTMLInputElement | null>, disabled = false) {
    return (
      <div
        key={index}
        className={cn(
          "group relative flex h-20 w-16 items-center",
          "border-y border-r border-input first:border-l first:rounded-l-md last:rounded-r-md",
          "bg-transparent dark:bg-input/30 shadow-xs",
          "transition-all duration-200 overflow-hidden",
          !disabled && "hover:w-24",
        )}
      >
        <input
          ref={ref}
          inputMode="numeric"
          maxLength={1}
          value={String(digits[index])}
          onChange={() => { }}
          onKeyDown={(e) => !disabled && handleKeyDown(index, e)}
          onFocus={(e) => !disabled && e.target.select()}
          disabled={disabled}
          className={cn(
            "h-full w-16 shrink-0 text-center text-5xl font-mono font-normal tabular-nums text-foreground",
            "bg-transparent outline-none select-none",
            disabled ? "cursor-default pointer-events-none" : "cursor-text",
            "focus:z-10 focus:ring-[3px] focus:ring-ring/50 focus:border-ring transition-all",
          )}
          aria-label={`digit ${index + 1}`}
        />
        <div className={cn("flex w-0 overflow-hidden transition-all duration-200 shrink-0 items-center justify-center", !disabled && "group-hover:w-6")}>
          <ButtonGroup orientation="vertical" className="h-fit">
            <Button
              variant="outline"
              size="icon-sm"
              className="h-6 w-6 shadow-none"
              tabIndex={-1}
              onMouseDown={(e) => { e.preventDefault(); increment(index) }}
            >
              <ChevronUp className="size-3" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="h-6 w-6 shadow-none"
              tabIndex={-1}
              onMouseDown={(e) => { e.preventDefault(); decrement(index) }}
            >
              <ChevronDown className="size-3" />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-xs">Hours</span>
        <div className="flex items-center">
          {renderSlot(0, h0Ref)}
          {renderSlot(1, h1Ref)}
        </div>
      </div>
      <span className="text-5xl font-light mb-4">:</span>
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-xs">Minutes</span>
        <div className="flex items-center">
          {renderSlot(2, m0Ref)}
          {renderSlot(3, m1Ref)}
        </div>
      </div>
      <span className={cn("text-5xl font-light mb-4", !secondsEnabled && "opacity-30")}>:</span>
      <SecondsTooltip enabled={secondsEnabled} onEnable={() => setSecondsEnabled(true)}>
        <div className={cn("flex flex-col items-center gap-1 cursor-default", !secondsEnabled && "opacity-30")}>
          <span className="font-display text-xs">Seconds</span>
          <div className="flex items-center">
            {renderSlot(4, s0Ref, !secondsEnabled)}
            {renderSlot(5, s1Ref, !secondsEnabled)}
          </div>
        </div>
      </SecondsTooltip>
    </div>
  )
}
