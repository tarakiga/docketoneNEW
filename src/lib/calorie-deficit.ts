// src/lib/calorie-deficit.ts
// Pure, framework-free calorie math. No React imports.

export type Sex = "male" | "female"
export type UnitSystem = "metric" | "imperial"

export const LIFESTYLE_MULTIPLIERS = {
  sedentary: { label: "Sedentary (desk job)", value: 1.2 },
  light: { label: "Lightly active", value: 1.375 },
  moderate: { label: "Moderately active", value: 1.55 },
  very: { label: "Very active", value: 1.725 },
} as const

export type LifestyleKey = keyof typeof LIFESTYLE_MULTIPLIERS

// --- Unit conversion (imperial -> metric) ---
export function lbToKg(lb: number): number {
  return lb * 0.45359237
}

export function ftInToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54
}

// --- Energy expenditure ---
// Mifflin-St Jeor BMR, inputs in metric (kg, cm).
export function bmrMifflinStJeor(sex: Sex, kg: number, cm: number, age: number): number {
  const base = 10 * kg + 6.25 * cm - 5 * age
  return sex === "male" ? base + 5 : base - 161
}

// ~0.04 kcal per step at 70 kg, scaled linearly by body weight.
export function stepBurn(steps: number, kg: number): number {
  return steps * 0.04 * (kg / 70)
}

// Total daily burn = BMR x lifestyle multiplier + step burn.
export function caloriesOut(bmr: number, multiplier: number, steps: number, kg: number): number {
  return bmr * multiplier + stepBurn(steps, kg)
}

// --- Balance & projection ---
export function netBalance(caloriesIn: number, caloriesOutTotal: number): number {
  return caloriesIn - caloriesOutTotal
}

export type Verdict = "deficit" | "surplus" | "maintenance"

export function verdict(net: number): Verdict {
  if (net < -50) return "deficit"
  if (net > 50) return "surplus"
  return "maintenance"
}

// 3,500 kcal ~= 1 lb of fat; convert a daily net into lb/week.
export function lbPerWeek(net: number): number {
  return (net / 3500) * 7
}
