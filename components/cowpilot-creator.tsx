"use client"

import * as React from "react"
import { useId } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "./ui/button-group"
import { toast } from "sonner"
import { Skull, Lock, LockOpen, Settings2, Minimize, Maximize, MessageCircle, MessageCircleOff } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { SpeechBubble } from "@/components/ui/speech-bubble"
import type { CowpilotStats } from "@/lib/cow-data"

export type { CowpilotStats }


export const DEFAULT_COWPILOT_STATS: CowpilotStats = {
  name: "",
  avatarIndex: 0,
  intensity: 50,
  warmth: 70,
  discipline: 60,
}


// ── generateMessages — recibe userName del USUARIO ───────────────────────────

export function generateMessages(stats: CowpilotStats, userName: string): string[] {
  const name = userName.trim() || "you"   // ← nombre del usuario, no de la vaca
  const archetype = getArchetype(stats)

  const pools: Record<string, string[]> = {
    Legend: [
      `You're built different, ${name}. Prove it.`,
      "Every stat maxed. Now max the output.",
      "No excuses exist at your level.",
      "The standard is excellence. Maintain it.",
      "You set the bar. Don't duck under it.",
      "Legends don't need rest — they need results.",
      "Greatness is a habit, not a moment.",
      "You've earned the right to go harder.",
      "The ceiling is where others stop. You don't.",
      `Everyone's watching, ${name}. Show them how it's done.`,
    ],
    Ghost: [
      "Still here. Still breathing. That counts.",
      "No pressure. Just one small thing today.",
      "You don't have to be loud to make progress.",
      "Start anywhere. Seriously — anywhere.",
      "Showing up is already more than nothing.",
      "Low energy is fine. Low effort isn't.",
      "Even ghosts leave marks. Leave yours.",
      "Invisible progress is still progress.",
      "Rest if you need to. Quit? Never.",
      "One quiet step forward. That's enough.",
    ],
    Coach: [
      `Come on, ${name} — let's make today count.`,
      "Push hard, but bring everyone with you.",
      "Energy is contagious. Set the tone.",
      "You motivate best when you lead by example.",
      "Fire up, but stay in the game with people.",
      "High drive, big heart — that's your edge.",
      "A great coach doesn't just push — they believe.",
      "Your team moves at the speed of your energy.",
      "Rally the room. You know how.",
      `The best version of you lifts everyone, ${name}.`,
    ],
    Commander: [
      "Discipline and intensity. That's the formula.",
      "No room for noise. Execute the plan.",
      "Precision over passion. Every time.",
      "Your system will outlast your feelings.",
      "Stay cold. Stay sharp. Stay on task.",
      "Results don't care about your mood.",
      "Command the day before it commands you.",
      "Every decision is a signal. Send the right one.",
      "Leaders don't wait for clarity — they create it.",
      "Execution is the only language that matters.",
    ],
    Mentor: [
      `You've got the structure and the heart, ${name}.`,
      "Guide with warmth. Lead with consistency.",
      "Your calm is your superpower — use it.",
      "Support others without losing the schedule.",
      "Steady and kind wins the long game.",
      "Build habits, not just motivation.",
      "The best mentors teach by doing.",
      "Patience is a skill. Practice it today.",
      "Your steadiness is someone else's anchor.",
      "Wisdom shared is wisdom multiplied.",
    ],
    Robot: [
      "Structured. Methodical. That's enough.",
      "No emotion needed — just the next step.",
      "The system is running. Trust it.",
      "Execute task one. Then task two.",
      "Discipline without warmth still works.",
      "Output is all that matters right now.",
      "Optimize the process. Ignore the noise.",
      "Consistency compounds. Keep the streak alive.",
      "Input → Process → Output. Repeat.",
      "You don't need to feel it. You just need to do it.",
    ],
    Drifter: [
      "Pick one thing. Just one.",
      "No plan is fine — start and find direction.",
      "Movement creates momentum. Move.",
      "It's okay to wander — as long as you're working.",
      "You don't need a roadmap to take a step.",
      "Loose is fine. Stopped is not.",
      "Drift with intention. There's a difference.",
      "The path reveals itself when you start walking.",
      "Not all who wander are lost — but don't get lost.",
      "Direction comes from action, not the other way around.",
    ],
    "Lone Wolf": [
      "You work alone. Work well.",
      "No need for approval — just output.",
      "Self-reliance is a strength. Use it.",
      "Minimal warmth, maximum independence.",
      "You set the standard for yourself.",
      "Nobody's watching. Do it anyway.",
      "Silence is your competitive advantage.",
      "The wolf doesn't explain. It delivers.",
      "Your accountability is to yourself. Honor it.",
      "Solo doesn't mean slow. Prove it.",
    ],
    "Drill Sergeant": [
      "MOVE. There's no time for hesitation.",
      "LOCK IN. Everything else is noise.",
      "You are not tired. You are distracted.",
      "Drop the excuses. Pick up the pace.",
      "This is not optional. Get it done.",
      "Maximum effort. Right now.",
      "PAIN IS TEMPORARY. REGRET IS FOREVER.",
      "Stop negotiating with yourself. GO.",
      "The only rep that doesn't count is the one you skipped.",
      "I didn't ask how you feel. I asked if it's done.",
    ],
    Motivator: [
      "Let's go — momentum starts with one move.",
      "You've got the drive. Channel it.",
      "Intensity without chaos. Stay focused.",
      "Push forward. The resistance is the point.",
      "High energy, high output — that's the mode.",
      "Don't slow down until it's done.",
      "You were made for this. Act like it.",
      "The fire in you is real. Don't let it die.",
      "Every second of effort compounds. Keep going.",
      `${name}, this is your moment. Seize it.`,
    ],
    Cheerleader: [
      `You are absolutely crushing it, ${name}!`,
      "I'm so proud of how far you've come.",
      "Every step you take is worth celebrating.",
      `You've got this, ${name} — I'm cheering for you!`,
      "Keep going — the best is still ahead.",
      "You make it look easy. Keep shining.",
      "Your progress is REAL and it SHOWS.",
      "The world is better when you show up like this!",
      "You inspire more people than you know.",
      `I believe in you, ${name}. Always have. Always will.`,
    ],
    Companion: [
      `I'm right here with you, ${name}.`,
      "We're doing this together — step by step.",
      "You don't have to figure it all out alone.",
      "Take your time. I'm not going anywhere.",
      "Small wins count. Let's collect them.",
      "You're doing better than you think.",
      "Hard days are part of the story. Keep writing.",
      "Just breathe. Then take the next step.",
      "I see how much effort you're putting in. It matters.",
      "You're not behind. You're exactly where you need to be.",
    ],
    Strategist: [
      "The plan is set. Execute without deviation.",
      "Structure is freedom — trust the system.",
      "Efficiency is a discipline, not a talent.",
      "Review, adjust, continue. That's the loop.",
      "Your system is your competitive advantage.",
      "Every minute accounted for is a minute won.",
      "Think three moves ahead. Always.",
      "Clarity of goal eliminates wasted motion.",
      "Strategy without action is fiction. Act.",
      "The map isn't the territory — but it helps. Use it.",
    ],
    Planner: [
      "One task at a time — finish what you started.",
      "The schedule exists for a reason. Follow it.",
      "Progress is planned, not accidental.",
      "Stay on track. The next task is waiting.",
      "Consistency beats intensity every week.",
      "You planned this well. Now trust it.",
      "Cross it off. Move to the next one.",
      "Done is better than perfect. Ship it.",
      "Your future self will thank today's discipline.",
      "A good plan executed now beats a perfect plan too late.",
    ],
    Balanced: [
      `Keep going, ${name}. You're finding your rhythm.`,
      "Steady progress beats bursts of brilliance.",
      "No extreme needed — just consistent effort.",
      "You're right in the middle. That's solid ground.",
      "Balance is underrated. Own it.",
      "Not too hard, not too soft — just right.",
      "Sustainable beats heroic. Every time.",
      "You don't need to sprint if you never stop.",
      "Middle of the dial, top of the game.",
      "Even-keeled is a superpower in a chaotic world.",
    ],
  }

  const pool = pools[archetype] ?? pools["Balanced"]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5)
}



