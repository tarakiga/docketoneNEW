"use client"

import { useState, type ReactNode } from "react"

export function BoringDrawer({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="home-cabinet">
            <div className="home-drawer">
                <span className="home-tab">Filed under: utilities</span>
                <div className="home-face">
                    <div className="home-handle"><div className="home-handle-bar" /></div>
                    <div className="home-dl">
                        <div className="home-dl-f">Drawer 07 · regular calculators</div>
                        <div className="home-dl-nm">Universal Calculator <span>🥱</span></div>
                    </div>
                    <button type="button" className="home-pull" aria-expanded={open} onClick={() => setOpen(o => !o)}>
                        {open ? "Close ✕" : "Pull it open ⟶"}
                    </button>
                </div>
                <div className={`home-reveal ${open ? "on" : ""}`}>
                    <div className="home-conv">{children}</div>
                </div>
            </div>
        </div>
    )
}
