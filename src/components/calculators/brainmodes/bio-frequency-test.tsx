"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"

const FREQUENCIES = [
    { freq: 8000, label: "8,000 Hz", age: "Everyone" },
    { freq: 10000, label: "10,000 Hz", age: "Under 60" },
    { freq: 12000, label: "12,000 Hz", age: "Under 50" },
    { freq: 14000, label: "14,000 Hz", age: "Under 40" },
    { freq: 15000, label: "15,000 Hz", age: "Under 30" },
    { freq: 16000, label: "16,000 Hz", age: "Under 24" },
    { freq: 17000, label: "17,000 Hz", age: "Under 20" },
    { freq: 18000, label: "18,000 Hz", age: "Under 18" },
    { freq: 19000, label: "19,000 Hz", age: "Under 15" },
    { freq: 20000, label: "20,000 Hz", age: "Dog / Alien" },
]

const VOLUME = 0.1
const BAR_HEIGHTS = [30, 38, 46, 54, 62, 70, 78, 86, 93, 100]

export function BioFrequencyTest() {
    const [phase, setPhase] = useState<"gate" | "test" | "done">("gate")
    const [step, setStep] = useState(0)
    const [maxHeard, setMaxHeard] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const audioCtxRef = useRef<AudioContext | null>(null)
    const oscRef = useRef<OscillatorNode | null>(null)
    const gainRef = useRef<GainNode | null>(null)
    const toneStartRef = useRef(0)

    const stopTone = useCallback(() => {
        if (oscRef.current && audioCtxRef.current) {
            try {
                const t = audioCtxRef.current.currentTime
                // Guarantee a quick tap still yields an audible beep (~0.3s) before fading out.
                const fadeAt = Math.max(t, toneStartRef.current + 0.3)
                gainRef.current?.gain.setValueAtTime(VOLUME, fadeAt)
                gainRef.current?.gain.exponentialRampToValueAtTime(0.001, fadeAt + 0.1)
                oscRef.current.stop(fadeAt + 0.12)
            } catch {
                // already stopped
            }
            oscRef.current = null
        }
        setIsPlaying(false)
    }, [])

    useEffect(() => () => stopTone(), [stopTone])

    const startTone = (freq: number) => {
        if (!audioCtxRef.current) {
            const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
            if (!AC) return
            audioCtxRef.current = new AC()
        }
        const ctx = audioCtxRef.current
        if (ctx.state === "suspended") void ctx.resume()

        stopTone()

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        // Real anti-pop: start near-silent, ramp up to volume.
        gain.gain.setValueAtTime(0.001, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 0.08)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        toneStartRef.current = ctx.currentTime

        oscRef.current = osc
        gainRef.current = gain
        setIsPlaying(true)
    }

    const current = FREQUENCIES[step]

    const answerHeard = () => {
        stopTone()
        setMaxHeard(current.freq)
        if (step === FREQUENCIES.length - 1) setPhase("done")
        else setStep(s => s + 1)
    }

    const answerNotHeard = () => {
        stopTone()
        setPhase("done")
    }

    const retake = () => {
        stopTone()
        setMaxHeard(0)
        setStep(0)
        setPhase("test")
    }

    const heardCount = FREQUENCIES.filter(f => f.freq <= maxHeard).length
    const earAge = maxHeard === 0 ? null : FREQUENCIES.find(f => f.freq === maxHeard)?.age ?? null
    const sensitivity = maxHeard >= 17000 ? "Superhuman" : maxHeard >= 15000 ? "High" : maxHeard > 0 ? "Standard" : "-"

    const MONO_K = "font-mono text-[10px] uppercase tracking-[0.16em] text-[#b3aae0]"

    return (
        <motion.div
            className="w-full rounded-3xl p-5 md:p-8 border shadow-2xl relative overflow-hidden"
            style={{ background: "#1d1442", borderColor: "#4a3f7a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
                    <h2 className="text-2xl font-extrabold text-[#ECEAE3] flex items-center gap-3"><span className="text-3xl">👂</span> Bio-Frequency Test</h2>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2" style={{ color: "#5bf0c0" }}><span className={`h-2 w-2 rounded-full ${isPlaying ? "animate-ping" : "animate-pulse"}`} style={{ background: "#5bf0c0" }} /> Live tone generator</span>
                </div>

                {/* Volume note */}
                <div className="rounded-xl px-4 py-3 text-[12.5px] text-[#b3aae0] max-w-2xl mx-auto flex gap-2.5 mb-6" style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}>
                    <span>🔉</span>
                    <span><b className="text-[#ECEAE3]">Lower your volume to ~20%</b> before testing. One tone at a time - hold the pad, listen carefully, then answer honestly.</span>
                </div>

                {phase === "gate" && (
                    <div className="max-w-md mx-auto text-center rounded-2xl p-8 my-4" style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}>
                        <div className="text-3xl mb-3">⚠️</div>
                        <h3 className="font-bold mb-2" style={{ color: "#ffd23c" }}>Safety first!</h3>
                        <p className="text-sm text-[#b3aae0] mb-5">High-frequency tones can be piercing. Please lower your device volume to about 20% before starting.</p>
                        <button onClick={() => setPhase("test")} className="font-mono font-bold text-sm uppercase tracking-wide rounded-xl px-7 py-3.5 transition-colors" style={{ background: "#5bf0c0", color: "#160e33" }}>
                            I&apos;ve lowered my volume →
                        </button>
                    </div>
                )}

                {phase === "test" && (
                    <>
                        {/* progress dots */}
                        <div className="flex gap-1.5 justify-center mb-6">
                            {FREQUENCIES.map((f, i) => (
                                <div key={f.freq} className="h-1.5 w-8 rounded-full" style={{ background: i < step ? "#5bf0c0" : i === step ? "#5bf0c0" : "#241a52" }} />
                            ))}
                        </div>

                        <div className="text-center max-w-xl mx-auto">
                            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#b3aae0]">Tone {step + 1} of {FREQUENCIES.length}</div>
                            <div className="text-5xl md:text-6xl font-black tracking-tight text-[#ECEAE3] leading-none mt-2">{current.label}</div>
                            <div className="font-mono text-[12px] uppercase tracking-[0.1em] mt-2" style={{ color: "#5bf0c0" }}>Typically heard by: {current.age}</div>

                            {/* Hold-to-play pad */}
                            <div className="relative w-[190px] h-[190px] mx-auto my-8 grid place-items-center select-none">
                                <div className="absolute inset-[-38px] rounded-full border pointer-events-none" style={{ borderColor: "#4a3f7a" }} />
                                <div className="absolute inset-[-18px] rounded-full border pointer-events-none" style={{ borderColor: "#4a3f7a" }} />
                                <div className="absolute inset-0 rounded-full border pointer-events-none" style={{ borderColor: "#4a3f7a" }} />
                                <button
                                    type="button"
                                    aria-label={`Hold to play ${current.label}`}
                                    onPointerDown={(e) => { try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* capture unsupported */ } startTone(current.freq) }}
                                    onPointerUp={stopTone}
                                    onPointerCancel={stopTone}
                                    onPointerLeave={stopTone}
                                    onContextMenu={(e) => e.preventDefault()}
                                    className={`relative z-10 w-[150px] h-[150px] rounded-full border-2 grid place-items-center transition-transform touch-none ${isPlaying ? "scale-95" : ""}`}
                                    style={{ background: "#0c0824", borderColor: "#5bf0c0", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
                                >
                                    <span>
                                        <span className="block text-3xl">{isPlaying ? "🔊" : "🔈"}</span>
                                        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] mt-1.5" style={{ color: "#5bf0c0" }}>{isPlaying ? "Playing…" : "Hold to play"}</span>
                                    </span>
                                </button>
                            </div>

                            <div className="flex gap-3.5 justify-center flex-wrap">
                                <button onClick={answerHeard} className="font-mono font-bold text-[13px] uppercase tracking-wide rounded-xl px-7 py-3.5 transition-colors" style={{ background: "#5bf0c0", color: "#160e33" }}>✓ I hear it</button>
                                <button onClick={answerNotHeard} className="font-mono font-bold text-[13px] uppercase tracking-wide text-[#ECEAE3] rounded-xl px-7 py-3.5 transition-colors" style={{ background: "#241a52", border: "1px solid #4a3f7a" }}>✗ Can&apos;t hear it</button>
                            </div>
                        </div>

                        {/* running tally */}
                        <div className="mt-8 rounded-2xl px-5 py-4 flex items-center justify-between gap-5 flex-wrap max-w-3xl mx-auto" style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}>
                            <div><div className={MONO_K}>Top frequency so far</div><div className="font-bold text-lg mt-0.5" style={{ color: "#5bf0c0" }}>{maxHeard > 0 ? `${maxHeard.toLocaleString()} Hz` : "-"}</div></div>
                            <div className="flex items-end gap-[3px] h-10 flex-1 max-w-[280px] min-w-[160px]">
                                {BAR_HEIGHTS.map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${h}%`, background: i < heardCount ? "#5bf0c0" : "#241a52" }} />
                                ))}
                            </div>
                            <div className="text-right"><div className={MONO_K}>Ear age estimate</div><div className="font-bold text-[#ECEAE3] text-lg mt-0.5">{earAge ?? "Testing…"}</div></div>
                        </div>
                    </>
                )}

                {phase === "done" && (
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="rounded-2xl p-8 mb-4" style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}>
                            <div className={MONO_K}>Your biological ear age</div>
                            <div className="text-6xl md:text-7xl font-black tracking-tight leading-none my-3" style={{ color: "#5bf0c0", fontFamily: "var(--font-bungee), cursive" }}>
                                {earAge ?? "Hmm…"}
                            </div>
                            <div className="font-mono text-[12px] text-[#b3aae0]">
                                {maxHeard > 0
                                    ? <>Top confirmed frequency: <b className="text-[#ECEAE3]">{maxHeard.toLocaleString()} Hz</b></>
                                    : "No tone confirmed - check your volume and speakers, then retake."}
                            </div>
                            <div className="flex items-end gap-1 h-24 mt-6 mb-1">
                                {BAR_HEIGHTS.map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t-[4px]" style={{ height: `${h}%`, background: i < heardCount ? "#5bf0c0" : "#241a52" }} />
                                ))}
                            </div>
                            <div className="flex justify-between font-mono text-[9px] uppercase text-[#b3aae0] px-1">
                                <span>8k</span><span>12k</span><span>15k</span><span>17k</span><span>20k</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="rounded-2xl p-4 text-left" style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}><div className={MONO_K}>👂 Sensitivity</div><div className="font-extrabold text-[#ECEAE3] text-xl mt-1">{sensitivity}</div></div>
                            <div className="rounded-2xl p-4 text-left" style={{ background: "#0c0824", border: "1px solid #4a3f7a" }}><div className={MONO_K}>🎯 Tones confirmed</div><div className="font-extrabold text-[#ECEAE3] text-xl mt-1">{heardCount} of {FREQUENCIES.length}</div></div>
                        </div>

                        <div className="flex gap-3 justify-center flex-wrap">
                            <button onClick={retake} className="font-mono font-bold text-[13px] uppercase tracking-wide text-[#ECEAE3] rounded-xl px-6 py-3 transition-colors" style={{ background: "#241a52", border: "1px solid #4a3f7a" }}>↺ Test again</button>
                            <ShareResult
                                title="Ear Age Test"
                                text={maxHeard > 0
                                    ? `I can hear frequencies up to ${maxHeard.toLocaleString()} Hz - my biological ear age is "${earAge}"! Test yours at Docket One. #EarAgeTest`
                                    : "I just took the Bio-Frequency ear age test at Docket One. #EarAgeTest"}
                                className="!bg-[#5bf0c0] hover:!bg-[#5bf0c0] !text-[#160e33] !border-none"
                            />
                        </div>
                    </div>
                )}

                <p className="text-[11px] text-[#b3aae0] leading-relaxed text-center max-w-2xl mx-auto mt-6">
                    {phase === "test" ? "Answering “Can't hear it” ends the climb and reveals your result. " : ""}
                    Results depend on your speakers or headphones and volume - laptop speakers often can&apos;t reproduce the highest tones at all. A fun estimate, not a medical hearing test.
                </p>
            </div>
        </motion.div>
    )
}
