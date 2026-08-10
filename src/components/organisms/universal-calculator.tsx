"use client"

import { CurrencyConverterUI } from "@/components/molecules/currency-converter-ui"
import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Category, UNIT_LABELS, useUnitConverter } from "@/hooks/use-unit-converter"

const CATEGORIES: Category[] = [
    "length", "weight", "area", "volume", "speed", "data", "energy", "power", "pressure", "angle", "cooking", "time", "temperature", "fuel", "currency", "density",
    "typography", "force", "torque", "flow", "frequency"
]

export function UniversalCalculator() {
  const { setCategory, values, convert, units } = useUnitConverter()

  return (
    <Card className="almanac-panel w-full max-w-4xl mx-auto" style={{ backgroundColor: "var(--dk-sunk)" }}>
      <CardHeader>
        <CardTitle className="text-2xl text-center text-[var(--dk-ink)]">Universal Converter</CardTitle>
        <CardDescription className="text-center text-[var(--dk-ink-soft)]">Convert between common units instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="length" onValueChange={(val) => setCategory(val as Category)} className="w-full">
          <div className="overflow-x-auto pb-4">
              <TabsList className="mb-4 h-auto flex-wrap justify-center bg-transparent gap-2">
                {CATEGORIES.map(cat => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="capitalize rounded-full px-4 py-2 border text-[var(--dk-ink-soft)] border-[var(--dk-line)] hover:bg-[var(--dk-raised)] hover:text-[var(--dk-ink)] data-[state=active]:bg-[var(--dk-tea)] data-[state=active]:text-[var(--dk-on-fill)] data-[state=active]:border-[var(--dk-tea-ink)] transition-colors"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
          </div>

          {CATEGORIES.map(cat => (
            <TabsContent key={cat} value={cat}>
              {cat === "currency" ? (
                  <CurrencyConverterUI units={units} />
              ) : (
                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
                        {units.map((unit) => (
                        <div key={unit} className="space-y-2">
                            <Label htmlFor={unit} className="capitalize text-[var(--dk-ink-soft)] font-medium">
                                {UNIT_LABELS[unit] || unit}
                            </Label>
                            <Input
                            id={unit}
                            type="number"
                            placeholder="0"
                            value={values[unit] || ""}
                            onChange={(e) => convert(e.target.value, unit)}
                            className="bg-[var(--dk-sunk)] border-[var(--dk-line)] text-[var(--dk-ink)] placeholder:text-[#8a83b0] focus-visible:ring-[var(--dk-tea-ink)] focus-visible:border-[var(--dk-tea-ink)]"
                            />
                        </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <ShareResult 
                            title="Unit Conversion" 
                            text="Check out these unit conversions I made on Docket One!" 
                        />
                    </div>
                  </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