// ── Avatar picker ─────────────────────────────────────────────────────────────


const AVATAR_COUNT = 21
const BASE_COUNT = 20


function AvatarPicker({
  index,
  onChange,
  currentMessage,
  onSpeakingChange,
}: {
  index: number
  onChange: (i: number) => void
  currentMessage?: string
  onSpeakingChange?: (speaking: boolean) => void
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(1)
  const [calaveraUnlocked, setCalaveraUnlocked] = React.useState(false)
  const streak = React.useRef(1)

  const visibleCount = calaveraUnlocked ? AVATAR_COUNT : BASE_COUNT

  React.useEffect(() => {
    if (!api) return
    api.scrollTo(index, true)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      const snap = api.selectedScrollSnap()
      setCurrent(snap + 1)
      onChange(snap)
    })
  }, [api])

  function handlePrev() {
    if (!api) return
    const snap = api.selectedScrollSnap()
    if (snap === 0) {
      streak.current = 1
    } else {
      streak.current = Math.max(1, streak.current - 1)
    }
    api.scrollPrev()
  }

  function handleNext() {
    if (!api) return
    const snap = api.selectedScrollSnap()
    if (snap === 19 && !calaveraUnlocked) {
      streak.current = Math.min(streak.current + 1, 20)
      if (streak.current >= 20) {
        setCalaveraUnlocked(true)
        setTimeout(() => api.scrollTo(20), 0)
        toast.success("You have unlocked Calavera", {
          // description: "She's the coolest and most extreme cow in the herd!",
          closeButton: true,
        })
      } else {
        api.scrollNext()
      }
    } else {
      streak.current = Math.min(streak.current + 1, 20)
      api.scrollNext()
    }
  }

  return (
    <div className="relative mx-auto max-w-32">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {Array.from({ length: visibleCount }, (_, i) => (
            <CarouselItem key={i}>
              <Card className="m-px">
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <img
                    src={`/avatars/cow-${String(i + 1).padStart(2, "0")}.svg`}
                    alt={`Cowpilot avatar ${i + 1}`}
                    draggable={false}
                    className="w-full h-full object-contain select-none pointer-events-none"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrev} />
        <CarouselNext onClick={handleNext} disabled={false} />
      </Carousel>

      {/* Fuera del carousel — no hay overflow que la recorte */}
      <div className="absolute bottom-[80%] left-[50%] z-20 w-[160px] mb-2">
        <SpeechBubble message={currentMessage} onSpeakingChange={onSpeakingChange} />
      </div>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {calaveraUnlocked ? (
          <span>Cow <span className="font-mono tabular-nums">{current}</span> of <span className="inline-flex items-center gap-1 font-mono">21 <Skull className="size-3" /></span></span>
        ) : (
          <span>Cow <span className="font-mono tabular-nums">{current}</span> of <span className="font-mono tabular-nums">{visibleCount}</span></span>
        )}
      </div>
    </div>
  )
}


const radarChartConfig = {
  value: {
    label: "Level",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig


function PersonalityRadar({ stats }: { stats: CowpilotStats }) {
  const data = [
    { stat: "Intensity", value: stats.intensity },
    { stat: "Warmth", value: stats.warmth },
    { stat: "Discipline", value: stats.discipline },
  ]

  return (
    <ChartContainer
      config={radarChartConfig}
      className="mx-auto aspect-square max-h-[160px] w-full"
    >
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
        <PolarGrid />
        <Radar
          dataKey="value"
          fill="var(--color-value)"
          fillOpacity={0.5}
          dot={{ r: 3, fillOpacity: 1 }}
        />
      </RadarChart>
    </ChartContainer>
  )
}


// ── StatSlider ────────────────────────────────────────────────────────────────


interface StatSliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  lowLabel: string
  highLabel: string
}


function StatSlider({ label, value, onChange, lowLabel, highLabel }: StatSliderProps) {
  const [editing, setEditing] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  function handleNumberClick() {
    setInputValue(String(value))
    setEditing(true)
  }

  function handleInputBlur() {
    const parsed = parseInt(inputValue, 10)
    if (!isNaN(parsed)) onChange(Math.min(100, Math.max(0, parsed)))
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur()
    if (e.key === "Escape") setEditing(false)
  }

  return (
    <div className="flex flex-col gap-1.5 mt-2.5">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-sm font-normal text-foreground">{label}</span>
        {editing ? (
          <input
            autoFocus
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ""))}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-10 text-right text-xs font-mono font-medium bg-muted rounded px-1.5 py-0.5 border border-border focus:outline-none focus:ring-1 focus:ring-ring tabular-nums"
          />
        ) : (
          <span
            onClick={handleNumberClick}
            className="text-xs text-muted-foreground tabular-nums font-mono font-medium cursor-text hover:text-foreground px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
          >
            {value}
          </span>
        )}
      </div>
      <Slider
        min={0} max={100} step={1}
        value={[value]}
        onValueChange={([val]) => onChange(val)}
        aria-label={`${label}: ${value} out of 100`}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}


