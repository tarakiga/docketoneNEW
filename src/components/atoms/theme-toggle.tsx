"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("dark")

    useEffect(() => {
        const current = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "dark"
        setTheme(current)
    }, [])

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark"
        setTheme(next)
        document.documentElement.setAttribute("data-theme", next)
        try {
            localStorage.setItem("theme", next)
        } catch {
            /* private mode — ignore */
        }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            className="almanac-themetoggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>
    )
}
