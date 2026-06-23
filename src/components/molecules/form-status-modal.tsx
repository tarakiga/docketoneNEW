"use client"

import { useEffect } from "react"

export type FormStatus = "submitting" | "success" | "error" | null

interface FormStatusModalProps {
  status: FormStatus
  onClose: () => void
  submittingTitle?: string
  submittingMessage?: string
  successTitle?: string
  successMessage?: string
  errorTitle?: string
  errorMessage?: string
}

export function FormStatusModal({
  status,
  onClose,
  submittingTitle = "Sending…",
  submittingMessage = "Just a moment while we deliver your message.",
  successTitle = "Message sent",
  successMessage = "Thanks! We'll get back to you soon.",
  errorTitle = "Something went wrong",
  errorMessage = "We couldn't send that just now. Please try again in a moment.",
}: FormStatusModalProps) {
  const dismissible = status !== null && status !== "submitting"

  useEffect(() => {
    if (!dismissible) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [dismissible, onClose])

  if (!status) return null

  const title = status === "submitting" ? submittingTitle : status === "success" ? successTitle : errorTitle
  const message = status === "submitting" ? submittingMessage : status === "success" ? successMessage : errorMessage

  return (
    <div className="fsm-overlay" role="dialog" aria-modal="true" aria-live="assertive" onClick={() => dismissible && onClose()}>
      <div className="fsm-card" onClick={(e) => e.stopPropagation()}>
        {status === "submitting" && <div className="fsm-icon load"><span className="fsm-spinner" /></div>}
        {status === "success" && <div className="fsm-icon ok">✓</div>}
        {status === "error" && <div className="fsm-icon err">✕</div>}
        <div className="fsm-title">{title}</div>
        <p className="fsm-msg">{message}</p>
        {dismissible && (
          <button className="fsm-btn" onClick={onClose} autoFocus>
            {status === "error" ? "Try again" : "Done"}
          </button>
        )}
      </div>
    </div>
  )
}
