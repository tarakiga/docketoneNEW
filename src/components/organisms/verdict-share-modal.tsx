"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { toPng } from "html-to-image"
import { Copy, Download, Share2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface ShareModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    result: string
    description?: string
    url?: string
}

export function VerdictShareModal({ isOpen, onOpenChange, title, result, description, url }: ShareModalProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [shareFile, setShareFile] = useState<File | null>(null)
    const [canNativeShare, setCanNativeShare] = useState(false)

    // Native share (mobile) lists every app; the explicit social buttons are
    // only the useful fallback where it's missing (most desktops).
    useEffect(() => {
        setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function")
    }, [])

    const finalUrl = url || (typeof window !== "undefined" ? window.location.href : "")
    const shareText = `${title}: ${result}`

    // Pre-render the result card to a PNG when the modal opens, so the Share
    // button can attach it to navigator.share() synchronously within the click
    // gesture (iOS Safari rejects share() if async work runs first).
    useEffect(() => {
        if (!isOpen) {
            setShareFile(null)
            return
        }
        let cancelled = false
        const t = setTimeout(async () => {
            if (!cardRef.current) return
            try {
                const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
                const blob = await (await fetch(dataUrl)).blob()
                if (!cancelled) {
                    setShareFile(new File([blob], `docket-one-${Date.now()}.png`, { type: "image/png" }))
                }
            } catch {
                /* generation failed — Share will fall back to a link */
            }
        }, 450)
        return () => {
            cancelled = true
            clearTimeout(t)
        }
    }, [isOpen, title, result])

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(finalUrl)
            toast.success("Link copied to clipboard!")
        } catch {
            toast.error("Couldn't copy the link.")
        }
    }

    const isAbort = (err: unknown) => (err as { name?: string })?.name === "AbortError"

    const handleShare = async () => {
        const nav = typeof navigator !== "undefined" ? navigator : undefined
        // 1) Best case: share the actual result card as an image file (mobile).
        if (nav?.share && shareFile && nav.canShare?.({ files: [shareFile] })) {
            try {
                // Link goes in the caption text so it travels alongside the image.
                await nav.share({ files: [shareFile], title, text: `${shareText}\n${finalUrl}` })
                return
            } catch (err) {
                if (isAbort(err)) return // user dismissed the share sheet
                /* otherwise fall through to a link share */
            }
        }
        // 2) Fallback: share the link + text.
        if (nav?.share) {
            try {
                await nav.share({ title, text: shareText, url: finalUrl })
                return
            } catch (err) {
                if (isAbort(err)) return
            }
        }
        // 3) No Web Share API (most desktops): copy the link.
        handleCopyLink()
    }

    const handleDownload = async () => {
        if (!cardRef.current) return
        setIsGenerating(true)
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
            const link = document.createElement("a")
            link.download = `docket-one-${Date.now()}.png`
            link.href = dataUrl
            link.click()
            toast.success("Image saved!")
        } catch {
            toast.error("Couldn't generate the image.")
        } finally {
            setIsGenerating(false)
        }
    }

    const social = [
        {
            name: "WhatsApp",
            icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} - ${finalUrl}`)}`, "_blank"),
        },
        {
            name: "X",
            icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(finalUrl)}`, "_blank"),
        },
        {
            name: "LinkedIn",
            icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
            action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalUrl)}`, "_blank"),
        },
    ]

    const mono = "var(--font-space-mono), monospace"
    const pixel = "var(--font-press), monospace"
    const display = "var(--font-bungee), cursive"

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-[400px] p-0 border-0 bg-transparent shadow-none"
                style={{ fontFamily: mono }}
            >
                <div style={{ background: "#160e33", border: "3px solid #29e0ff", boxShadow: "8px 8px 0 #0c0824", borderRadius: 8 }} className="p-4 sm:p-6 min-w-0 overflow-hidden">
                    <DialogClose
                        className="absolute right-3 top-3 w-9 h-9 flex items-center justify-center shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b6ff3c]"
                        style={{ background: "#241a52", border: "2px solid #4a3f7a", borderRadius: 4 }}
                    >
                        <X className="w-4 h-4" style={{ color: "#b3aae0" }} />
                        <span className="sr-only">Close</span>
                    </DialogClose>

                    <DialogTitle style={{ fontFamily: display, color: "#ffd23c", fontSize: "clamp(17px, 5.5vw, 22px)", lineHeight: 1.1, paddingRight: 40 }}>
                        Share your score
                    </DialogTitle>
                    <DialogDescription style={{ color: "#b3aae0", fontSize: 12, marginTop: 4 }}>
                        Save the card or send the link - brag a little.
                    </DialogDescription>

                    {/* Shareable arcade card (this is what downloads as a PNG) */}
                    <div className="flex justify-center my-5">
                        <div
                            ref={cardRef}
                            style={{
                                width: "100%",
                                maxWidth: 320,
                                minHeight: 380,
                                background: "#0c0824",
                                backgroundImage: "repeating-linear-gradient(transparent 0 3px, rgba(0,0,0,.18) 3px 4px)",
                                border: "3px solid #ffd23c",
                                borderRadius: 10,
                                padding: "clamp(16px, 6vw, 26px)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                color: "#ECEAE3",
                            }}
                        >
                            <div>
                                <div style={{ fontFamily: pixel, fontSize: 9, letterSpacing: ".18em", color: "#29e0ff", marginBottom: 22 }}>
                                    ★ DOCKET ONE ARCADE
                                </div>
                                <h3 style={{ fontFamily: display, color: "#ffd23c", fontSize: "clamp(20px, 6.5vw, 30px)", lineHeight: 0.95, textShadow: "3px 3px 0 #ff3ca6", margin: 0, wordBreak: "break-word" }}>
                                    {title}
                                </h3>
                                <div style={{ height: 4, width: 56, background: "#29e0ff", marginTop: 16 }} />
                            </div>

                            <div>
                                <div style={{ fontFamily: pixel, fontSize: 8, letterSpacing: ".24em", color: "#b6ff3c", marginBottom: 10 }}>
                                    ▚ YOUR RESULT
                                </div>
                                <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.35, color: "#fff" }}>
                                    {result}
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #4a3f7a", paddingTop: 14 }}>
                                <span style={{ fontFamily: display, color: "#29e0ff", fontSize: 14 }}>DOCKET ONE</span>
                                <span style={{ fontFamily: mono, color: "#b3aae0", fontSize: 11 }}>docket.one</span>
                            </div>
                        </div>
                    </div>

                    {/* Primary action — native share (mobile) sends the card image + link */}
                    {canNativeShare && (
                        <button
                            type="button"
                            onClick={handleShare}
                            className="w-full flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#160e33]"
                            style={{ fontFamily: pixel, fontSize: 11, padding: "14px", background: "#b6ff3c", color: "#160e33", border: "2px solid #fff", borderRadius: 0, cursor: "pointer", textTransform: "uppercase" }}
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    )}

                    {/* Secondary actions */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6ff3c]"
                            style={{ fontFamily: mono, fontWeight: 700, fontSize: 12, padding: "12px", background: "#241a52", color: "#ECEAE3", border: "2px solid #4a3f7a", borderRadius: 0, cursor: "pointer" }}
                        >
                            {isGenerating ? (
                                <span className="animate-spin" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #4a3f7a", borderTopColor: "#b6ff3c", borderRadius: "50%" }} />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            Save image
                        </button>
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b6ff3c]"
                            style={{ fontFamily: mono, fontWeight: 700, fontSize: 12, padding: "12px", background: "#241a52", color: "#ECEAE3", border: "2px solid #4a3f7a", borderRadius: 0, cursor: "pointer" }}
                        >
                            <Copy className="w-4 h-4" /> Copy link
                        </button>
                    </div>

                    {/* Social row — only where native share isn't available (desktop) */}
                    {!canNativeShare && (
                    <div className="flex items-center gap-2 mt-4">
                        <span style={{ fontFamily: pixel, fontSize: 8, letterSpacing: ".2em", color: "#6f67a0", whiteSpace: "nowrap" }}>OR POST TO</span>
                        <div style={{ flex: 1, height: 1, background: "#2f2a5a" }} />
                        {social.map((s) => (
                            <button
                                key={s.name}
                                type="button"
                                onClick={s.action}
                                title={s.name}
                                aria-label={s.name}
                                className="flex items-center justify-center hover:border-[#29e0ff] hover:text-[#29e0ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b6ff3c]"
                                style={{ width: 38, height: 38, background: "#241a52", color: "#ECEAE3", border: "2px solid #4a3f7a", borderRadius: 4, cursor: "pointer", transition: "border-color .15s, color .15s" }}
                            >
                                {s.icon}
                            </button>
                        ))}
                    </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
