"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowUpRight, CircleQuestionMark, InfoIcon } from "lucide-react"
import CowworkerLogo from "@/components/logo"

function GitHubIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 438.549 438.549" className={cn("size-4", className)}>
			<path
				fill="currentColor"
				d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
			/>
		</svg>
	)
}

interface HeaderProps {
	githubUrl?: string
	githubStars?: string
}

export function Header({
	githubUrl = "https://github.com/albcantero/cowworker",
	githubStars,
}: HeaderProps) {
	return (
		<header className="w-full pt-6 px-4 md:px-6">
			<div className="mx-auto max-w-5xl">
				<div className="relative flex h-10 items-center rounded-2xl border border-border bg-card shadow-sm px-4">

					{/* ── Izquierda: About ─────────────────────────────────────── */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="ghost" size="sm">
								<InfoIcon />
								About
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-4xl">
							<DialogHeader>
								<DialogTitle className="font-display">About</DialogTitle>
							</DialogHeader>
							<AboutBody />
						</DialogContent>
					</Dialog>

					{/* ── Centro: brand ────────────────────────────────────────── */}
					<a
						href="/"
						className="absolute left-1/2 -translate-x-1/2 font-display font-semibold text-xl tracking-tighter text-foreground hover:opacity-70 transition-opacity"
						aria-label="cowworker home"
					>
						<CowworkerLogo className="h-2 lg:h-4 w-auto text-primary" />
					</a>

					{/* ── Derecha: GitHub ──────────────────────────────────────── */}
					<div className="ml-auto">
						<a
							href={githubUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
						>
							<GitHubIcon />
							{githubStars && (
								<span className="text-xs text-muted-foreground tabular-nums">{githubStars}</span>
							)}
						</a>
					</div>

				</div>
			</div>
		</header>
	)
}

// ── About content ─────────────────────────────────────────────────────────────

function AboutBody() {
	return (
		<div className="grid sm:grid-cols-2 gap-8 mt-2 text-sm text-muted-foreground leading-relaxed">

			{/* ── Col 1: About + neuroscience ── */}
			<div className="space-y-2">
				<div className="space-y-2 text-xs">
					<p>
						Cowworker is a side project by{" "}
						<a href="https://github.com/albcantero" target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity">
							Alberto Cantero
						</a>
						, built out of personal frustration with productivity apps that weren't built for ADHD brains. Most tools assume you can manufacture motivation on demand. ADHD doesn't work that way.
					</p>
				</div>

				<div className="border-t border-border pt-4 space-y-2">
					<div>
						<p className="font-display text-base font-semibold text-foreground">The neuroscience behind Cowworker</p>
					</div>

					<div className="space-y-2 text-xs">
						<p>
							<span className="text-foreground underline">Body doubling</span> works because the ADHD brain has disrupted dopamine pathways that reduce self-generated motivation. External presence — even passive — activates the brain's social monitoring systems and dopamine reward circuitry, increasing sustained attention. This is sometimes called the <em>co-action effect</em>, documented in social facilitation research since 1898.
						</p>

						<p>
							<span className="text-foreground underline">Eat the frog</span> targets task initiation, one of the core executive function deficits in ADHD. Dr. Russell Barkley describes ADHD primarily as a <em>performance disorder</em> — not a knowledge or attention disorder — where the prefrontal cortex fails to bridge intention and action. Committing to one concrete first task reduces the cognitive cost of starting.
						</p>

						<p>
							<span className="text-foreground underline">Timeboxing</span> addresses time blindness — or <em>temporal myopia</em>, Barkley's term for the ADHD experience of time as either infinite or nonexistent. This is partly linked to differences in the cerebellum, which regulates time perception, and to executive function deficits more broadly. External time anchors compensate for the brain's unreliable internal clock.
						</p>
					</div>
				</div>
			</div>

			{/* ── Col 2: Why it's hard + further reading ── */}
			<div className="space-y-2">
				<div>
					<p className="font-display text-base font-semibold text-foreground">Why standard tools fail</p>
				</div>
				<div className="space-y-2 text-xs">

					<p>
						ADHD brains have lower baseline dopamine. Tasks that aren't interesting or novel don't generate enough reward signal to sustain engagement — so the brain wanders off looking for stimulation. This isn't laziness. It's neurochemistry.
					</p>

					<p>
						On top of that, ADHD involves real working memory deficits. You can start a task and genuinely forget what you were doing mid-way. Prioritization is also harder — staring at a long to-do list can cause <em>prioritization paralysis</em>, where the cognitive overhead of choosing what to do next prevents starting anything at all.
					</p>

					<p>
						Cowworker doesn't try to fix these things. It works around them: a copilot to borrow external motivation, a frog task to eliminate prioritization paralysis, a hard stop to make time feel real, and hyperfocus mode to protect flow when it happens.
					</p>
				</div>

				<div className="border-t border-border pt-4 space-y-2">
					<div>
						<p className="font-display text-base font-semibold text-foreground">Further reading on Understood.org</p>
						<p className="text-xs text-muted-foreground inline-flex items-center gap-1">
							<CircleQuestionMark className="size-3" />
							Expert-vetted nonprofit resource for learning and thinking differences.</p>
					</div>

					<ol className="space-y-1 text-xs list-decimal pl-4">
						{[
							{ label: "ADHD and “time blindness”", href: "https://www.understood.org/en/articles/adhd-time-blindness" },
							{ label: "ADHD and the brain", href: "https://www.understood.org/en/articles/adhd-and-the-brain" },
							{ label: "Understanding ADHD and hyperfocus", href: "https://www.understood.org/en/articles/adhd-hyperfocus" },
							{ label: "How to focus with ADHD", href: "https://www.understood.org/en/articles/adhd-focus-tips" },
							{ label: "How to get motivated with ADHD", href: "https://www.understood.org/en/articles/how-to-get-motivated-with-adhd" },
							{ label: "Six ways AI can help you manage ADHD symptoms", href: "https://www.understood.org/en/articles/adhd-ai-tools" },
						].map((link) => (
							<li key={link.href}>
								<a href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:underline underline-offset-2 hover:text-foreground transition-colors">
									{link.label}
									<ArrowUpRight className="size-3" />
								</a>
							</li>
						))}
					</ol>
				</div>
			</div>

		</div>
	)
}