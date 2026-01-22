"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toPng } from "html-to-image"
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

export function PremiumShareModal({ isOpen, onOpenChange, title, result, description, url }: PremiumShareModalProps) {
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
            <DialogContent className="sm:max-w-md bg-slate-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Share Result</DialogTitle>
                    <DialogDescription>Show off your calculation.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Preview Card */}
                    <div className="flex justify-center">
                        <div 
                            ref={cardRef}
                            className="w-[320px] h-[400px] bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden shadow-2xl"
                        >
                            {/* Decorative */}
                            <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-purple-500/20 blur-[50px] rounded-full" />
                            <div className="absolute bottom-[-50px] left-[-50px] w-[150px] h-[150px] bg-cyan-500/20 blur-[50px] rounded-full" />

                            <div className="relative z-10">
                                <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Docket One</div>
                                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                <p className="text-sm text-indigo-200">{description || "Calculated with precision."}</p>
                            </div>

                            <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Result</div>
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-tight break-words">
                                    {result}
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                    <span className="text-white font-bold">D</span>
                                </div>
                                <div className="text-[10px] text-white/40">
                                    docket.one
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {/* Actions removed as per request */}

                    {/* Social Platforms */}
                    <div className="pt-6 border-t border-white/10">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Share Link via</div>
                        <div className="flex justify-center gap-4">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 hover:text-[#25D366] transition-colors"
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${finalUrl}`)}`, '_blank')}
                                title="Share on WhatsApp"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-black/40 text-white hover:bg-black/60 transition-colors border border-white/10"
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(description || title)}&url=${encodeURIComponent(finalUrl)}`, '_blank')}
                                title="Share on X"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 4l11.733 16h4.67l-13.88-18h-4.66l12.113 18zm17 19.5h-3.33l-7.78-10.74 8.78-11.26h3.33l-9.78 12.74z"/></svg>
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 hover:text-[#0077b5] transition-colors"
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalUrl)}`, '_blank')}
                                title="Share on LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 hover:text-[#1877F2] transition-colors"
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalUrl)}`, '_blank')}
                                title="Share on Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
