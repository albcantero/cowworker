"use client"

import * as React from "react"
import { Lock, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DurationInput } from "@/components/ui/duration-input"
import { TaskSchemeGraph } from "@/components/task-scheme-graph"
import { cn } from "@/lib/utils"
import type { Task, WorkBlock } from "@/lib/cow-data"

export type { Task, WorkBlock }

interface WorkBlockBuilderProps {
  block: WorkBlock
  onChange: (block: WorkBlock) => void
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

const TIME_PRESETS = [
  { label: "25m", mins: 25 },
  { label: "45m", mins: 45 },
  { label: "1.5h", mins: 90 },
  { label: "2h", mins: 120 },
  { label: "3h", mins: 180 },
  { label: "4h", mins: 240 },
]

// ── WorkBlockBuilder ──────────────────────────────────────────────────────────

export function WorkBlockBuilder({ block, onChange }: WorkBlockBuilderProps) {
  const [activeTab, setActiveTab] = React.useState("time")
  const [timeStepCompleted, setTimeStepCompleted] = React.useState(false)
  const [tasksStepCompleted, setTasksStepCompleted] = React.useState(false)

  const canConfirmTime = block.hardStopMinutes > 0
  const canConfirmTasks = block.tasks.length > 0
  const frogTask = block.tasks.find((t) => t.id === block.frogTaskId) ?? null

  function addTask() {
    onChange({ ...block, tasks: [...block.tasks, { id: generateId(), label: "", estimatedMinutes: 15 }] })
  }

  function removeTask(id: string) {
    onChange({
      ...block,
      tasks: block.tasks.filter((t) => t.id !== id),
      frogTaskId: block.frogTaskId === id ? null : block.frogTaskId,
    })
  }

  function updateTask(id: string, patch: Partial<Task>) {
    onChange({ ...block, tasks: block.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })
  }

  function formatTime(mins: number) {
    if (mins < 60) return `${mins}m`
    if (mins % 60 === 0) return `${mins / 60}h`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>

        <TabsList>
          <TabsTrigger value="time" className="font-sans font-semibold">
            Time Block
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            disabled={!timeStepCompleted}
            className={cn("font-sans font-semibold", !timeStepCompleted && "cursor-not-allowed")}
          >
            {!timeStepCompleted
              ? <><Lock className="size-3 mr-1.5 inline-block" />Task scheme</>
              : "Task Scheme"
            }
          </TabsTrigger>
          <TabsTrigger
            value="frog"
            disabled={!tasksStepCompleted}
            className={cn("font-sans font-semibold", !tasksStepCompleted && "cursor-not-allowed")}
          >
            {!tasksStepCompleted
              ? <><Lock className="size-3 inline-block" />Eat the Frog</>
              : "Eat the Frog"
            }
          </TabsTrigger>
        </TabsList>

        {/* ── Tab A: Time block ────────────────────────────────────────── */}
        <TabsContent value="time">
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <p className="font-display text-base text-foreground">How long will we work?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set a hard stop — a fixed end time that makes the session feel finite.
              </p>
            </div>

            {/* Quick access buttons */}
            <div className="flex flex-wrap gap-2">
              {TIME_PRESETS.map(({ label, mins }) => (
                <button
                  key={mins}
                  onClick={() => onChange({ ...block, hardStopMinutes: mins })}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono tabular-nums text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* DurationInput en su propia Card */}
            <Card className="p-6 shadow-none flex items-center justify-center">
              <DurationInput
                totalMinutes={block.hardStopMinutes}
                onChange={(mins) => onChange({ ...block, hardStopMinutes: mins })}
              />
            </Card>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="group"
                disabled={!canConfirmTime}
                onClick={() => {
                  setTimeStepCompleted(true)
                  setActiveTab("tasks")
                }}
              >
                Next
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab B: Task scheme ───────────────────────────────────────── */}
        <TabsContent value="tasks">
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <p className="font-display text-sm font-semibold text-foreground">What do you want to get done?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add your tasks and estimate how long each will take. You have{" "}
                <span className="font-mono font-medium text-foreground">{formatTime(block.hardStopMinutes)}</span> total.
              </p>
            </div>

            <TaskSchemeGraph
              tasks={block.tasks}
              onAddTask={addTask}
              onRemoveTask={removeTask}
              onUpdateTask={updateTask}
              totalBudget={block.hardStopMinutes}
            />

            <div className="flex justify-end">
              <Button
                variant="ghost"
                className="group"
                disabled={!canConfirmTasks}
                onClick={() => {
                  setTasksStepCompleted(true)
                  setActiveTab("frog")
                }}
              >
                Next
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab C: Eat the frog ──────────────────────────────────────── */}
        <TabsContent value="frog">
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Which one is your frog?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                The hardest task — the one you've been avoiding. Do it first.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {block.tasks.map((task) => {
                const isSelected = block.frogTaskId === task.id
                return (
                  <button
                    key={task.id}
                    onClick={() => onChange({ ...block, frogTaskId: isSelected ? null : task.id })}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    <span className="text-base shrink-0">{isSelected ? "🐸" : "·"}</span>
                    <span className="flex-1 text-sm font-medium">
                      {task.label || <span className="italic opacity-60">Unnamed task</span>}
                    </span>
                    <span className={cn(
                      "text-xs font-mono tabular-nums shrink-0",
                      isSelected ? "opacity-80" : "text-muted-foreground"
                    )}>
                      {task.estimatedMinutes}m
                    </span>
                  </button>
                )
              })}
            </div>

            {block.frogTaskId && (
              <p className="text-xs text-muted-foreground text-center">
                🐸 You'll start with{" "}
                <span className="font-semibold text-foreground">{frogTask?.label || "this task"}</span>. Good choice.
              </p>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