// ── Archetype ─────────────────────────────────────────────────────────────────


function getArchetype(stats: CowpilotStats): string {
  const { intensity: d, warmth: w, discipline: s } = stats
  const hi = 70
  const lo = 40

  const highD = d >= hi
  const highW = w >= hi
  const highS = s >= hi
  const lowD = d <= lo
  const lowW = w <= lo
  const lowS = s <= lo

  if (highD && highW && highS) return "Legend"
  if (lowD && lowW && lowS) return "Ghost"

  if (highD && highW && !highS) return "Coach"
  if (highD && highS && !highW) return "Commander"
  if (highW && highS && !highD) return "Mentor"

  if (lowD && lowW && !lowS) return "Robot"
  if (lowD && lowS && !lowW) return "Drifter"
  if (lowW && lowS && !lowD) return "Lone Wolf"

  if (highD) return d >= 85 ? "Drill Sergeant" : "Motivator"
  if (highW) return w >= 85 ? "Cheerleader" : "Companion"
  if (highS) return s >= 85 ? "Strategist" : "Planner"

  return "Balanced"
}


// ── Datos por vaca ────────────────────────────────────────────────────────────


const COW_NAMES: string[] = [
  "Connie",    // 01
  "Bella",     // 02
  "Daisy",     // 03
  "Luna",      // 04
  "Blossom",   // 05
  "Buttercup", // 06
  "Rosie",     // 07
  "Clover",    // 08
  "Patches",   // 09
  "Millie",    // 10
  "Stella",    // 11
  "Flora",     // 12
  "Dolly",     // 13
  "Bessie",    // 14
  "Cleo",      // 15
  "Ivy",       // 16
  "Rex",       // 17
  "Maple",     // 18
  "Pearl",     // 19
  "Sunny",     // 20
  "Calavera",   // 21
]

