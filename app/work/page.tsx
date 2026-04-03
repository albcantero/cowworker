"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Header } from "@/components/header"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { CowpilotCreator, DEFAULT_COWPILOT_STATS, generateMessages, type CowpilotStats } from "@/components/cowpilot-creator"
import { WorkBlockBuilder, type WorkBlock } from "@/components/work-block-builder"
import { UserPen, CloudUpload } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

const DEFAULT_BLOCK: WorkBlock = {
  hardStopMinutes: 60,
  frogTaskId: null,
  tasks: [],
  hyperfocus: false,
}

export default function WorkPage() {
  const [cowpilot, setCowpilot] = useState<CowpilotStats>(DEFAULT_COWPILOT_STATS)
  const [block, setBlock] = useState<WorkBlock>(DEFAULT_BLOCK)
  const [error, setError] = useState<string | null>(null)

  // ── userName ──────────────────────────────────────────────────────
  const [userName, setUserName] = useState<string>("")
  const [dialogInput, setDialogInput] = useState("")
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setUserName(localStorage.getItem("cowworker.userName") ?? "")
    setMounted(true)
  }, [])

  function handleSaveUserName(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = dialogInput.trim()
    if (!trimmed) return
    localStorage.setItem("cowworker.userName", trimmed)
    setUserName(trimmed)
  }

  // ── edit name inline ──────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false)
  const [hoveringName, setHoveringName] = useState(false)
  const [nameInput, setNameInput] = useState("")

  const nameRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (editingName && nameRef.current) {
      const el = nameRef.current
      el.focus()
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(el)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [editingName])

  function handleStartEdit() {
    setNameInput(userName)
    setEditingName(true)
  }

  function handleSaveName() {
    const trimmed = nameInput.trim()
    if (trimmed) {
      localStorage.setItem("cowworker.userName", trimmed)
      setUserName(trimmed)
    }
    setEditingName(false)
    setHoveringName(false)
  }

  function handleNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSaveName()
    if (e.key === "Escape") setEditingName(false)
  }
  // ────────

  function handleLaunch() {
    if (!block.frogTaskId) {
      setError("Please add a Frog task — it's what gets you started.")
      return
    }
    setError(null)

    const sessionData = JSON.stringify({
      cowpilot,
      messages: generateMessages(cowpilot, userName),
      block,
    })
    sessionStorage.setItem("cowworker_session", sessionData)

    const w = 400, h = 680
    const left = Math.round(window.screen.width / 2 - w / 2)
    const top = Math.round(window.screen.height / 2 - h / 2)
    window.open("/session", "cowworker_live",
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
    )
  }

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Dialog — sólo si NO hay userName */}
      {mounted && !userName && (
        <Dialog open>
          <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Welcome to Cowworker 🐄</DialogTitle>
              <DialogDescription className="flex flex-col gap-1">
                <span>What's your name? Your cowpilot wants to know who they're working with.</span>
                <span className="text-xs">🔒 Stays in your browser only. We store nothing.</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveUserName} className="flex flex-col gap-4 pt-2">
              <Input
                autoFocus
                placeholder="e.g. John Doe"
                value={dialogInput}
                maxLength={32}
                onChange={(e) => setDialogInput(e.target.value)}
              />
              <Button type="submit" disabled={!dialogInput.trim()}>
                Let's go
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <GridPattern className="opacity-40 stroke-border" />
      <div className="relative flex flex-col min-h-dvh">
        <Header />
        <div className="flex-1 flex items-start justify-center px-6 pt-6 pb-10">
          <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-80 shrink-0">
              <ColumnCard
                onMouseEnter={() => setHoveringName(true)}
                onMouseLeave={() => setHoveringName(false)}
                label={
                  editingName ? (
                    <span className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                handleSaveName()
                              }}
                              className="absolute left-5 shadow-none text-foreground"
                            >
                              <CloudUpload className="size-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Save Changes
                            <Kbd data-icon="inline-end" className="translate-x-0.5">
                              ⏎
                            </Kbd>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span
                        ref={nameRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => setNameInput(e.currentTarget.textContent ?? "")}
                        onKeyDown={handleNameKeyDown}
                        onBlur={handleSaveName}
                        className="ml-10 px-1 bg-transparent font-display text-lg font-medium text-foreground border-b border-border focus:outline-none focus:border-primary whitespace-nowrap"
                      >
                        {userName}
                      </span>
                      <span className="text-muted-foreground font-normal text-base">'s Cowpilot</span>
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "flex items-center transition-all duration-150",
                        hoveringName ? "pl-10" : "pl-0"
                      )}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={handleStartEdit}
                              className={cn(
                                "absolute left-5 ms-px shadow-none text-foreground transition-all duration-150",
                                hoveringName ? "opacity-100" : "opacity-0 pointer-events-none"
                              )}
                            >
                              <UserPen className="size-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Name</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {userName ? `${userName}'s Cowpilot` : "Cowpilot"}
                    </span>
                  )
                }
              >
                <CowpilotCreator stats={cowpilot} onChange={setCowpilot} />
              </ColumnCard>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <ColumnCard label="Work Block">
                <WorkBlockBuilder block={block} onChange={setBlock} />
              </ColumnCard>

              {error && (
                <p className="text-sm text-destructive text-center" role="alert">
                  {error}
                </p>
              )}

              <Button
                onClick={handleLaunch}
                className={cn(
                  "w-full rounded-2xl py-4 text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm",
                  block.hyperfocus
                    ? "bg-amber-400 text-amber-950"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {block.hyperfocus ? "Let's focus hard" : "Let's work"}
              </Button>

              <p className="text-center text-xs text-muted-foreground pb-4">
                No login. No data stored. Just you, your tasks, and a cow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColumnCard({ label, children, onMouseEnter, onMouseLeave }: {
  label: React.ReactNode
  children: React.ReactNode
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div
        className="relative flex items-center border-b border-border px-5 py-3.5 bg-muted/30"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span className="font-display text-lg font-medium text-foreground">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
