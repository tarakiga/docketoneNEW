"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FlaskConical, Scroll, Sparkles } from "lucide-react"
import { useState } from "react"

type ElementKey = 'fire' | 'life' | 'illusion' | 'chaos' | 'order' | 'death'

type Ingredient = {
  id: string
  name: string
  icon: string
  properties: Partial<Record<ElementKey, number>>
  desc: string
}

type PotionResult = {
  name: string
  tier: string
  desc: string
  warn?: string
}

const INGREDIENTS: Ingredient[] = [
  { id: 'moonflower', name: 'Moonflower', icon: '🌙', properties: { illusion: 2, life: 1 }, desc: "Blooms only in moonlight." },
  { id: 'dragonscale', name: 'Dragon Scale', icon: '🐉', properties: { fire: 2, order: 1 }, desc: "Hard as steel, hot to the touch." },
  { id: 'phoenixfeather', name: 'Phoenix Feather', icon: '🔥', properties: { fire: 1, life: 2 }, desc: "Radiates eternal warmth." },
  { id: 'shadowcap', name: 'Shadowcap', icon: '🍄', properties: { death: 2, illusion: 1 }, desc: "Fades when looked at directly." },
  { id: 'sunstone', name: 'Sunstone', icon: '☀️', properties: { life: 1, order: 2 }, desc: "Stored sunlight in crystal form." },
  { id: 'voidcrystal', name: 'Void Crystal', icon: '🔮', properties: { chaos: 2, death: 1 }, desc: "Whispers of the abyss." },
  { id: 'frostfern', name: 'Frostfern', icon: '❄️', properties: { chaos: 1, illusion: 2 }, desc: "Cold enough to burn." },
  { id: 'ironwood', name: 'Ironwood Bark', icon: '🌳', properties: { order: 1, life: 1 }, desc: "Unbreakable natural armor." },
]

const RECIPES: Record<string, PotionResult> = {
  'moonflower_phoenixfeather': { name: 'Elixir of Rejuvenation', tier: 'Epic', desc: 'Heals wounds and restores vitality.', warn: 'Side effect: Glowing skin.' },
  'dragonscale_sunstone': { name: 'Draught of Stone Skin', tier: 'Epic', desc: 'Grants incredible physical resistance.' },
  'moonflower_shadowcap': { name: 'Potion of Invisibility', tier: 'Rare', desc: 'Renders the drinker unseen.' },
  'dragonscale_phoenixfeather': { name: 'Liquid Fire', tier: 'Dangerous', desc: 'Extremely volatile explosive.', warn: 'DO NOT DRINK.' },
  'shadowcap_voidcrystal': { name: 'Draught of Living Death', tier: 'Legendary', desc: 'Induces a death-like slumber.', warn: 'Requires antidote.' },
  'frostfern_voidcrystal': { name: 'Winter\'s Grasp', tier: 'Epic', desc: 'Control over ice and cold.' },
  'ironwood_sunstone_dragonscale': { name: 'Potion of the Colossus', tier: 'Legendary', desc: 'Vastly increases size and strength.', warn: 'Causes exhaustion.' },
}

