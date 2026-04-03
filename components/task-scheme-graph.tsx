"use client"

import * as React from "react"
import { Trash2, GripVertical, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type Task = {
  id: string
  label: string
  estimatedMinutes: number
}

interface TaskSchemeGraphProps {
  tasks: Task[]
  onAddTask: () => void
  onRemoveTask: (id: string) => void
  onUpdateTask: (id: string, patch: Partial<Task>) => void
  totalBudget: number
}

const NODE_WIDTH = 200
const NODE_HEIGHT = 90
const NODE_GAP_Y = 60
const START_X = 100
const START_Y = 40

export function TaskSchemeGraph({
  tasks,
  onAddTask,
  onRemoveTask,
  onUpdateTask,
  totalBudget,
}: TaskSchemeGraphProps) {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [nodePositions, setNodePositions] = React.useState<Record<string, { x: number; y: number }>>({})
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)
  const overBudget = totalMinutes > totalBudget

  // Initialize positions vertically
  React.useEffect(() => {
    setNodePositions((prev) => {
      const positions: Record<string, { x: number; y: number }> = { ...prev }
      tasks.forEach((task, i) => {
        if (!positions[task.id]) {
          positions[task.id] = {
            x: START_X,
            y: START_Y + i * (NODE_HEIGHT + NODE_GAP_Y),
          }
        }
      })
      // Clean up removed tasks
      Object.keys(positions).forEach((id) => {
        if (!tasks.find((t) => t.id === id)) {
          delete positions[id]
        }
      })
      return positions
    })
  }, [tasks])

  // Calculate canvas height based on node positions
  const maxY = Math.max(
    400,
    ...Object.values(nodePositions).map((p) => p.y + NODE_HEIGHT + 60)
  )

  // Handle drag start
  function handleMouseDown(taskId: string, e: React.MouseEvent) {
    e.stopPropagation()
    const pos = nodePositions[taskId]
    if (!pos) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    setDragging(taskId)
    setDragOffset({
      x: e.clientX - rect.left - pos.x,
      y: e.clientY - rect.top - pos.y,
    })
  }

  // Handle drag move
  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const newX = Math.max(20, e.clientX - rect.left - dragOffset.x)
    const newY = Math.max(20, e.clientY - rect.top - dragOffset.y)

    setNodePositions((prev) => ({
      ...prev,
      [dragging]: { x: newX, y: newY },
    }))
  }

  // Handle drag end
  function handleMouseUp() {
    setDragging(null)
  }

  // Get connection path between two nodes (vertical)
  function getConnectionPath(fromId: string, toId: string) {
    const pos1 = nodePositions[fromId]
    const pos2 = nodePositions[toId]
    if (!pos1 || !pos2) return null

    const startX = pos1.x + NODE_WIDTH / 2
    const startY = pos1.y + NODE_HEIGHT
    const endX = pos2.x + NODE_WIDTH / 2
    const endY = pos2.y

    // Bezier curve for smooth vertical connection
    const midY = (startY + endY) / 2

    return {
      path: `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`,
      arrowX: endX,
      arrowY: endY,
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {tasks.length === 0
            ? "No tasks yet — add one to start"
            : `${tasks.length} task${tasks.length > 1 ? "s" : ""}`}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTask}
          className="gap-1.5 text-xs shadow-none"
        >
          <Plus className="size-3.5" />
          Add task
        </Button>
      </div>

      {/* Graph canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-border overflow-y-auto select-none"
        style={{ minHeight: 400, maxHeight: 500 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedTaskId(null)}
      >
        {/* Dots pattern background */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height={maxY}
        >
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle
                cx="2"
                cy="2"
                r="1"
                fill="currentColor"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />

          {/* Connection lines + dots between nodes (in task order) */}
          {tasks.slice(0, -1).map((task) => {
            const nextTask = tasks[tasks.indexOf(task) + 1]
            const connection = getConnectionPath(task.id, nextTask.id)
            if (!connection) return null

            return (
              <g key={`connection-${task.id}`}>
                {/* Line */}
                <path
                  d={connection.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/40"
                />
                {/* Dot at the end */}
                <circle
                  cx={connection.arrowX}
                  cy={connection.arrowY - 4}
                  r={4}
                  fill="currentColor"
                  className="text-primary/60"
                />
              </g>
            )
          })}
        </svg>

        {/* Task nodes */}
        <div className="relative" style={{ width: "100%", height: maxY }}>
          {tasks.map((task, i) => {
            const pos = nodePositions[task.id]
            if (!pos) return null

            const isSelected = selectedTaskId === task.id
            const isDragging = dragging === task.id

            return (
              <div
                key={task.id}
                className={cn(
                  "absolute flex flex-col rounded-xl border-2 bg-card shadow-md transition-shadow",
                  isDragging && "shadow-xl z-20 cursor-grabbing",
                  isSelected
                    ? "border-primary ring-4 ring-primary/20 z-10"
                    : "border-border hover:border-primary/50 hover:shadow-lg"
                )}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: NODE_WIDTH,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isDragging) setSelectedTaskId(isSelected ? null : task.id)
                }}
              >
                {/* Node header (draggable) */}
                <div
                  className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/50 rounded-t-[10px] cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => handleMouseDown(task.id, e)}
                >
                  <GripVertical className="size-3 text-muted-foreground" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex-1">
                    Task
                  </span>
                  {isSelected && (
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveTask(task.id)
                        setSelectedTaskId(null)
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Node body */}
                <div className="px-3 py-3 flex flex-col gap-2">
                  {isSelected ? (
                    <>
                      <Input
                        placeholder="Task name"
                        value={task.label}
                        onChange={(e) => onUpdateTask(task.id, { label: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3 text-muted-foreground" />
                        <Input
                          type="number"
                          min={1}
                          max={180}
                          value={task.estimatedMinutes}
                          onChange={(e) =>
                            onUpdateTask(task.id, { estimatedMinutes: Number(e.target.value) || 5 })
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 w-14 text-xs font-mono tabular-nums text-center"
                        />
                        <span className="text-xs text-muted-foreground">min</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate">
                        {task.label || <span className="italic text-muted-foreground">Unnamed</span>}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span className="font-mono tabular-nums">{task.estimatedMinutes}m</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget indicator */}
      {tasks.length > 0 && (
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-2 text-xs",
            overBudget ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
          )}
        >
          <span>Estimated total</span>
          <span className="font-mono font-medium tabular-nums">
            {totalMinutes}m / {totalBudget}m
            {overBudget && " — over budget!"}
          </span>
        </div>
      )}
    </div>
  )
}
