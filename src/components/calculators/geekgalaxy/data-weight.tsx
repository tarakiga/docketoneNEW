"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Database, Scale } from "lucide-react"
import { useMemo, useState } from "react"

const COMPARISONS = [
  { emoji: "🍓", label: "Strawberries", gramsEach: 12 },
  { emoji: "💧", label: "Water Droplets", gramsEach: 0.05 },
  { emoji: "🧂", label: "Grains of Salt", gramsEach: 0.000065 },
  { emoji: "🪶", label: "Eyelashes", gramsEach: 0.00007 },
]

export function DataWeightCalculator() {
  const [photos, setPhotos] = useState(5000)
  const [videoHrs, setVideoHrs] = useState(100)
  const [emails, setEmails] = useState(50000)
  const [songs, setSongs] = useState(2000)
  const [cloudGB, setCloudGB] = useState(50)
  const [posts, setPosts] = useState(3000)

  const result = useMemo(() => {
    // Averages:
    // Photo: 5MB
    // Video: 3GB/hr
    // Email: 75KB
    // Song: 8MB
    // Cloud: GB directly
    // Posts: 500KB
    const totalBytes =
      (photos * 5e6) +
      (videoHrs * 3e9) +
      (emails * 75e3) +
      (songs * 8e6) +
      (cloudGB * 1e9) +
      (posts * 500e3)

    const totalBits = totalBytes * 8
    // Mass equivalent per bit: 3.19e-38 kg -> 3.19e-35 grams
    const weightGrams = totalBits * 3.19e-35

    const internetTotalGrams = 50
    const percentOfInternet = (weightGrams / internetTotalGrams) * 100
    
    // Find a fun comparison
    let comparison = COMPARISONS[0]
    let compCount = weightGrams / COMPARISONS[0].gramsEach
    for (const c of COMPARISONS) {
       compCount = weightGrams / c.gramsEach
       if (compCount >= 0.01) {
           comparison = c
           break
       }
    }
    
    // Fallback if extremely small
    if (weightGrams < 1e-15) {
        comparison = { emoji: "⚛️", label: "Hydrogen Atoms", gramsEach: 1.67e-24 }
        compCount = weightGrams / 1.67e-24
    }

    return { totalBytes, totalBits, weightGrams, percentOfInternet, comparison, compCount }
  }, [photos, videoHrs, emails, songs, cloudGB, posts])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="overflow-hidden relative" style={{ backgroundColor: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}>

        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-display flex items-center gap-2" style={{ color: 'var(--dk-ink)' }}>
            <Scale className="h-6 w-6" style={{ color: '#ff8a3c' }} />
            The Weight of Data
          </CardTitle>
          <CardDescription style={{ color: 'var(--dk-ink-soft)' }}>Quantify the physical mass of your digital existence.</CardDescription>
        </CardHeader>

        <CardContent className="grid lg:grid-cols-2 gap-12 relative z-10">
          {/* LEFT: Controls */}
          <div className="space-y-8 relative z-10">
            
            <div className="flex gap-2 flex-wrap mb-4">
              <button onClick={() => { setPhotos(500); setVideoHrs(10); setEmails(5000); setSongs(200); setCloudGB(5); setPosts(500) }} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--dk-sunk)', border: '1px solid var(--dk-line)', color: 'var(--dk-ink-soft)' }}>Casual</button>
              <button onClick={() => { setPhotos(15000); setVideoHrs(200); setEmails(100000); setSongs(5000); setCloudGB(200); setPosts(10000) }} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--dk-sunk)', border: '1px solid var(--dk-line)', color: 'var(--dk-ink-soft)' }}>Power User</button>
              <button onClick={() => { setPhotos(100000); setVideoHrs(1000); setEmails(500000); setSongs(25000); setCloudGB(2000); setPosts(50000) }} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'var(--dk-sunk)', border: '1px solid var(--dk-line)', color: 'var(--dk-ink-soft)' }}>Digital Hoarder</button>
              <button onClick={() => { setPhotos(1e12); setVideoHrs(1e10); setEmails(1e13); setSongs(1e12); setCloudGB(1e11); setPosts(1e12) }} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#ff8a3c', color: 'var(--dk-on-fill)' }}>The Whole Internet</button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label style={{ color: 'var(--dk-ink)' }}>Photos</Label>
                <span className="text-xs font-mono" style={{ color: 'var(--dk-ink-soft)' }}>{photos.toLocaleString()}</span>
              </div>
              <Slider value={[Math.log10(Math.max(1, photos))]} onValueChange={([v]) => setPhotos(Math.round(Math.pow(10, v)))} min={0} max={12} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c]" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label style={{ color: 'var(--dk-ink)' }}>Video Hours</Label>
                <span className="text-xs font-mono" style={{ color: 'var(--dk-ink-soft)' }}>{videoHrs.toLocaleString()}</span>
              </div>
              <Slider value={[Math.log10(Math.max(1, videoHrs))]} onValueChange={([v]) => setVideoHrs(Math.round(Math.pow(10, v)))} min={0} max={10} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c]" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label style={{ color: 'var(--dk-ink)' }}>Emails</Label>
                <span className="text-xs font-mono" style={{ color: 'var(--dk-ink-soft)' }}>{emails.toLocaleString()}</span>
              </div>
              <Slider value={[Math.log10(Math.max(1, emails))]} onValueChange={([v]) => setEmails(Math.round(Math.pow(10, v)))} min={0} max={13} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c]" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label style={{ color: 'var(--dk-ink)' }}>Songs</Label>
                <span className="text-xs font-mono" style={{ color: 'var(--dk-ink-soft)' }}>{songs.toLocaleString()}</span>
              </div>
              <Slider value={[Math.log10(Math.max(1, songs))]} onValueChange={([v]) => setSongs(Math.round(Math.pow(10, v)))} min={0} max={12} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c]" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label style={{ color: 'var(--dk-ink)' }}>Cloud Storage (GB)</Label>
                <span className="text-xs font-mono" style={{ color: 'var(--dk-ink-soft)' }}>{cloudGB.toLocaleString()}</span>
              </div>
              <Slider value={[Math.log10(Math.max(1, cloudGB))]} onValueChange={([v]) => setCloudGB(Math.round(Math.pow(10, v)))} min={0} max={11} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c]" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label style={{ color: 'var(--dk-ink)' }}>Social Posts</Label>
                <span className="text-xs font-mono" style={{ color: 'var(--dk-ink-soft)' }}>{posts.toLocaleString()}</span>
              </div>
              <Slider value={[Math.log10(Math.max(1, posts))]} onValueChange={([v]) => setPosts(Math.round(Math.pow(10, v)))} min={0} max={12} step={0.1} className="[&_.range-thumb]:bg-[#ff8a3c]" />
            </div>

          </div>

          {/* RIGHT: Visualization */}
          <div className="flex flex-col items-center justify-center space-y-8 rounded-xl p-6 relative overflow-hidden group" style={{ backgroundColor: 'var(--dk-sunk)', border: '1px solid var(--dk-line)' }}>

            {/* Background binary elements */}
            <div className="absolute inset-0 opacity-[0.02] overflow-hidden pointer-events-none flex flex-wrap text-[8px] font-mono leading-none break-all" style={{ color: 'var(--dk-ink-soft)' }}>
               {"01".repeat(1000)}
            </div>

            <div className="relative z-10 space-y-2 flex flex-col items-center justify-center h-48 w-full">
              <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                 {result.comparison.emoji}
              </div>
              <div className="text-xl font-bold mt-4 text-center" style={{ color: 'var(--dk-ink)' }}>
                 <span style={{ color: '#ff8a3c' }}>≈ {result.compCount < 1 ? result.compCount.toExponential(2) : result.compCount.toLocaleString('en-US', { maximumFractionDigits: 1 })}</span> {result.comparison.label}
              </div>
            </div>

            <div className="text-center space-y-2 relative z-10 w-full">
              <div className="text-4xl md:text-5xl font-black break-all" style={{ fontFamily: 'var(--font-fredoka), cursive', color: '#ff8a3c' }}>
                {result.weightGrams < 1e-10 ? result.weightGrams.toExponential(2) : result.weightGrams.toLocaleString('en-US', { maximumFractionDigits: 15 })} g
              </div>
              <div className="text-sm uppercase tracking-widest flex items-center justify-center gap-2" style={{ color: 'var(--dk-ink-soft)' }}>
                 <Database className="w-4 h-4" />
                 Total Mass
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 relative z-10">
              <div className="p-3 rounded text-center" style={{ backgroundColor: 'var(--dk-raised)', border: '1px solid var(--dk-line)' }}>
                <div className="text-xs mb-1 line-clamp-1" style={{ color: 'var(--dk-ink-soft)' }}>Total Data</div>
                <div className="font-mono break-all" style={{ color: 'var(--dk-ink)' }}>
                   {(result.totalBytes / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 })} GB
                </div>
              </div>
              <div className="p-3 rounded text-center" style={{ backgroundColor: 'var(--dk-raised)', border: '1px solid var(--dk-line)' }}>
                <div className="text-xs mb-1 line-clamp-1" style={{ color: 'var(--dk-ink-soft)' }}>% of Whole Internet</div>
                <div className="font-mono break-all" style={{ color: '#ff8a3c' }}>
                   {result.percentOfInternet.toExponential(2)}%
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 w-full">
                <ShareResult
                title="The Weight of Data"
                text={`My entire digital life weighs ${result.weightGrams < 1e-5 ? result.weightGrams.toExponential(2) : result.weightGrams.toFixed(8)} grams. How heavy is your data?`}
                />
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