export function PotionBrewerCalculator() {
  const [selected, setSelected] = useState<string[]>([])
  const [discovered, setDiscovered] = useState<string[]>([])
  const [brewing, setBrewing] = useState(false)
  const [lastResult, setLastResult] = useState<PotionResult | null>(null)

  const toggleIngredient = (id: string) => {
    if (selected.includes(id)) setSelected(s => s.filter(x => x !== id))
    else if (selected.length < 3) setSelected(s => [...s, id])
  }

  const brew = () => {
    setBrewing(true)
    setTimeout(() => {
      const key = selected.slice().sort().join('_')
      let res = RECIPES[key]
      
      if (!res) {
        // Procedural generation fallback
        const props: Record<ElementKey, number> = { fire: 0, life: 0, illusion: 0, chaos: 0, order: 0, death: 0 }
        selected.forEach(id => {
          const ing = INGREDIENTS.find(i => i.id === id)!
          Object.entries(ing.properties).forEach(([k, v]) => {
            const element = k as ElementKey
            props[element] += v ?? 0
          })
        })
        const dom = (Object.keys(props) as ElementKey[]).reduce((a, b) => props[a] > props[b] ? a : b)
        res = {
           name: `Minor ${dom.charAt(0).toUpperCase() + dom.slice(1)} Concoction`, 
           tier: 'Common', 
           desc: 'A murky mixture with weak magical properties.',
           warn: 'Tastes like burnt socks.'
        }
      } else {
        if (!discovered.includes(key)) setDiscovered(p => [...p, key])
      }

      setLastResult(res)
      setBrewing(false)
    }, 1500)
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* Shelf */}
      <Card className="lg:col-span-4 h-fit" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
        <CardHeader>
           <CardTitle className="flex items-center gap-2" style={{ color: '#ff8a3c' }}><FlaskConical/> Ingredients</CardTitle>
           <CardDescription style={{ color: '#b3aae0' }}>Select up to 3</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
           {INGREDIENTS.map(ing => (
             <button
               key={ing.id}
               onClick={() => toggleIngredient(ing.id)}
               disabled={!selected.includes(ing.id) && selected.length >= 3}
               className="p-3 rounded-lg border text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               style={
                 selected.includes(ing.id)
                   ? { backgroundColor: '#241a52', borderColor: '#ff8a3c', boxShadow: '0 0 0 1px #ff8a3c' }
                   : { backgroundColor: '#0c0824', borderColor: '#4a3f7a' }
               }
             >
               <div className="text-2xl mb-1">{ing.icon}</div>
               <div className="font-bold text-sm" style={{ color: '#ECEAE3' }}>{ing.name}</div>
             </button>
           ))}
        </CardContent>
      </Card>

      {/* Cauldron */}
      <Card className="lg:col-span-8 relative overflow-hidden" style={{ backgroundColor: '#1d1442', borderColor: '#4a3f7a' }}>
         <CardHeader>
           <CardTitle className="flex items-center gap-2" style={{ color: '#ff8a3c' }}><Sparkles/> Alchemy Station</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col items-center justify-center space-y-8 min-h-[400px]">
            
            {/* Cauldron Visual */}
            <div className="relative w-48 h-48 flex items-center justify-center">
               <div className="absolute bottom-0 w-32 h-32 rounded-b-full border-4 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#241a52', borderColor: '#4a3f7a' }}>
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-purple-600 transition-all duration-1000 ${brewing ? 'animate-bounce' : ''}`}
                    style={{ height: selected.length * 33 + '%', opacity: 0.8 }}
                  />
                  {brewing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="animate-spin text-4xl">🌀</span>
                    </div>
                  )}
               </div>
               {/* Legs */}
               <div className="absolute bottom-[-10px] w-40 flex justify-between px-2">
                 <div className="w-4 h-8 -rotate-12 rounded" style={{ backgroundColor: '#241a52' }}/>
                 <div className="w-4 h-8 rotate-12 rounded" style={{ backgroundColor: '#241a52' }}/>
               </div>
            </div>

            {/* Action */}
            <div className="w-full max-w-md space-y-4">
               {lastResult && !brewing && (
                 <div className="p-4 rounded-xl border text-center animate-in zoom-in" style={{ backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                    <div className="text-sm uppercase tracking-widest mb-1" style={{ color: '#ff8a3c', fontFamily: 'var(--font-bungee), cursive' }}>{lastResult.tier}</div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#ECEAE3', fontFamily: 'var(--font-bungee), cursive' }}>{lastResult.name}</h3>
                   <p className="italic mb-3" style={{ color: '#b3aae0' }}>&quot;{lastResult.desc}&quot;</p>
                    {lastResult.warn && (
                      <div className="flex items-center justify-center gap-2 text-sm font-bold p-2 rounded" style={{ color: '#ff8a8a', backgroundColor: '#241a52' }}>
                        <AlertTriangle className="h-4 w-4"/> {lastResult.warn}
                      </div>
                    )}
                 </div>
               )}

               <Button
                onClick={brew}
                disabled={selected.length === 0 || brewing}
                className="w-full text-lg h-12"
                style={{ backgroundColor: '#ff8a3c', color: '#160e33' }}
               >
                 {brewing ? "Brewing..." : "Mix Ingredients"}
               </Button>
            </div>

            {lastResult && !brewing && (
              <ShareResult title="Alchemy Discovery" text={`I brewed a ${lastResult.name} (${lastResult.tier}) using the Potion Brewer! 🧪`} />
            )}

         </CardContent>
      </Card>
      
      {/* Grimoire */}
      <div className="lg:col-span-12">
        <div className="flex items-center gap-2 text-lg font-bold mb-4 px-2" style={{ color: '#b3aae0' }}>
           <Scroll className="h-5 w-5"/> Discovered Recipes ({discovered.length}/{Object.keys(RECIPES).length})
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
           {Object.values(RECIPES).map((r, i) => {
             const key = Object.keys(RECIPES)[i]
             const isFound = discovered.includes(key)
             return (
               <div key={key} className={`p-4 rounded border ${isFound ? '' : 'opacity-50'}`} style={isFound ? { backgroundColor: '#241a52', borderColor: '#4a3f7a' } : { backgroundColor: '#0c0824', borderColor: '#4a3f7a' }}>
                 <div className="font-bold" style={{ color: '#ECEAE3' }}>{isFound ? r.name : "???"}</div>
                 <div className="text-xs uppercase" style={{ color: '#ff8a3c' }}>{isFound ? r.tier : "Locked"}</div>
               </div>
             )
           })}
        </div>
      </div>

    </div>
  )
}
