"use client"

import { FormStatusModal, type FormStatus } from "@/components/molecules/form-status-modal"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface NewsletterFormProps {
  className?: string
  dark?: boolean
}

export function NewsletterForm({ className, dark }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<FormStatus>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    try {
      const res = await fetch("/api/mail-relay.php?type=newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "home newsletter" }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className={cn(dark ? "home-news" : "almanac-callout", className)}>
      <h2 style={{ fontFamily: dark ? "var(--font-bungee), cursive" : "var(--font-fraunces), serif", fontWeight: dark ? 400 : 600, fontSize: dark ? 30 : 24, color: dark ? "#ffd23c" : "var(--ink)", marginBottom: 6 }}>
        {dark ? "Join the calculation nation" : "Stay calculated"}
      </h2>
      <p style={{ color: dark ? "#b9b1a3" : "var(--ink-soft)", fontSize: 15, marginBottom: 16 }}>
        New tools and life hacks in your inbox. No spam, just math.
      </p>
      <form
        className="almanac-form"
        style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", ...(dark ? { maxWidth: 460, margin: "0 auto", justifyContent: "center" } : {}) }}
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          required
          placeholder="you@email.com"
          className="almanac-input"
          style={{ flex: "1 1 220px", ...(dark ? { background: "#0c0824", borderColor: "#4a3f7a", color: "#fff" } : {}) }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="almanac-btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      <FormStatusModal
        status={status}
        onClose={() => setStatus(null)}
        submittingTitle="Subscribing…"
        submittingMessage="Adding you to the list."
        successTitle="You're in!"
        successMessage="Thanks for subscribing — we'll send the good stuff, no spam."
        errorMessage="We couldn't subscribe you just now. Please try again in a moment."
      />
    </div>
  )
}
