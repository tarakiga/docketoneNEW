"use client"

import { useEffect, useState } from "react"

export function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [why, setWhy] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => setOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", value)
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }))
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed z-50 bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500 motion-reduce:animate-none"
      style={{ fontFamily: "var(--font-space-mono), monospace" }}
    >
      <div style={{ background: "var(--dk-sunk)", border: "3px solid var(--dk-tea-ink)", boxShadow: "6px 6px 0 var(--dk-shadow)", borderRadius: 4 }}>
        <div className="p-5">
          <div
            className="flex items-center gap-2 mb-2"
            style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 11, color: "var(--dk-tea-ink)", letterSpacing: ".04em" }}
          >
            <span aria-hidden>🍪</span> COOKIES - YOUR CALL
          </div>

          <h2 className="mb-2" style={{ fontFamily: "var(--font-fredoka), cursive", color: "var(--dk-yel-ink)", fontSize: 18, lineHeight: 1.1 }}>
            No account. No catch.
          </h2>

          <p style={{ color: "#cfc9e6", fontSize: 13, lineHeight: 1.55 }}>
            Docket One has no sign-ups and never will. Cookies here are{" "}
            <b style={{ color: "#fff" }}>completely optional</b> - they only let us show ads (which keep every calculator
            free) and count which tools people find useful. Choose{" "}
            <b style={{ color: "#fff" }}>Essential only</b> and the whole site still works - nothing gets locked.
          </p>

          {why && (
            <ul style={{ color: "var(--dk-ink-soft)", fontSize: 12, lineHeight: 1.55, marginTop: 10, paddingLeft: 16, listStyle: "square" }}>
              <li>
                <b style={{ color: "var(--dk-ink)" }}>Essential</b> - just remembers this choice. Always on, no tracking.
              </li>
              <li>
                <b style={{ color: "var(--dk-ink)" }}>Ads</b> - Google AdSense, so the calculators stay free to use.
              </li>
              <li>
                <b style={{ color: "var(--dk-ink)" }}>Analytics</b> - anonymous counts of which tools are popular.
              </li>
            </ul>
          )}

          <button
            type="button"
            onClick={() => setWhy((v) => !v)}
            style={{ color: "var(--dk-tea-ink)", fontSize: 12, marginTop: 8, textDecoration: "underline", textUnderlineOffset: 3, background: "none", border: 0, cursor: "pointer", padding: 0 }}
          >
            {why ? "Hide the details" : "What exactly do they do?"}
          </button>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => choose("declined")}
              className="flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dk-lim-ink)]"
              style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 10, padding: "12px 8px", background: "var(--dk-raised)", color: "var(--dk-ink)", border: "2px solid var(--dk-line)", borderRadius: 0, cursor: "pointer", textTransform: "uppercase" }}
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dk-line)]"
              style={{ fontFamily: "var(--font-space-mono), monospace", fontSize: 10, padding: "12px 8px", background: "var(--dk-lim)", color: "var(--dk-on-fill)", border: "2px solid #fff", borderRadius: 0, cursor: "pointer", textTransform: "uppercase" }}
            >
              Accept all
            </button>
          </div>

          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: 12, color: "var(--dk-ink-soft)", fontSize: 11, textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Read the privacy policy →
          </a>
        </div>
      </div>
    </div>
  )
}
