export type Calculator = {
  id: string
  title: string
  description: string
  category: "BigKidMath" | "CipherLab" | "GeekGalaxy" | "LifeHacks" | "Math_Magik" | "Otaku_Ops"
  slug: string
  icon?: string
}

export const calculators: Calculator[] = [
  {
    id: "caffeine-half-life",
    title: "Caffeine Half-Life Calculator",
    description: "Track your caffeine metabolism with scientific accuracy.",
    category: "BigKidMath",
    slug: "caffeine-half-life",
    icon: "☕"
  },
  {
    id: "car-vs-uber",
    title: "Car Ownership vs. Uber Cost",
    description: "Compare the true cost of owning a car vs using rideshare.",
    category: "BigKidMath",
    slug: "car-vs-uber",
    icon: "🚗"
  },
  {
    id: "generational-timeline",
    title: "Generational Timeline",
    description: "Explore events and trends across different generations.",
    category: "BigKidMath",
    slug: "generational-timeline",
    icon: "👥"
  },
  {
    id: "lightning-life",
    title: "Lightning-Powered Life",
    description: "How many lightning strikes would it take to power your life?",
    category: "BigKidMath",
    slug: "lightning-life",
    icon: "⚡"
  },
  {
    id: "power-footprint",
    title: "The Footprint of Power",
    description: "Compare land use requirements for Solar vs. Wind vs. Nuclear.",
    category: "BigKidMath",
    slug: "power-footprint",
    icon: "🦶"
  },
  {
    id: "caesar-cipher",
    title: "Caesar Cipher",
    description: "Encrypt messages with the ancient Roman shift cipher.",
    category: "CipherLab",
    slug: "caesar-cipher",
    icon: "🏛️"
  },
  {
    id: "nato-phonetic",
    title: "NATO Phonetic Alphabet",
    description: "Convert text to Alpha, Bravo, Charlie used by pilots.",
    category: "CipherLab",
    slug: "nato-phonetic",
    icon: "✈️"
  },
  {
    id: "pigpen-cipher",
    title: "Pigpen Cipher",
    description: "Visual geometric cipher used by Freemasons.",
    category: "CipherLab",
    slug: "pigpen-cipher",
    icon: "🐷"
  },
  {
    id: "morse-code",
    title: "Morse Code Broadcast",
    description: "Translate text to audible Morse Code dits and dahs.",
    category: "CipherLab",
    slug: "morse-code",
    icon: "📡"
  },
  {
    id: "password-anger",
    title: "Password Anger Scale",
    description: "How angry would a hacker get trying to crack your password?",
    category: "CipherLab",
    slug: "password-anger",
    icon: "😡"
  },
  {
    id: "ogham-translator",
    title: "Ogham Translator",
    description: "Convert text to Ancient Irish tree alphabet.",
    category: "CipherLab",
    slug: "ogham-translator",
    icon: "🗿"
  },
  {
    id: "shavian-translator",
    title: "Shavian Alphabet",
    description: "George Bernard Shaw's phonetic alphabet for English.",
    category: "CipherLab",
    slug: "shavian-translator",
    icon: "🇬🇧"
  },
  {
    id: "zombie-survival",
    title: "Zombie Apocalypse Survival",
    description: "Calculate your odds of surviving a zombie outbreak.",
    category: "GeekGalaxy",
    slug: "zombie-survival",
    icon: "🧟"
  },
  {
    id: "space-travel",
    title: "Space Travel Time",
    description: "Calculate travel time to planets and stars.",
    category: "GeekGalaxy",
    slug: "space-travel",
    icon: "🚀"
  },

  // Geek Galaxy
  {
    id: "spaceship-fuel",
    title: "Spaceship Fuel Planner",
    description: "Plan your interstellar fuel loadout.",
    category: "GeekGalaxy",
    slug: "spaceship-fuel",
    icon: "⛽"
  },
  {
    id: "lightsaber-battery",
    title: "Lightsaber Battery Life",
    description: "Don't run out of charge mid-duel.",
    category: "GeekGalaxy",
    slug: "lightsaber-battery",
    icon: "⚔️"
  },
  {
    id: "ai-doomsday",
    title: "AI Doomsday Countdown",
    description: "Probability of the singularity.",
    category: "GeekGalaxy",
    slug: "ai-doomsday",
    icon: "🤖"
  },
  {
    id: "alien-communication",
    title: "Alien Communication Probability",
    description: "Drake Equation visualizer.",
    category: "GeekGalaxy",
    slug: "alien-communication",
    icon: "👽"
  },
  {
    id: "potion-brewer",
    title: "Potion Brewer",
    description: "Mix ingredients for RPG effects.",
    category: "GeekGalaxy",
    slug: "potion-brewer",
    icon: "🧪"
  },
  {
    id: "force-sensitivity",
    title: "Force Sensitivity Test",
    description: "Estimate your midi-chlorian count.",
    category: "GeekGalaxy",
    slug: "force-sensitivity",
    icon: "🧘"
  },
  {
    id: "warp-speed",
    title: "Warp Speed Converter",
    description: "Star Trek Warp Factors to Light Speed.",
    category: "GeekGalaxy",
    slug: "warp-speed",
    icon: "🖖"
  },
  {
    id: "time-paradox",
    title: "Time Paradox Detector",
    description: "Safe travel through the timeline.",
    category: "GeekGalaxy",
    slug: "time-paradox",
    icon: "⌛"
  },
  {
    id: "beskar-armor",
    title: "Beskar Armor Calculator",
    description: "Cost to forge Mandalorian armor.",
    category: "GeekGalaxy",
    slug: "beskar-armor",
    icon: "🛡️"
  },

  // Otaku Ops
  {
    id: "anime-training",
    title: "Anime Training Montage Planner",
    description: "Plan your ultimate training arc.",
    category: "Otaku_Ops",
    slug: "anime-training",
    icon: "💪"
  },
  {
    id: "waifu-compatibility",
    title: "Waifu Compatibility Matrix",
    description: "Check your compatibility with anime characters.",
    category: "Otaku_Ops",
    slug: "waifu-compatibility",
    icon: "❤️"
  },
  {
    id: "minecraft-portal",
    title: "Minecraft Portal Planner",
    description: "Link Nether portals correctly.",
    category: "Otaku_Ops",
    slug: "minecraft-portal",
    icon: "🔥"
  },
  {
    id: "conspiracy-theory",
    title: "Conspiracy Plausibility",
    description: "Is the truth really out there?",
    category: "Otaku_Ops",
    slug: "conspiracy-theory",
    icon: "👁️"
  },

  // Math Magik
  {
    id: "pizza-pi",
    title: "Pizza Pi Calculator",
    description: "Optimize your pizza orders.",
    category: "Math_Magik",
    slug: "pizza-pi",
    icon: "🍕"
  },
  {
    id: "fire-number",
    title: "FIRE Number Calculator",
    description: "Financial Independence, Retire Early.",
    category: "Math_Magik",
    slug: "fire-number",
    icon: "🔥"
  },
  {
    id: "double-pendulum",
    title: "Double Pendulum Chaos",
    description: "Simulate chaotic physics.",
    category: "Math_Magik",
    slug: "double-pendulum",
    icon: "〰️"
  },
  {
    id: "chaos-explorer",
    title: "Chaos Theory Explorer",
    description: "Visualize the Butterfly Effect.",
    category: "Math_Magik",
    slug: "chaos-explorer",
    icon: "🦋"
  },
  {
    id: "inflation-impact",
    title: "Inflation Impact",
    description: "Historical purchasing power.",
    category: "Math_Magik",
    slug: "inflation-impact",
    icon: "💸"
  },
  {
    id: "life-visualized",
    title: "Your Life Visualized",
    description: "Memento Mori weeks grid.",
    category: "Math_Magik",
    slug: "life-visualized",
    icon: "📅"
  },

  // Life Hacks
  {
    id: "sleep-cycle",
    title: "Sleep Cycle Optimizer",
    description: "Plan your sleep around 90-minute REM cycles.",
    category: "LifeHacks",
    slug: "sleep-cycle",
    icon: "🌙"
  },
  {
    id: "procrastination-roi",
    title: "Procrastination ROI",
    description: "Visualize when the Panic Monster will strike.",
    category: "LifeHacks",
    slug: "procrastination-roi",
    icon: "💣"
  },
  {
    id: "social-media-addiction",
    title: "Social Media Addiction",
    description: "How many years of your life are spent scrolling?",
    category: "LifeHacks",
    slug: "social-media-addiction",
    icon: "📱"
  },
  {
    id: "coffee-code",
    title: "Coffee to Code Efficiency",
    description: "Calculate caffeine-fueled productivity.",
    category: "LifeHacks",
    slug: "coffee-code",
    icon: "☕"
  },
  {
    id: "stress-ice-cream",
    title: "Stress-to-Ice-Cream Ratio",
    description: "Emotional support dairy calculator.",
    category: "LifeHacks",
    slug: "stress-ice-cream",
    icon: "🍦"
  },
  {
    id: "time-is-money",
    title: "Time is Money",
    description: "Convert purchase costs into hours of your life.",
    category: "LifeHacks",
    slug: "time-is-money",
    icon: "⏳"
  },
  {
    id: "pepper-scale",
    title: "How Hot Is That Pepper?",
    description: "Scoville scale visualizer & survival guide.",
    category: "LifeHacks",
    slug: "pepper-scale",
    icon: "🌶️"
  },
  {
    id: "should-i-engage",
    title: "Should I Engage?",
    description: "Strategic decision tree for conversations.",
    category: "LifeHacks",
    slug: "should-i-engage",
    icon: "🤔"
  }
]
