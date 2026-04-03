export type Task = {
  id: string
  label: string
  estimatedMinutes: number
}

export type WorkBlock = {
  hardStopMinutes: number
  frogTaskId: string | null
  tasks: Task[]
  hyperfocus: boolean
}

export type CowpilotStats = {
  name: string
  avatarIndex: number
  intensity: number
  warmth: number
  discipline: number
}

export type Archetype =
  | 'Legend'
  | 'Ghost'
  | 'Coach'
  | 'Commander'
  | 'Mentor'
  | 'Robot'
  | 'Drifter'
  | 'Lone Wolf'
  | 'Drill Sergeant'
  | 'Motivator'
  | 'Cheerleader'
  | 'Companion'
  | 'Strategist'
  | 'Planner'
  | 'Balanced'
  | 'Wildcard'

export const COW_NAMES = [
  'Connie',
  'Bella',
  'Daisy',
  'Luna',
  'Blossom',
  'Buttercup',
  'Rosie',
  'Clover',
  'Patches',
  'Millie',
  'Stella',
  'Flora',
  'Dolly',
  'Bessie',
  'Cleo',
  'Ivy',
  'Rex',
  'Maple',
  'Pearl',
  'Sunny',
  'Calavera',
]

// Preset personality stats for each cow (intensity, warmth, discipline)
export const COW_PRESETS: Array<{ intensity: number; warmth: number; discipline: number }> = [
  { intensity: 45, warmth: 80, discipline: 55 }, // Connie - friendly mentor
  { intensity: 30, warmth: 90, discipline: 40 }, // Bella - warm companion
  { intensity: 50, warmth: 75, discipline: 60 }, // Daisy - balanced coach
  { intensity: 25, warmth: 70, discipline: 35 }, // Luna - gentle dreamer
  { intensity: 40, warmth: 85, discipline: 50 }, // Blossom - cheerful motivator
  { intensity: 35, warmth: 95, discipline: 45 }, // Buttercup - pure warmth
  { intensity: 55, warmth: 70, discipline: 65 }, // Rosie - determined worker
  { intensity: 20, warmth: 60, discipline: 30 }, // Clover - laid-back drifter
  { intensity: 60, warmth: 65, discipline: 70 }, // Patches - disciplined trainer
  { intensity: 50, warmth: 80, discipline: 55 }, // Millie - all-rounder
  { intensity: 70, warmth: 55, discipline: 80 }, // Stella - strict commander
  { intensity: 35, warmth: 75, discipline: 45 }, // Flora - gentle guide
  { intensity: 45, warmth: 85, discipline: 50 }, // Dolly - sweet encourager
  { intensity: 65, warmth: 60, discipline: 75 }, // Bessie - tough love
  { intensity: 55, warmth: 50, discipline: 85 }, // Cleo - strategic planner
  { intensity: 40, warmth: 70, discipline: 60 }, // Ivy - steady presence
  { intensity: 80, warmth: 40, discipline: 90 }, // Rex - drill sergeant
  { intensity: 30, warmth: 65, discipline: 40 }, // Maple - calm observer
  { intensity: 25, warmth: 85, discipline: 35 }, // Pearl - soft supporter
  { intensity: 60, warmth: 90, discipline: 55 }, // Sunny - energetic cheerleader
  { intensity: 95, warmth: 25, discipline: 95 }, // Calavera - intense legend (secret)
]

export function getArchetype(intensity: number, warmth: number, discipline: number): Archetype {
  const high = 70
  const low = 35

  // All high
  if (intensity >= high && warmth >= high && discipline >= high) return 'Legend'
  // All low
  if (intensity < low && warmth < low && discipline < low) return 'Ghost'

  // Two high combinations
  if (intensity >= high && warmth >= high && discipline < high) return 'Coach'
  if (intensity >= high && discipline >= high && warmth < high) return 'Commander'
  if (warmth >= high && discipline >= high && intensity < high) return 'Mentor'

  // One high, others low
  if (discipline >= high && intensity < low && warmth < low) return 'Robot'
  if (warmth >= high && intensity < low && discipline < low) return 'Drifter'
  if (intensity >= high && warmth < low && discipline < low) return 'Lone Wolf'

  // One high, one medium
  if (intensity >= high && discipline >= 50) return 'Drill Sergeant'
  if (intensity >= high && warmth >= 50) return 'Motivator'
  if (warmth >= high && intensity >= 50) return 'Cheerleader'
  if (warmth >= high && discipline >= 50) return 'Companion'
  if (discipline >= high && intensity >= 50) return 'Strategist'
  if (discipline >= high && warmth >= 50) return 'Planner'

  // Default balanced
  return 'Balanced'
}

export const ARCHETYPE_MESSAGES: Record<Archetype, string[]> = {
  Legend: [
    "We're going to do legendary things today, {name}!",
    "Champions don't make excuses. Let's crush this!",
    "You've got everything it takes. Now prove it!",
  ],
  Ghost: [
    "I'm here... just... floating along with you.",
    "No pressure. We're just vibing.",
    "Whatever happens, happens.",
  ],
  Coach: [
    "Alright {name}, game face on! You've got this!",
    "I believe in you! Now let's make something happen!",
    "Energy high, focus sharp. Let's go!",
  ],
  Commander: [
    "Mission objectives are clear. Execute.",
    "No distractions. Pure efficiency.",
    "We have a plan. Stick to it.",
  ],
  Mentor: [
    "Take your time, {name}. Quality over speed.",
    "I'm proud of you for showing up today.",
    "Remember: progress, not perfection.",
  ],
  Robot: [
    "Task initiated. Proceeding with workflow.",
    "Efficiency protocols engaged.",
    "Optimal productivity parameters detected.",
  ],
  Drifter: [
    "Hey {name}... want to maybe do some work? No rush.",
    "I'm here for moral support, mostly.",
    "We'll figure it out as we go.",
  ],
  'Lone Wolf': [
    "Let's hunt this down and destroy it.",
    "No team needed. Just raw power.",
    "Intensity mode: activated.",
  ],
  'Drill Sergeant': [
    "Drop and give me 25 minutes of focused work!",
    "No excuses! No breaks! No mercy!",
    "You think this is hard? Push through!",
  ],
  Motivator: [
    "You're amazing, {name}! Now channel that energy!",
    "Feel the fire! Use it! GO!",
    "Your potential is UNLIMITED!",
  ],
  Cheerleader: [
    "Go {name}! Go {name}! You can do it!",
    "I'm your biggest fan! Show me what you've got!",
    "Every step forward is a WIN!",
  ],
  Companion: [
    "I'm right here with you, {name}. Always.",
    "We're in this together. Take your time.",
    "You're not alone. I've got your back.",
  ],
  Strategist: [
    "Let's analyze the optimal approach.",
    "Strategic assessment complete. Proceed.",
    "Maximum efficiency through careful planning.",
  ],
  Planner: [
    "First things first. Let's organize.",
    "A good plan today means success tomorrow.",
    "Structure creates freedom, {name}.",
  ],
  Balanced: [
    "Ready when you are, {name}!",
    "Let's find our rhythm today.",
    "Steady progress, steady wins.",
  ],
  Wildcard: [
    "Expect the unexpected with me!",
    "Rules? What rules?",
    "Let's shake things up today!",
  ],
}

export function getRandomMessage(archetype: Archetype, userName?: string): string {
  const messages = ARCHETYPE_MESSAGES[archetype]
  const message = messages[Math.floor(Math.random() * messages.length)]
  return userName ? message.replace(/{name}/g, userName) : message.replace(/{name}/g, 'friend')
}
