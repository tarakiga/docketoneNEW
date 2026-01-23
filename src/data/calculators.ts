export type Calculator = {
  id: string
  title: string
  description: string
  category: "BigKidMath" | "CipherLab" | "GeekGalaxy" | "LifeHacks" | "Math_Magik" | "Otaku_Ops"
  slug: string
  icon?: string
  origin?: string
  howTo?: string
  tips?: string[]
}

export const calculators: Calculator[] = [
  {
    id: "caffeine-half-life",
    title: "Caffeine Half-Life Calculator",
    description: "Track your caffeine metabolism with scientific accuracy.",
    category: "BigKidMath",
    slug: "caffeine-half-life",
    icon: "☕",
    origin: "Caffeine has a biological half-life of about 5-6 hours for the average adult. This tool uses standard pharmacokinetic models to estimate how much 'buzz' remains in your system.",
    howTo: "Enter the time and amount of your last coffee. We'll chart the decay curve and tell you when it's safe to sleep without that 'caffeine-crash' insomnia.",
    tips: ["Genetics can make you a 'fast' or 'slow' metabolizer.", "Smoking can double the speed of caffeine metabolism.", "Grapefruit juice can actually slow it down!"]
  },
  {
    id: "car-vs-uber",
    title: "Car Ownership vs. Uber Cost",
    description: "Compare the true cost of owning a car vs using rideshare.",
    category: "BigKidMath",
    slug: "car-vs-uber",
    icon: "🚗",
    origin: "Most car owners forget about the 'invisible' costs: depreciation, insurance, and maintenance. This tool brings those hidden expenses into the light for a fair fight against ridesharing.",
    howTo: "Input your estimated monthly car payments, fuel, and insurance. Compare that against your weekly Uber spending to see if you should sell the keys and join the 'passenger economy'.",
    tips: ["A new car loses 20% of its value the moment you drive it off the lot.", "Don't forget to include parking and cleaning costs.", "Ridesharing eliminates the stress of driving in traffic!"]
  },
  {
    id: "generational-timeline",
    title: "Generational Timeline",
    description: "Explore events and trends across different generations.",
    category: "BigKidMath",
    slug: "generational-timeline",
    icon: "👥",
    origin: "Based on the Strauss-Howe Generational Theory. It looks at the recurring cycles of social, political, and economic tides that shape each generation's collective personality.",
    howTo: "Select a generation to see their formative years, major global events, and the cultural trends that defined them. See where you fit in the grand cycle of history.",
    tips: ["Boomers, Gen X, Millennials, and Gen Z—we all have shared 'turning points'.", "Check out the 'G.I. Generation' for a look at the heroes of WWII.", "Generation Alpha is already starting to make their mark."]
  },
  {
    id: "lightning-life",
    title: "Lightning-Powered Life",
    description: "How many lightning strikes would it take to power your life?",
    category: "BigKidMath",
    slug: "lightning-life",
    icon: "⚡",
    origin: "A single bolt of lightning contains about 1 billion joules of energy. Theoretically, that's enough to power a house for a month—if only we could catch it.",
    howTo: "Input your daily electricity usage. We'll calculate the number of 'Thunderstruck' moments required to keep your lights on and your phone charged for a year.",
    tips: ["Storing lightning is currently impossible due to the extreme voltage surge.", "The Empire State Building is struck about 25 times a year.", "1.21 Gigawatts is exactly what Doc Brown needed for his DeLorean."]
  },
  {
    id: "power-footprint",
    title: "The Footprint of Power",
    description: "Compare land use requirements for Solar vs. Wind vs. Nuclear.",
    category: "BigKidMath",
    slug: "power-footprint",
    icon: "🦶",
    origin: "Energy density is the silent hero of civilization. This tool compares how much physical space different energy sources require to generate the same amount of power.",
    howTo: "Select an energy source and a target output. We'll visualize the 'footprint' in terms of football fields or city blocks, highlighting the trade-offs of the green transition.",
    tips: ["Nuclear energy has the smallest land footprint per megawatt.", "Solar farms require vast open spaces but are getting more efficient every year.", "Wind farms can 'double up' on land by allowing farming beneath the turbines."]
  },
  {
    id: "cost-of-war",
    title: "The Cost of War",
    description: "Contrast military munitions with societal opportunity costs.",
    category: "BigKidMath",
    slug: "cost-of-war",
    icon: "⚔️",
    origin: "Inspired by the 'Opportunity Cost' economic principle. Every dollar spent on munitions is a dollar not spent on hospitals, schools, or social infrastructure.",
    howTo: "Select a piece of military hardware to see its procurement cost. We'll automatically convert that price tag into societal equivalents like teacher salaries, surgeons, or school buildings.",
    tips: ["A single Stinger missile costs as much as a surgeon's annual salary.", "F-35 jets are the most expensive weapons program in history.", "The Global military spend is now over $2.4 Trillion annually."]
  },
  {
    id: "caesar-cipher",
    title: "Caesar Cipher",
    description: "Encrypt messages with the ancient Roman shift cipher.",
    category: "CipherLab",
    slug: "caesar-cipher",
    icon: "🏛️",
    origin: "Named after Julius Caesar, who used it to protect military secrets. It's one of the earliest and simplest forms of encryption, involving a simple 'shift' of the alphabet.",
    howTo: "Enter your message and select a shift value (the 'key'). Your text will instantly transform into a scrambled code that only someone with the key can decipher.",
    tips: ["A shift of 3 was Caesar's personal favorite.", "Try shifting by 13 (ROT13) for a classic internet-era cipher.", "Use negative shifts to go backwards!"]
  },
  {
    id: "nato-phonetic",
    title: "NATO Phonetic Alphabet",
    description: "Convert text to Alpha, Bravo, Charlie used by pilots.",
    category: "CipherLab",
    slug: "nato-phonetic",
    icon: "✈️",
    origin: "Developed in the 1950s by NATO and ICAO to ensure clear communication over crackly radio lines. Each word was carefully chosen to be unmistakable in any accent.",
    howTo: "Type any word or phrase to see its phonetic equivalent. Hit the 'Transmit' button to hear it spoken with pilot-grade clarity.",
    tips: ["Great for spelling your name over the phone.", "Notice how '9' is pronounced 'Niner' to avoid confusion with the German 'Nein'.", "Used by everyone from astronauts to emergency services."]
  },
  {
    id: "pigpen-cipher",
    title: "Pigpen Cipher",
    description: "Visual geometric cipher used by Freemasons.",
    category: "CipherLab",
    slug: "pigpen-cipher",
    icon: "🐷",
    origin: "A geometric substitution cipher that swaps letters for fragments of a grid. Historically used by the Freemasons in the 18th century to keep their records private.",
    howTo: "Type your message to see it drawn in geometric symbols. Each shape represents a specific letter's position in a tic-tac-toe or X-grid.",
    tips: ["The dots indicate the second letter in the same grid segment.", "Classic for 'treasure hunt' notes.", "Looks like an alien language to the untrained eye!"]
  },
  {
    id: "morse-code",
    title: "Morse Code Broadcast",
    description: "Translate text to audible Morse Code dits and dahs.",
    category: "CipherLab",
    slug: "morse-code",
    icon: "📡",
    origin: "Invented by Samuel Morse and Alfred Vail in the 1830s. It revolutionized long-distance communication by sending electrical pulses through telegraph wires.",
    howTo: "Type your message to see the dots (dits) and dashes (dahs). Use the broadcast button to hear the rhythmic pulses of the 19th-century internet.",
    tips: ["SOS is three dots, three dashes, three dots (... --- ...).", "Short pulses are dits, long ones are dahs.", "Experienced operators can 'read' Morse by sound faster than most people type."]
  },
  {
    id: "password-anger",
    title: "Password Anger Scale",
    description: "How angry would a hacker get trying to crack your password?",
    category: "CipherLab",
    slug: "password-anger",
    icon: "😡",
    origin: "In the world of cybersecurity, time is money. This scale estimates the computational effort (and frustration) required to brute-force your digital fortress.",
    howTo: "Enter a password to see the 'Anger Meter'. The longer and more complex your password, the higher the blood pressure of our simulated hacker.",
    tips: ["Length trumps complexity—12 simple characters are often better than 8 complex ones.", "Avoid '123456' or 'Password' unless you want a very happy hacker.", "Use a unique password for every site."]
  },
  {
    id: "ogham-translator",
    title: "Ogham Translator",
    description: "Convert text to Ancient Irish tree alphabet.",
    category: "CipherLab",
    slug: "ogham-translator",
    icon: "🗿",
    origin: "Known as the 'alphabet of the trees,' Ogham was used in Early Medieval Ireland. It consists of notches carved along a vertical line, often on stone monuments.",
    howTo: "Type modern text and see it converted into ancient Irish runic notches. The strokes are read from bottom to top on stones or left to right on paper.",
    tips: ["Each letter is named after a tree (e.g., 'B' for 'Beith' or Birch).", "Ancient Ogham inscriptions are still visible across the Irish landscape today.", "Perfect for creating mystical-looking designs."]
  },
  {
    id: "shavian-translator",
    title: "Shavian Alphabet",
    description: "George Bernard Shaw's phonetic alphabet for English.",
    category: "CipherLab",
    slug: "shavian-translator",
    icon: "🇬🇧",
    origin: "Named after playwright George Bernard Shaw, who funded a competition to create a more efficient, phonetic alphabet for the English language to save time and paper.",
    howTo: "Type normal English text to see it rendered in Shaw's sleek, phonetic glyphs. Each character represents a specific sound, eliminating the need for silent letters.",
    tips: ["There are no capital letters in Shavian.", "It was used to publish a special edition of Shaw's play 'Androcles and the Lion'.", "See if you can spot the 'tall' and 'deep' characters representing different sounds."]
  },
  {
    id: "zombie-survival",
    title: "Zombie Apocalypse Survival",
    description: "Calculate your odds of surviving a zombie outbreak.",
    category: "GeekGalaxy",
    slug: "zombie-survival",
    icon: "🧟",
    origin: "Based on the 'Solanum' outbreak model. We've analyzed thousands of hours of cinema and survival literature to determine exactly what determines if you're the hero or the 'first to go'.",
    howTo: "Be honest about your fitness levels, survival gear, and tactical knowledge. Our algorithm will calculate your probability of surviving the first 24 hours of a global outbreak.",
    tips: ["Cardio is rule #1.", "Don't be a hero in the first 10 minutes.", "Stock up on canned goods, not just ammo."]
  },
  {
    id: "space-travel",
    title: "Space Travel Time",
    description: "Calculate travel time to planets and stars.",
    category: "GeekGalaxy",
    slug: "space-travel",
    icon: "🚀",
    origin: "The universe is vast, and our current tech is slow. This tool uses real-world orbital mechanics and relativistic math to show you just how long it takes to reach our cosmic neighbors.",
    howTo: "Select your destination and your propulsion method (from chemical rockets to theoretical warp drives). We'll calculate the travel time for sowohl relative to Earth and the crew.",
    tips: ["Time dilation becomes significant as you approach light speed.", "The nearest star, Proxima Centauri, is 4.2 light-years away.", "Pack a very long book for chemical rocket trips."]
  },
  {
    id: "spaceship-fuel",
    title: "Spaceship Fuel Planner",
    description: "Plan your interstellar fuel loadout.",
    category: "GeekGalaxy",
    slug: "spaceship-fuel",
    icon: "⛽",
    origin: "Tsiolkovsky's Rocket Equation is a cruel mistress. The more fuel you carry, the more fuel you need just to move that fuel. This planner helps you find the 'sweet spot' for your mission.",
    howTo: "Input your ship's dry mass and your target Delta-V (change in velocity). We'll tell you exactly how much fuel you need to reach your destination without becoming a permanent satellite.",
    tips: ["Staging your rocket is the most efficient way to gain velocity.", "Vacuum engines have much higher efficiency than sea-level ones.", "Always leave 5% extra for maneuvers."]
  },
  {
    id: "lightsaber-battery",
    title: "Lightsaber Battery Life",
    description: "Don't run out of charge mid-duel.",
    category: "GeekGalaxy",
    slug: "lightsaber-battery",
    icon: "⚔️",
    origin: "A Jedi's weapon is their life, but even Diatium power cells have limits. Plasma containment and blade length draw significant power, especially during heavy combat or 'door-melting' scenarios.",
    howTo: "Adjust your blade color (certain crystals draw more power!) and estimated combat intensity. We'll show you how many minutes of active use you have left before you're holding a fancy flashlight.",
    tips: ["Blue and green are the most efficient colors.", "Holding a blade in 'deflection mode' drains battery 3x faster.", "Keep a spare power cell in your utility belt."]
  },
  {
    id: "ai-doomsday",
    title: "AI Doomsday Countdown",
    description: "Probability of the singularity.",
    category: "GeekGalaxy",
    slug: "ai-doomsday",
    icon: "🤖",
    origin: "Based on the Bostrom-Yudkowsky 'Fast Takeoff' model. We track the convergence of computing power, algorithm efficiency, and recursive self-improvement variables.",
    howTo: "Input the current year and the perceived rate of AI advancement. Our 'Control Problem' coefficient will determine the likelihood of human obsolescence.",
    tips: ["Always be polite to your LLM.", "Paperclips are more dangerous than you think.", "The 'Singularity' might have already happened, and we're just in a simulation."]
  },
  {
    id: "alien-communication",
    title: "Alien Communication Probability",
    description: "Drake Equation visualizer.",
    category: "GeekGalaxy",
    slug: "alien-communication",
    icon: "👽",
    origin: "A visual deep-dive into the Drake Equation, formulated by Frank Drake in 1961 to estimate the number of active, communicative extraterrestrial civilizations in the Milky Way.",
    howTo: "Adjust the sliders for star formation, habitable planets, and the 'Great Filter' variables. Watch as the number of potential neighbors in our galaxy shifts from zero to millions.",
    tips: ["The 'L' factor (civilization longevity) is the biggest unknown.", "We've only been 'listening' for about 60 years.", "The Fermi Paradox asks: 'Where is everybody?'"]
  },
  {
    id: "potion-brewer",
    title: "Potion Brewer",
    description: "Mix ingredients for RPG effects.",
    category: "GeekGalaxy",
    slug: "potion-brewer",
    icon: "🧪",
    origin: "For the master alchemist and the novice herbalist alike. This tool uses standard RPG crafting logic to determine the potency, duration, and side effects of your custom brews.",
    howTo: "Select your base and add up to three magical ingredients. We'll calculate the resulting buff (or debuff) and provide a fancy name for your new creation.",
    tips: ["Never mix Fire Salts with Frost Mirabel.", "Adding a 'Mundane' ingredient can stabilize volatile mixtures.", "Check the Toxicity level before drinking!"]
  },
  {
    id: "force-sensitivity",
    title: "Force Sensitivity Test",
    description: "Estimate your midi-chlorian count.",
    category: "GeekGalaxy",
    slug: "force-sensitivity",
    icon: "🧘",
    origin: "While true sensitivity requires a blood test at the Jedi Temple, this questionnaire uses behavioral and intuitive markers to estimate your connection to the energy field that binds the galaxy.",
    howTo: "Answer a series of questions about your reflexes, intuition, and 'luck'. We'll correlate your responses with historical Jedi and Sith profiles to find your rank.",
    tips: ["Close your eyes and let your instincts guide your answers.", "Being 'force sensitive' doesn't mean you can lift an X-wing... yet.", "Beware of the Dark Side."]
  },
  {
    id: "warp-speed",
    title: "Warp Speed Converter",
    description: "Star Trek Warp Factors to Light Speed.",
    category: "GeekGalaxy",
    slug: "warp-speed",
    icon: "🖖",
    origin: "Converts Star Trek Warp Factors (both TOS and TNG scales) into multiples of the speed of light (c). It's the essential tool for every navigator on the bridge.",
    howTo: "Select your era (Standard or Classic) and input your Warp Factor. We'll show you exactly how many light-years you'll cover in a day, week, or month.",
    tips: ["In the TNG scale, Warp 10 is infinite speed (and might turn you into a lizard).", "Warp 9.9 is significantly faster than Warp 9.", "Scotty says he can give you more power, but he's usually lying about the time it takes."]
  },
  {
    id: "time-paradox",
    title: "Time Paradox Detector",
    description: "Safe travel through the timeline.",
    category: "GeekGalaxy",
    slug: "time-paradox",
    icon: "⌛",
    origin: "Traveling back in time is easy; not erasing yourself from existence is the hard part. This tool cross-references common paradox theories like the 'Grandfather Paradox' and 'Bootstrap Paradox'.",
    howTo: "Input your target date and the changes you intend to make. Our entropy-meter will tell you if the timeline will 'self-correct' or if you're about to cause a localized reality collapse.",
    tips: ["Avoid meeting your past self.", "Don't step on any butterflies in the Cretaceous period.", "If you see a blue police box, ask for advice."]
  },
  {
    id: "beskar-armor",
    title: "Beskar Armor Calculator",
    description: "Cost to forge Mandalorian armor.",
    category: "GeekGalaxy",
    slug: "beskar-armor",
    icon: "🛡️",
    origin: "Beskar is the rarest metal in the galaxy, capable of withstanding lightsaber strikes and direct blaster fire. This calculator helps a foundling estimate the weight of 'Imperial Steel' needed for a full set.",
    howTo: "Choose your armor pieces (Full Plate, Pauldrons, Cuirass, etc.) and your body type. We'll tell you how many ingots of Beskar you need to collect to complete the forge.",
    tips: ["Extra Beskar should be donated to the foundlings.", "Don't forget the Whistling Birds attachment.", "This is the way."]
  },

  // Otaku Ops
  {
    id: "anime-training",
    title: "Anime Training Montage Planner",
    description: "Plan your ultimate training arc.",
    category: "Otaku_Ops",
    slug: "anime-training",
    icon: "💪",
    origin: "Inspired by the legendary training arcs of Shonen history. Whether you're preparing for a tournament or a final showdown, every hero needs a structured plan to break their limits.",
    howTo: "Input your current power level and your goal. We'll generate a high-intensity training schedule complete with push-ups, running, and the mandatory 'secret technique' meditation sessions.",
    tips: ["Don't forget to shout your attacks for 20% more damage.", "100 push-ups, 100 sit-ups, and 10km running is a classic for a reason.", "Make sure to have a sad backstory for maximum motivation."]
  },
  {
    id: "minecraft-portal",
    title: "Minecraft Portal Planner",
    description: "Link Nether portals correctly.",
    category: "Otaku_Ops",
    slug: "minecraft-portal",
    icon: "🔥",
    origin: "Space is warped between the Overworld and the Nether. A single block in the Nether equals eight in the Overworld, making portal placement a precision engineering task.",
    howTo: "Input your Overworld coordinates, and we'll tell you exactly where to build your Nether portal to ensure they link perfectly without sending you into a lava lake.",
    tips: ["Divide Overworld X and Z by 8 to get Nether coordinates.", "Height (Y) doesn't matter for linking, but it's good for safety.", "Always carry Flint and Steel on both sides!"]
  },
  {
    id: "conspiracy-theory",
    title: "Conspiracy Plausibility",
    description: "Is the truth really out there?",
    category: "Otaku_Ops",
    slug: "conspiracy-theory",
    icon: "👁️",
    origin: "Based on the 'Conspiracy Equation' by Dr. David Robert Grimes. It calculates how long a secret can actually be kept based on the number of people involved.",
    howTo: "Input the scale of the conspiracy and the number of people who would need to keep quiet. We'll tell you the statistical likelihood of the 'truth' leaking within a year.",
    tips: ["Three can keep a secret, if two are dead.", "Moon landing conspiracies involve too many people to stay secret.", "The 'Birds Aren't Real' theory is 100% plausible (just kidding... or am I?)."]
  },
  {
    id: "pizza-pi",
    title: "Pizza Pi Calculator",
    description: "Optimize your pizza orders.",
    category: "Math_Magik",
    slug: "pizza-pi",
    icon: "🍕",
    origin: "Geometry meets Gastronomy. Most people don't realize that an 18-inch pizza has more than double the area of a 12-inch pizza. This tool ensures you get the most 'pi' for your buck.",
    howTo: "Enter the sizes and prices of the pizzas you're considering. We'll calculate the price per square inch, so you can make the mathematically superior choice.",
    tips: ["Always go for the larger size if the price isn't double.", "The crust-to-topping ratio is a hidden variable.", "Mathematics is the secret topping of every good deal."]
  },
  {
    id: "fire-number",
    title: "FIRE Number Calculator",
    description: "Financial Independence, Retire Early.",
    category: "Math_Magik",
    slug: "fire-number",
    icon: "🔥",
    origin: "The FIRE movement isn't about being rich; it's about freedom. This tool uses the '4% Rule' from the Trinity Study to calculate exactly how much you need to never work again.",
    howTo: "Input your annual expenses and your current savings. We'll show you your 'FIRE Number' and estimate how many years of freedom you've already 'bought'.",
    tips: ["Lowering your expenses is more effective than raising your income.", "Index funds are the engine of FIRE.", "Your 'LeanFIRE' number is your absolute survival minimum."]
  },
  {
    id: "double-pendulum",
    title: "Double Pendulum Chaos",
    description: "Simulate chaotic physics.",
    category: "Math_Magik",
    slug: "double-pendulum",
    icon: "〰️",
    origin: "A classic example of a simple system with complex, non-linear behavior. Even a tiny change in the starting angle leads to a completely different path—this is the heart of Chaos Theory.",
    howTo: "Drag the pendulums to set their starting positions and hit 'Release'. Watch the hypnotic, unpredictable patterns emerge as the system fights against gravity.",
    tips: ["Try starting with both arms horizontal for maximum chaos.", "Notice how the path never repeats itself.", "The 'Butterfly Effect' is naming this very phenomenon."]
  },
  {
    id: "chaos-explorer",
    title: "Chaos Theory Explorer",
    description: "Visualize the Butterfly Effect.",
    category: "Math_Magik",
    slug: "chaos-explorer",
    icon: "🦋",
    origin: "The Lorenz Attractor and Mandelbrot Sets show that order can exist within chaos. This explorer lets you visualize the beautiful, fractaling complexity of the universe.",
    howTo: "Select a chaotic model and adjust the parameters. Watch as simple equations create infinite, self-similar patterns that mimic everything from clouds to heartbeats.",
    tips: ["Zoom in to see the infinite detail of a fractal.", "Small changes in 'r' values can lead to 'bifurcation'—the sudden split into multiple states.", "Nature is built on fractal geometry."]
  },
  {
    id: "inflation-impact",
    title: "Inflation Impact",
    description: "Historical purchasing power.",
    category: "Math_Magik",
    slug: "inflation-impact",
    icon: "💸",
    origin: "Money is a time machine that slowly loses its charge. This tool uses historical CPI data to show you why your grandparents' $1 was worth a whole lot more than yours.",
    howTo: "Enter an amount and a year. We'll show you the equivalent purchasing power in today's dollars, highlighting the 'invisible tax' of inflation.",
    tips: ["A candy bar in 1950 wasn't just cheaper; it was a different economy.", "Inflation averages about 2-3% per year.", "Assets that beat inflation are key to long-term wealth."]
  },
  {
    id: "life-visualized",
    title: "Your Life Visualized",
    description: "Memento Mori weeks grid.",
    category: "Math_Magik",
    slug: "life-visualized",
    icon: "📅",
    origin: "Stoic philosophers used 'Memento Mori' (Remember you must die) not to be morbid, but to inspire action. This grid visualizes your entire life in weeks on a single screen.",
    howTo: "Enter your birthdate. Each square represents one week of an 80-year life. See how much time you've spent and how much 'white space' you have left to fill.",
    tips: ["Don't let the grid scare you; let it motivate you.", "Highlight significant milestones to see your personal history.", "Every single square is a gift. Use this one well."]
  },

  // Life Hacks
  {
    id: "sleep-cycle",
    title: "Sleep Cycle Optimizer",
    description: "Plan your sleep around 90-minute REM cycles.",
    category: "LifeHacks",
    slug: "sleep-cycle",
    icon: "🌙",
    origin: "The human brain sleeps in cycles of approximately 90 minutes. Waking up at the end of a cycle makes you feel refreshed, while waking mid-cycle leads to that 'morning zombie' grogginess.",
    howTo: "Input the time you need to wake up (or the time you're heading to bed). We'll calculate the perfect windows for you to drift off and wake up perfectly in sync with your biology.",
    tips: ["The average human takes 14 minutes to fall asleep.", "Try to get 5 or 6 full cycles for a perfect night's rest.", "Even a 20-minute power nap can reset your focus."]
  },
  {
    id: "procrastination-roi",
    title: "Procrastination ROI",
    description: "Visualize when the Panic Monster will strike.",
    category: "LifeHacks",
    slug: "procrastination-roi",
    icon: "💣",
    origin: "Based on Tim Urban's 'Wait But Why' procrastination theory. We track the delicate balance between the Rational Decision Maker and the Instant Gratification Monkey.",
    howTo: "Input your deadline and your current 'distraction level'. We'll map the growth of the 'Panic Monster' and predict exactly when you'll actually start working.",
    tips: ["Break big tasks into tiny, non-scary steps.", "The '5-Minute Rule': just do it for 5 minutes, and then you can stop.", "Your future self will thank you for starting now."]
  },
  {
    id: "social-media-addiction",
    title: "Social Media Addiction",
    description: "How many years of your life are spent scrolling?",
    category: "LifeHacks",
    slug: "social-media-addiction",
    icon: "📱",
    origin: "Social media apps are designed for 'infinite scroll' to keep you engaged. This tool calculates the cumulative impact of those 'just 5 more minutes' sessions over a lifetime.",
    howTo: "Estimate your daily usage across all platforms. We'll extrapolate that into years, months, and days, showing you what else you could have accomplished with that time.",
    tips: ["Turn off non-essential notifications.", "Set a grayscale filter on your phone to make it less appealing.", "Try a 'Digital Detox' Sunday."]
  },
  {
    id: "coffee-code",
    title: "Coffee to Code Efficiency",
    description: "Calculate caffeine-fueled productivity.",
    category: "LifeHacks",
    slug: "coffee-code",
    icon: "☕",
    origin: "Computer science legend says that a programmer is a machine for turning coffee into code. This tool calculates the 'Goldilocks Zone' of caffeination for maximum output.",
    howTo: "Log your caffeine intake and track your lines of code (or finished tasks). We'll find the peak efficiency point where your focus is laser-sharp before the jitters take over.",
    tips: ["Hydrate with water between cups of coffee.", "Coffee-fueled productivity peaks about 45 minutes after ingestion.", "Avoid caffeine 6 hours before your intended sleep time."]
  },
  {
    id: "stress-ice-cream",
    title: "Stress-to-Ice-Cream Ratio",
    description: "Emotional support dairy calculator.",
    category: "LifeHacks",
    slug: "stress-ice-cream",
    icon: "🍦",
    origin: "Sometimes, the only solution to a bad day is a pint of mint chocolate chip. This scientific (ish) scale matches your current stress level to the appropriate serving size.",
    howTo: "Rate your day on a scale of 'Minor Inconvenience' to 'Total Existential Crisis'. We'll recommend the exact amount of emotional support dairy required to cope.",
    tips: ["A waffle cone adds +10 to your happiness stat.", "Sprinkles are scientifically proven to be cheer-inducing.", "Share a pint to halve the stress and double the joy."]
  },
  {
    id: "time-is-money",
    title: "Time is Money",
    description: "Convert purchase costs into hours of your life.",
    category: "LifeHacks",
    slug: "time-is-money",
    icon: "⏳",
    origin: "Everything you buy costs more than just dollars; it costs the time you spent earning those dollars. This tool helps you decide if that new gadget is worth 3 days of your life.",
    howTo: "Input your hourly wage and the price of an item. We'll show you the 'Time Cost' of the purchase, giving you a fresh perspective on spending.",
    tips: ["Always think in 'Hours of Life', not just currency.", "Luxury items often have the highest time-to-joy cost.", "Saving money is effectively 'buying' your future time."]
  },
  {
    id: "pepper-scale",
    title: "How Hot Is That Pepper?",
    description: "Scoville scale visualizer & survival guide.",
    category: "LifeHacks",
    slug: "pepper-scale",
    icon: "🌶️",
    origin: "The Scoville Scale measures the concentration of capsaicin. From the mild bell pepper to the soul-crushing Carolina Reaper, we map the journey from 'Tingly' to 'Regretty'.",
    howTo: "Select a pepper or input a Scoville Heat Unit (SHU) value. We'll show you the heat intensity and provide a survival guide for your taste buds.",
    tips: ["Milk and bread help neutralise capsaicin better than water.", "Don't touch your eyes after handling hot peppers!", "Heat tolerance is a skill you can train over time."]
  },
  {
    id: "should-i-engage",
    title: "Should I Engage?",
    description: "Strategic decision tree for conversations.",
    category: "LifeHacks",
    slug: "should-i-engage",
    icon: "🤔",
    origin: "Based on social intelligence frameworks. Not every argument needs an answer, and not every comment needs a rebuttal. This tool helps you preserve your mental energy.",
    howTo: "Answer a few questions about the person, the topic, and your current mood. We'll give you a 'Go/No-Go' recommendation for the engagement.",
    tips: ["If it won't matter in 5 years, don't spend more than 5 minutes on it.", "Pick your battles wisely.", "Sometimes, 'Okay' is the most powerful response."]
  }
]
