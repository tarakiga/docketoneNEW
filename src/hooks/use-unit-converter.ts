"use client"

import { useCallback, useEffect, useState } from "react"

// Types
export type Category = keyof typeof CONVERSION_RATES | "temperature" | "fuel" | "currency"
type Rates = Record<string, number>

// Conversion Factors (Base unit varies per category)
const CONVERSION_RATES = {
  length: {
    mm: 1,
    cm: 10,
    meters: 1000,
    km: 1000000,
    inches: 25.4,
    feet: 304.8,
    yards: 914.4,
    miles: 1609344,
  },
  weight: {
    mg: 1,
    g: 1000,
    kg: 1000000,
    tonnes: 1000000000,
    ounces: 28349.523125,
    pounds: 453592.37,
    stone: 6350293.18,
  },
  area: {
    sqmm: 1,
    sqcm: 100,
    sqm: 1000000,
    sqkm: 1000000000000,
    acres: 4046856422.4,
    hectares: 10000000000,
    sqin: 645.16,
    sqft: 92903.04,
    sqyd: 836127.36,
  },
  volume: {
    ml: 1,
    l: 1000,
    cubicm: 1000000,
    cubicin: 16.387064,
    cubicft: 28316.846592,
    usgal: 3785.411784,
    impgal: 4546.09,
    quarts: 946.352946,
    pints: 473.176473,
    cups: 236.588236,
  },
  speed: {
    mps: 1,
    kph: 0.277778,
    mph: 0.44704,
    knots: 0.514444,
    fps: 0.3048,
  },
  data: {
    bits: 1,
    bytes: 8,
    kb: 8192,
    mb: 8388608,
    gb: 8589934592,
    tb: 8796093022208,
  },
  energy: {
    joules: 1,
    kilojoules: 1000,
    calories: 4.184,
    kilocalories: 4184,
    btu: 1055.06,
    kwh: 3600000,
  },
  power: {
    watts: 1,
    kilowatts: 1000,
    horsepower: 745.7,
  },
  pressure: {
    pascals: 1,
    kilopascals: 1000,
    bar: 100000,
    psi: 6894.76,
    atmosphere: 101325,
  },
  angle: {
    degrees: 1,
    radians: 57.2958,
    gradians: 0.9,
  },
  cooking: {
    cups: 236.588,
    tablespoons: 14.7868,
    teaspoons: 4.92892,
    ounces: 29.5735,
    grams: 1,
    milliliters: 1,
  },
  time: {
     seconds: 1,
     minutes: 60,
     hours: 3600,
     days: 86400,
     weeks: 604800,
     months: 2629746,
     years: 31556952
  },
  density: {
     kgm3: 1,
     gcm3: 1000,
     lbft3: 16.0185
  }
} as const

// Special converters
const TEMP_CONVERTERS = {
  celsius: {
    fahrenheit: (c: number) => (c * 9) / 5 + 32,
    kelvin: (c: number) => c + 273.15,
    rankine: (c: number) => ((c + 273.15) * 9) / 5,
  },
  fahrenheit: {
    celsius: (f: number) => ((f - 32) * 5) / 9,
    kelvin: (f: number) => ((f - 32) * 5) / 9 + 273.15,
    rankine: (f: number) => f + 459.67,
  },
  kelvin: {
    celsius: (k: number) => k - 273.15,
    fahrenheit: (k: number) => ((k - 273.15) * 9) / 5 + 32,
    rankine: (k: number) => (k * 9) / 5,
  },
  rankine: {
    celsius: (r: number) => ((r - 491.67) * 5) / 9,
    fahrenheit: (r: number) => r - 459.67,
    kelvin: (r: number) => (r * 5) / 9,
  },
}

const FUEL_CONVERTERS = {
    mpg: {
        l100km: (mpg: number) => 235.215 / mpg,
        kml: (mpg: number) => mpg / 2.352,
    },
    l100km: {
        mpg: (l: number) => 235.215 / l,
        kml: (l: number) => 100 / l,
    },
    kml: {
        mpg: (k: number) => k * 2.352,
        l100km: (k: number) => 100 / k,
    }
}

export function useUnitConverter(initialCategory: Category = "length") {
  const [category, setCategory] = useState<string>(initialCategory)
  const [values, setValues] = useState<Record<string, string>>({})
  const [rates, setRates] = useState<Rates | null>(null) // For currency
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  // Initialize values when category changes
  useEffect(() => {
    setValues({})
  }, [category])

  // Fetch currency rates
  useEffect(() => {
    if (category === "currency" && !rates) {
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(res => res.json())
        .then(data => {
            setRates(data.rates)
            setLastUpdated(new Date(data.time_last_updated ? data.time_last_updated * 1000 : Date.now()))
        })
        .catch(err => {
            console.error("Failed to fetch rates", err)
            // Fallback rates
            setRates({ USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45 })
            setLastUpdated(new Date())
        })
    }
  }, [category, rates])

  const convert = useCallback((value: string, fromUnit: string) => {
    const val = parseFloat(value)
    if (isNaN(val)) {
      setValues({ [fromUnit]: value }) 
      return
    }

    const newValues: Record<string, string> = { [fromUnit]: value }

    
    setValues(prev => ({ ...prev, ...newValues }))
  }, [category, rates])

  return {
    category,
    setCategory,
    values,
    convert,
    rates,
    lastUpdated,
    units: category === "temperature" ? Object.keys(TEMP_CONVERTERS) : 
           category === "fuel" ? Object.keys(FUEL_CONVERTERS) :
           category === "currency" ? (rates ? Object.keys(rates).sort() : []) :
           // @ts-ignore
           CONVERSION_RATES[category] ? Object.keys(CONVERSION_RATES[category]) : []
  }
}

export const UNIT_LABELS: Record<string, string> = {
  mm: "Millimeters", cm: "Centimeters", meters: "Meters", km: "Kilometers",
  inches: "Inches", feet: "Feet", yards: "Yards", miles: "Miles",
  mg: "Milligrams", g: "Grams", kg: "Kilograms", tonnes: "Tonnes",
  celsius: "Celsius (°C)", fahrenheit: "Fahrenheit (°F)", kelvin: "Kelvin (K)", rankine: "Rankine (°R)",
  seconds: "Seconds", minutes: "Minutes", hours: "Hours", days: "Days", weeks: "Weeks", months: "Months", years: "Years",
  mpg: "Miles/Gallon (US)", l100km: "Liters/100km", kml: "Km/Liter",
  kgm3: "kg/m³", gcm3: "g/cm³", lbft3: "lb/ft³",
  USD: "US Dollar (Base)", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen", AUD: "Australian Dollar", CAD: "Canadian Dollar", CHF: "Swiss Franc", CNY: "Chinese Yuan", INR: "Indian Rupee"
}
