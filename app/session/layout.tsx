import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cowworker — Focus Session",
  description: "Your active focus session with your bovine copilot.",
}

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {children}
    </div>
  )
}