if (COW_NAMES.length !== AVATAR_COUNT) {
  throw new Error("COW_NAMES length must match AVATAR_COUNT")
}

type CowStatPreset = Pick<CowpilotStats, "intensity" | "warmth" | "discipline">

const COW_STAT_PRESETS: CowStatPreset[] = [
  { intensity: 55, warmth: 55, discipline: 55 }, // 01 Connie     → Balanced
  { intensity: 50, warmth: 75, discipline: 50 }, // 02 Bella      → Companion
  { intensity: 45, warmth: 88, discipline: 45 }, // 03 Daisy      → Cheerleader
  { intensity: 45, warmth: 75, discipline: 80 }, // 04 Luna       → Mentor
  { intensity: 75, warmth: 75, discipline: 50 }, // 05 Blossom    → Coach
  { intensity: 45, warmth: 90, discipline: 45 }, // 06 Buttercup  → Cheerleader
  { intensity: 50, warmth: 78, discipline: 55 }, // 07 Rosie      → Companion
  { intensity: 50, warmth: 45, discipline: 78 }, // 08 Clover     → Planner
  { intensity: 30, warmth: 25, discipline: 35 }, // 09 Patches    → Ghost
  { intensity: 60, warmth: 60, discipline: 60 }, // 10 Millie     → Balanced
  { intensity: 78, warmth: 50, discipline: 55 }, // 11 Stella     → Motivator
  { intensity: 35, warmth: 20, discipline: 70 }, // 12 Flora      → Robot
  { intensity: 50, warmth: 40, discipline: 90 }, // 13 Dolly      → Strategist
  { intensity: 80, warmth: 75, discipline: 80 }, // 14 Bessie     → Legend
  { intensity: 65, warmth: 25, discipline: 30 }, // 15 Cleo       → Lone Wolf
  { intensity: 55, warmth: 72, discipline: 75 }, // 16 Ivy        → Mentor
  { intensity: 80, warmth: 30, discipline: 75 }, // 17 Rex        → Commander
  { intensity: 30, warmth: 65, discipline: 25 }, // 18 Maple      → Drifter
  { intensity: 70, warmth: 15, discipline: 20 }, // 19 Pearl      → Lone Wolf
  { intensity: 75, warmth: 80, discipline: 55 }, // 20 Sunny      → Coach
  { intensity: 100, warmth: 5, discipline: 45 }, // 21 calavera    → Drill Sergeant
]


