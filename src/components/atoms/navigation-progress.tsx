"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Site-wide navigation feedback: a slim top progress bar that starts when the
 * user clicks any internal link (or when `docket:navstart` is dispatched for
 * programmatic navigation) and completes when the route changes. A fail-safe
 * timeout hides it if navigation never lands.
 */
export function NavigationProgress() {
    const pathname = usePathname()
    const [visible, setVisible] = useState(false)
    const [progress, setProgress] = useState(0)
    const activeRef = useRef(false)
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const failSafeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const stopTimers = () => {
        if (tickRef.current) clearInterval(tickRef.current)
        if (failSafeRef.current) clearTimeout(failSafeRef.current)
        tickRef.current = null
        failSafeRef.current = null
    }

    const finish = useCallback(() => {
        if (!activeRef.current) return
        activeRef.current = false
        stopTimers()
        setProgress(100)
        setTimeout(() => { setVisible(false); setProgress(0) }, 350)
    }, [])

    const start = useCallback(() => {
        if (activeRef.current) return
        activeRef.current = true
        setVisible(true)
        setProgress(12)
        // ease toward 85% while we wait for the new page
        tickRef.current = setInterval(() => {
            setProgress(p => (p < 85 ? p + Math.max(0.5, (85 - p) * 0.08) : p))
        }, 180)
        failSafeRef.current = setTimeout(finish, 12000)
    }, [finish])

    // Route landed — complete the bar.
    useEffect(() => { finish() }, [pathname, finish])

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            const a = (e.target as Element | null)?.closest?.("a")
            if (!a) return
            const href = a.getAttribute("href") || ""
            if (!href || href.startsWith("#")) return
            if (a.target && a.target !== "_self") return
            if (a.hasAttribute("download")) return
            let url: URL
            try { url = new URL(a.href, location.href) } catch { return }
            if (url.origin !== location.origin) return
            const norm = (p: string) => p.replace(/\/+$/, "") || "/"
            if (norm(url.pathname) === norm(location.pathname)) return
            start()
        }
        const onProgrammatic = () => start()

        document.addEventListener("click", onClick, true)
        window.addEventListener("docket:navstart", onProgrammatic)
        return () => {
            document.removeEventListener("click", onClick, true)
            window.removeEventListener("docket:navstart", onProgrammatic)
            stopTimers()
        }
    }, [start])

    if (!visible) return null

    return (
        <div aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, height: 3, pointerEvents: "none" }}>
            <div
                style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#5E7A5B,#B5663F 60%,#fb923c 92%,#fde047)",
                    boxShadow: "0 0 10px rgba(251,146,60,.55)",
                    transition: "width .18s ease",
                }}
            />
            {/* Anime fireball riding the leading edge */}
            <div className="np-fire" style={{ left: `${progress}%`, transition: "left .18s ease" }}>
                <div className="np-trail" />
                <div className="np-core" />
                <div className="np-flame outer" />
                <div className="np-flame inner" />
                <span className="np-spark" style={{ ["--dy" as string]: "-9px" }} />
                <span className="np-spark s2" style={{ ["--dy" as string]: "7px" }} />
                <span className="np-spark s3" style={{ ["--dy" as string]: "-3px" }} />
            </div>
        </div>
    )
}
