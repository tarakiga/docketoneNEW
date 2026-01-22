"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useMemo, useState } from "react"

// Distances in LY
const LOCATIONS = {
  'Earth': { 'Vulcan': 16.5, 'Alpha Centauri': 4.37, 'Qo\'noS': 92.6, 'Cardassia': 51.3, 'Bajor': 52.1, 'Earth': 0 },
  'Vulcan': { 'Earth': 16.5, 'Alpha Centauri': 12.1, 'Qo\'noS': 76.1, 'Cardassia': 34.8, 'Bajor': 35.6, 'Vulcan': 0 },
  'Alpha Centauri': { 'Earth': 4.37, 'Vulcan': 12.1, 'Qo\'noS': 88.2, 'Cardassia': 46.9, 'Bajor': 47.7, 'Alpha Centauri': 0 },
  'Qo\'noS': { 'Earth': 92.6, 'Vulcan': 76.1, 'Alpha Centauri': 88.2, 'Cardassia': 41.3, 'Bajor': 40.5, 'Qo\'noS': 0 },
  'Cardassia': { 'Earth': 51.3, 'Vulcan': 34.8, 'Alpha Centauri': 46.9, 'Qo\'noS': 41.3, 'Bajor': 0.8, 'Cardassia': 0 },
  'Bajor': { 'Earth': 52.1, 'Vulcan': 35.6, 'Alpha Centauri': 47.7, 'Qo\'noS': 40.5, 'Cardassia': 0.8, 'Bajor': 0 },
}

export function WarpSpeedCalculator() {
  const [era, setEra] = useState<'TOS' | 'TNG'>('TNG')
  const [warp, setWarp] = useState(5.0)
  const [origin, setOrigin] = useState('Earth')
  const [dest, setDest] = useState('Vulcan')

  const speedC = useMemo(() => {
    if (era === 'TOS') return Math.pow(warp, 3)
    if (warp <= 9) return Math.pow(warp, 10/3)
    // TNG simplified Okuda curve for >9
    return Math.pow(warp, (10/3) + Math.pow(warp - 9, 2))
  }, [warp, era])

  const distance = useMemo(() => {
    return (LOCATIONS[origin as keyof typeof LOCATIONS] as any)?.[dest] || 0
  }, [origin, dest])

  const time = useMemo(() => {
    if (speedC <= 0 || distance <= 0) return 0
    return distance / speedC // Years
  }, [speedC, distance])

  const formattedTime = useMemo(() => {
    if (time === 0) return "Arrived"
    if (time < 1/365/24) return `${(time * 365 * 24 * 60).toFixed(1)} Minutes`
    if (time < 1/365) return `${(time * 365 * 24).toFixed(1)} Hours`
    if (time < 1) return `${(time * 365).toFixed(1)} Days`
    return `${time.toFixed(2)} Years`
  }, [time])

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <Card className="bg-black border-amber-600/50 rounded-2xl overflow-hidden border-[6px] border-r-[40px] border-t-0 border-b-0" style={{ borderRightColor: '#ff9900', borderLeftColor: '#cc6600' }}>
         {/* LCARS Header */}
         <div className="bg-[#cc6600] h-16 flex items-end justify-end px-4 pb-1 rounded-bl-3xl ml-[200px] mb-4 relative">
             <div className="absolute left-[-212px] top-0 bottom-0 w-[200px] bg-[#cc6600] rounded-r-3xl"></div> 
             <div className="text-black font-black text-2xl tracking-widest uppercase font-mono">ASTROGATION</div>
         </div>

         <CardContent className="grid lg:grid-cols-12 gap-8 p-6 pl-12">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-6">
               <div className="space-y-4">
                 <Label className="text-[#ff9900] font-bold uppercase tracking-wider">Warp Scale Era</Label>
                  <div className="flex gap-2">
                   {['TOS', 'TNG'].map(e => (
                     <button key={e} onClick={() => setEra(e as any)} className={`flex-1 py-2 font-bold rounded-full transition-colors ${era === e ? 'bg-[#ff9900] text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                       {e === 'TOS' ? '23rd Century' : '24th Century'}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex justify-between">
                    <Label className="text-[#ff9900] font-bold uppercase">Warp Factor</Label>
                    <span className="text-[#ff9900] font-mono text-xl">{warp.toFixed(2)}</span>
                 </div>
                 <Slider value={[warp]} onValueChange={([v]) => setWarp(v)} min={1} max={era === 'TOS' ? 9 : 9.9} step={0.1} className="[&_.range-thumb]:bg-[#ff9900] [&_.range-track]:bg-slate-800" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-[#ff9900]">Origin</Label>
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger className="bg-slate-900 border-[#cc6600] text-[#ff9900]"><SelectValue/></SelectTrigger>
                      <SelectContent>{Object.keys(LOCATIONS).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[#ff9900]">Destination</Label>
                    <Select value={dest} onValueChange={setDest}>
                      <SelectTrigger className="bg-slate-900 border-[#cc6600] text-[#ff9900]"><SelectValue/></SelectTrigger>
                      <SelectContent>{Object.keys(LOCATIONS).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
               </div>
            </div>

            {/* Display */}
            <div className="lg:col-span-7 bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center border border-white/10">
               <div className="text-sm text-slate-500 uppercase tracking-widest mb-4">Estimated Time of Arrival</div>
               <div className="text-6xl font-black text-[#ff9900] font-mono mb-2">{formattedTime}</div>
               <div className="text-slate-400 mb-8 font-mono">{distance} Light Years</div>
               
               <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="bg-black p-4 rounded border-l-4 border-[#cc6600]">
                    <div className="text-xs text-slate-500 uppercase">Velocity (c)</div>
                    <div className="text-2xl font-mono text-[#cc6600]">{Math.round(speedC).toLocaleString()}x</div>
                  </div>
                   <div className="bg-black p-4 rounded border-l-4 border-[#994400]">
                    <div className="text-xs text-slate-500 uppercase">Velocity (km/s)</div>
                    <div className="text-2xl font-mono text-[#994400]">{(speedC * 299792).toExponential(2)}</div>
                  </div>
               </div>

               <div className="my-6">
                 <ShareResult title="Starfleet Astrogation" text={`Engage! Travels from ${origin} to ${dest} at Warp ${warp} will take approximately ${formattedTime}. 🖖`} />
               </div>
            </div>

         </CardContent>
         <div className="bg-[#994400] h-4 w-full"></div>
      </Card>
    </div>
  )
}
