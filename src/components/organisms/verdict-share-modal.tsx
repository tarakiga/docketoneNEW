"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toPng } from "html-to-image"
import { Copy, Download, Share2, X, Zap } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface PremiumShareModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    result: string
    description?: string // e.g. "I'm caffeinated!"
    url?: string
}

export function VerdictShareModal({ isOpen, onOpenChange, title, result, description, url }: PremiumShareModalProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    const finalUrl = url || (typeof window !== 'undefined' ? window.location.href : "")

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(finalUrl)
            toast.success("Link copied to clipboard!")
        } catch {
            toast.error("Failed to copy link.")
        }
    }

    const handleGenerateImage = async (action: 'download' | 'share') => {
        if (!cardRef.current) return
        
        setIsGenerating(true)
        try {
            // Wait for fonts/rendering
            const dataUrl = await toPng(cardRef.current, { 
                cacheBust: true,
                style: { transform: 'scale(1)' },
                pixelRatio: 2 // High res
            })

            if (action === 'download') {
                const link = document.createElement('a')
                link.download = `docket-one-result-${Date.now()}.png`
                link.href = dataUrl
                link.click()
                toast.success("Snapshot downloaded!")
            } else if (action === 'share') {
                 // Convert base64 to blob
                 const res = await fetch(dataUrl)
                 const blob = await res.blob()
                 const file = new File([blob], "result.png", { type: "image/png" })

                 if (navigator.share && navigator.canShare({ files: [file] })) {
                     await navigator.share({
                         files: [file],
                         title: title,
                         text: description,
                         url: finalUrl
                     })
                     toast.success("Shared successfully!")
                 } else {
                     toast.error("Sharing image not supported on this device. Downloading instead.")
                     const link = document.createElement('a')
                     link.download = `docket-one-result-${Date.now()}.png`
                     link.href = dataUrl
                     link.click()
                 }
            }

        } catch (err) {
            console.error(err)
            toast.error("Failed to generate snapshot.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-[440px] bg-slate-950/95 border-white/10 text-white backdrop-blur-2xl p-0 overflow-hidden rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(30,58,138,0.5)]">
                <div className="relative p-8 space-y-8">
                    {/* Premium Close Button */}
                    <DialogClose className="absolute right-6 top-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all z-50 group">
                        <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </DialogClose>

                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                             Share Verdict
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium italic text-xs uppercase tracking-widest opacity-60">
                            Let the world know your numbers.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Premium Share Card */}
                    <div className="flex justify-center group perspective-1000">
                        <div 
                            ref={cardRef}
                            className="w-[340px] h-[460px] rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]"
                            style={{
                                background: 'radial-gradient(circle at 0% 0%, #171717 0%, transparent 60%), radial-gradient(circle at 100% 0%, #1e1b4b 0%, transparent 60%), radial-gradient(circle at 100% 100%, #312e81 0%, transparent 60%), radial-gradient(circle at 0% 100%, #171717 0%, transparent 60%), #020617',
                            }}
                        >
                            {/* Mesh Gradient Overlays */}
                            <div className="absolute inset-0 opacity-40 mix-blend-overlay"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 50% 50%, #4c1d95 0%, transparent 70%)',
                                }}
                            />

                            {/* Grain Texture */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
                                style={{backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'}} 
                            />
                            
                            {/* Category Badge */}
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-12">
                                    <Zap className="w-3 h-3 text-primary animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80">Docket Intelligence</span>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-4xl font-black text-white leading-[0.85] tracking-tighter drop-shadow-lg">
                                        {title}
                                    </h3>
                                    <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-indigo-500 rounded-full" />
                                </div>
                            </div>

                            {/* Center Hook (The Hero Result) */}
                            <div className="relative z-10">
                                <div className="inline-block px-3 py-1 bg-primary/20 rounded-md border border-primary/30 mb-4 transition-transform group-hover:-translate-y-1">
                                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary">Calculation Complete</span>
                                </div>
                                <div className="text-xl font-semibold text-white leading-snug drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                    {result}
                                </div>
                            </div>

                            {/* Footer Logo/Link */}
                            <div className="relative z-10 flex items-center justify-between pt-10 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 shadow-inner">
                                        <span className="text-white font-black text-xl italic select-none">D</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white drop-shadow-md">Docket One</span>
                                        <span className="text-[10px] font-mono text-white/30 tracking-tight">V3.14.159</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity">
                                    <Share2 className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Selection */}
                    <div className="space-y-6 pt-4 pb-4">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                             <div className="h-[1px] flex-1 bg-white/5" />
                             Broadcast Results
                             <div className="h-[1px] flex-1 bg-white/5" />
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 px-2">
                            {[
                                { 
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, 
                                    name: "WhatsApp",
                                    color: "bg-green-500/10 text-green-500 hover:bg-green-500",
                                    action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${result} - Check yours at ${finalUrl}`)}`, '_blank')
                                },
                                { 
                                    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, 
                                    name: "X Space",
                                    color: "bg-white/5 text-white hover:bg-white",
                                    action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}: ${result}`)}&url=${encodeURIComponent(finalUrl)}`, '_blank')
                                },
                                { 
                                    icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, 
                                    name: "LinkedIn",
                                    color: "bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]",
                                    action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalUrl)}`, '_blank')
                                },
                                { 
                                    icon: <Copy className="w-5 h-5" />, 
                                    name: "Copy Link",
                                    color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500",
                                    action: handleCopyLink
                                }
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={item.action}
                                    className={`flex flex-col items-center gap-3 group/btn`}
                                >
                                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:-translate-y-2 group-hover/btn:text-slate-950 group-hover/btn:shadow-2xl shadow-indigo-500/20 ${item.color} border border-white/5`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/btn:text-white transition-colors">
                                        {item.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Snapshot Button */}
                    <div className="pt-4">
                        <Button 
                            onClick={() => handleGenerateImage('download')}
                            disabled={isGenerating}
                            className="w-full bg-white text-slate-950 hover:bg-slate-100 h-16 rounded-[1.25rem] font-black text-lg gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all group/dl overflow-hidden"
                        >
                            {isGenerating ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-4 border-slate-300 border-t-slate-950 rounded-full animate-spin" />
                                    <span className="uppercase tracking-widest text-sm">Crafting Image...</span>
                                </div>
                            ) : (
                                <>
                                    <Download className="w-5 h-5 group-hover/dl:animate-bounce" />
                                    <span>Download Snapshot</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
