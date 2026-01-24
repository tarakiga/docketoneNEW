import { CaffeineCalculatorPremium } from "@/components/organisms/caffeine-calculator"

import { BillionaireBuyout } from "./bigkidmath/billionaire-buyout"
import { CarVsUberCalculator } from "./bigkidmath/car-vs-uber"
import { CostOfWar } from "./bigkidmath/cost-of-war"
import { GenerationalTimelineCalculator } from "./bigkidmath/generational-timeline"

import { LightningLifeCalculator } from "./bigkidmath/lightning-life"
import { PowerFootprintCalculator } from "./bigkidmath/power-footprint"


import { CaesarCipher } from "./cipherlab/caesar-cipher"
import { MorseCode } from "./cipherlab/morse-code"
import { NATOPhonetic } from "./cipherlab/nato-phonetic"
import { OghamTranslator } from "./cipherlab/ogham-translator"
import { PasswordAnger } from "./cipherlab/password-anger"
import { PigpenCipher } from "./cipherlab/pigpen-cipher"
import { ShavianTranslator } from "./cipherlab/shavian-translator"
import { SteganographyBrush } from "./cipherlab/steganography-brush"

// Geek Galaxy Imports
import { AIDoomsdayCalculator } from "./geekgalaxy/ai-doomsday"
import { AlienCommunicationCalculator } from "./geekgalaxy/alien-communication"
import { BeskarArmorCalculator } from "./geekgalaxy/beskar-armor"
import { ForceSensitivityCalculator } from "./geekgalaxy/force-sensitivity"
import { LightsaberBatteryCalculator } from "./geekgalaxy/lightsaber-battery"
import { PotionBrewerCalculator } from "./geekgalaxy/potion-brewer"
import { SpaceTravelCalculator } from "./geekgalaxy/space-travel"
import { SpaceshipFuelCalculator } from "./geekgalaxy/spaceship-fuel"
import { SuperheroInsuranceQuote } from "./geekgalaxy/superhero-insurance"
import { TimeParadoxDetector } from "./geekgalaxy/time-paradox"
import { WarpSpeedCalculator } from "./geekgalaxy/warp-speed"
import { ZombieSurvivalCalculator } from "./geekgalaxy/zombie-survival"

// Otaku Ops Imports
import { AnimeTrainingCalculator } from "./otakuops/anime-training"
import { ConspiracyTheoryCalculator } from "./otakuops/conspiracy-theory"
import { GachaDespair } from "./otakuops/gacha-despair"
import { MinecraftPortalPlanner } from "./otakuops/minecraft-portal"

// Math Magik Imports
import { ButterflyEffect } from "./mathmagik/butterfly-effect"
import { ChaosExplorer } from "./mathmagik/chaos-explorer"
import { DoublePendulum } from "./mathmagik/double-pendulum"
import { FireCalculator } from "./mathmagik/fire-number"
import { InflationImpact } from "./mathmagik/inflation-impact"
import { LifeVisualized } from "./mathmagik/life-visualized"
import { PizzaPiCalculator } from "./mathmagik/pizza-pi"

// Life Hacks Imports
import { CoffeeToCode } from "./lifehacks/coffee-code"
import { PepperScale } from "./lifehacks/pepper-scale"
import { ProcrastinationCalculator } from "./lifehacks/procrastination-roi"
import { ShouldIEngage } from "./lifehacks/should-i-engage"
import { SleepCycleCalculator } from "./lifehacks/sleep-cycle"
import { SocialMediaAddiction } from "./lifehacks/social-media-addiction"
import { StressToIceCream } from "./lifehacks/stress-ice-cream"
import { TimeIsMoney } from "./lifehacks/time-is-money"
import { UnspentPotentialTax } from "./lifehacks/unspent-potential"

export const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  // BigKidMath
  "caffeine-half-life": CaffeineCalculatorPremium,
  "car-vs-uber": CarVsUberCalculator,
  "cost-of-war": CostOfWar,
  "billionaire-buyout": BillionaireBuyout,
  "generational-timeline": GenerationalTimelineCalculator,
  "lightning-life": LightningLifeCalculator,
  "power-footprint": PowerFootprintCalculator,

  // Cipher Lab
  "caesar-cipher": CaesarCipher,
  "nato-phonetic": NATOPhonetic,
  "morse-code": MorseCode,
  "pigpen-cipher": PigpenCipher,
  "password-anger": PasswordAnger,
  "ogham-translator": OghamTranslator,
  "shavian-translator": ShavianTranslator,
  "steganography-brush": SteganographyBrush,

  // GeekGalaxy
  "superhero-insurance": SuperheroInsuranceQuote,
  "zombie-survival": ZombieSurvivalCalculator,
  "space-travel": SpaceTravelCalculator,
  "spaceship-fuel": SpaceshipFuelCalculator,
  "lightsaber-battery": LightsaberBatteryCalculator,
  "force-sensitivity": ForceSensitivityCalculator,
  "warp-speed": WarpSpeedCalculator,
  "ai-doomsday": AIDoomsdayCalculator,
  "alien-communication": AlienCommunicationCalculator,
  "beskar-armor": BeskarArmorCalculator,
  "potion-brewer": PotionBrewerCalculator,
  "time-paradox": TimeParadoxDetector,

  // Otaku_Ops
  "anime-training": AnimeTrainingCalculator,
  "minecraft-portal": MinecraftPortalPlanner,
  "gacha-despair": GachaDespair,
  "conspiracy-theory": ConspiracyTheoryCalculator,

  // Math_Magik
  "fire-number": FireCalculator,
  "pizza-pi": PizzaPiCalculator,
  "double-pendulum": DoublePendulum,
  "chaos-explorer": ChaosExplorer,
  "inflation-impact": InflationImpact,
  "life-visualized": LifeVisualized,
  "butterfly-effect": ButterflyEffect,

  // Life Hacks
  "unspent-potential": UnspentPotentialTax,
  "sleep-cycle": SleepCycleCalculator,
  "procrastination-roi": ProcrastinationCalculator,
  "social-media-addiction": SocialMediaAddiction,
  "coffee-code": CoffeeToCode,
  "pepper-scale": PepperScale,
  "should-i-engage": ShouldIEngage,
  "stress-ice-cream": StressToIceCream,
  "time-is-money": TimeIsMoney,
}