// ── CowpilotCreator ────────────────────────────────────────────────────────────


interface CowpilotCreatorProps {
  stats: CowpilotStats
  onChange: (stats: CowpilotStats) => void
}


export function CowpilotCreator({ stats, onChange }: CowpilotCreatorProps) {
  const nameId = useId()
  const archetype = getArchetype(stats)
  const defaultName = COW_NAMES[stats.avatarIndex]
  const [locked, setLocked] = React.useState(true)
  const [isOpen, setIsOpen] = React.useState(true)
  const [messages, setMessages] = React.useState<string[]>([])
  const [msgIndex, setMsgIndex] = React.useState(0)
  const [isSpeaking, setIsSpeaking] = React.useState(false)

  const [dots, setDots] = React.useState("")

  React.useEffect(() => {
    if (!isSpeaking) return
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".")
    }, 400)
    return () => clearInterval(interval)
  }, [isSpeaking])

  // ── Leer userName del localStorage (puesto por page.tsx) ──────────────────
  const userName = React.useMemo(
    () => (typeof window !== "undefined" ? (localStorage.getItem("cowworker.userName") ?? "") : ""),
    []
  )

  function handleTalk() {
    if (isSpeaking) return
    if (messages.length === 0) {
      const generated = generateMessages(stats, userName)
      setMessages(generated)
      setMsgIndex(0)
    } else {
      const next = (msgIndex + 1) % messages.length
      if (next === 0) setMessages(generateMessages(stats, userName))
      setMsgIndex(next)
    }
  }

  function handleAvatarChange(newIndex: number) {
    setMessages([])
    setMsgIndex(0)
    const preset = COW_STAT_PRESETS[newIndex]
    if (!preset) {
      onChange({ ...stats, avatarIndex: newIndex })
      return
    }
    onChange({
      ...stats,
      avatarIndex: newIndex,
      intensity: preset.intensity,
      warmth: preset.warmth,
      discipline: preset.discipline,
    })
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-0 h-full">
        {/* Avatar + nombre */}
        <div className="relative flex flex-col items-center gap-3 bg-muted/40 rounded-xl p-5 border border-border">
          <div className="text-center">
            <p className="font-display text-[25px] font-medium text-foreground">
              {stats.name.trim() || defaultName}
            </p>
            <p className="text-sm text-muted-foreground">{archetype}</p>
          </div>
          <AvatarPicker
            index={stats.avatarIndex}
            onChange={handleAvatarChange}
            currentMessage={messages[msgIndex]}
            onSpeakingChange={setIsSpeaking}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="absolute bottom-3 right-3 inline-block w-fit">
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-300 relative h-8 w-8 p-0 shadow-none flex items-center justify-center"
                  onClick={handleTalk}
                  disabled={isSpeaking}
                >
                  <span className="relative h-3 w-3">
                    <MessageCircle
                      className={cn("size-3 absolute inset-0 transition-all duration-300", isSpeaking ? "opacity-0 scale-75" : "opacity-100 scale-100")}
                    />
                    <MessageCircleOff
                      className={cn("size-3 absolute inset-0 transition-all duration-300", isSpeaking ? "opacity-100 scale-100" : "opacity-0 scale-75")}
                    />
                  </span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {isSpeaking ? <p className="italic">typing{dots}</p> : <p>Ask your Cowpilot for some motivation</p>}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1.5 pt-5">
          <Label htmlFor={nameId} className="font-display text-base font-normal text-foreground">
            Name
          </Label>
          <Input
            id={nameId}
            placeholder={defaultName}
            value={stats.name}
            maxLength={24}
            onChange={(e) => onChange({ ...stats, name: e.target.value })}
            className="text-sm"
          />
        </div>

        {/* Stats — collapsible */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* Barra: [Lock | Expand] ── STATS ── */}
          <div className="relative flex items-center gap-3 pt-5 pb-1">
            <div className="absolute left-0 bg-card pr-2 z-10">
              <ButtonGroup>
                {!locked && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocked(true)}
                        className="shadow-none group"
                      >
                        <Lock className="size-3 hidden group-hover:block" />
                        <LockOpen className="size-3 block group-hover:hidden" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Lock stats again</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CollapsibleTrigger asChild>
                      <Button size="sm" variant="outline" className="shadow-none">
                        {isOpen
                          ? <Minimize className="size-3" />
                          : <Maximize className="size-3" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isOpen ? "Collapse stats" : "Show stats"}</p>
                  </TooltipContent>
                </Tooltip>
              </ButtonGroup>
            </div>

            <div className="h-px flex-1 bg-border" />
            <span className="font-sans text-xs font-normal uppercase tracking-widest text-muted-foreground">
              Stats
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Sliders + overlay */}
          <CollapsibleContent>
            <div className="pt-6">
              <PersonalityRadar stats={stats} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-2">
                <StatSlider label="Intensity" value={stats.intensity} onChange={(v) => onChange({ ...stats, intensity: v })} lowLabel="Chill" highLabel="Relentless" />
                <StatSlider label="Warmth" value={stats.warmth} onChange={(v) => onChange({ ...stats, warmth: v })} lowLabel="Blunt" highLabel="Caring" />
                <StatSlider label="Discipline" value={stats.discipline} onChange={(v) => onChange({ ...stats, discipline: v })} lowLabel="Loose" highLabel="Strict" />
              </div>

              {locked && (
                <div className="absolute -inset-3 -top-3 flex flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed bg-card">
                  <div className="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <Lock className="size-4" />
                  </div>
                  <span className="font-display text-base font-normal text-foreground">Locked</span>
                  <p className="text-sm/relaxed text-muted-foreground text-center text-balance max-w-[16rem]">
                    Each cow has their own personality. Modify the stats to change how they motivate you
                  </p>
                  <Button
                    size="sm"
                    variant="default"
                    className="shadow-none"
                    onClick={() => { setLocked(false); setIsOpen(true) }}
                  >
                    <Settings2 />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  )
}