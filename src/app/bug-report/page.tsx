"use client"
import { FormStatusModal, type FormStatus } from "@/components/molecules/form-status-modal"
import Link from "next/link"
import { useState } from "react"

export default function BugReportPage() {
    const [status, setStatus] = useState<FormStatus>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        location: "",
        browser: "",
        description: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")
        try {
            const response = await fetch("/api/mail-relay.php?type=bug", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                setStatus("success")
                setFormData({ name: "", email: "", location: "", browser: "", description: "" })
            } else {
                setStatus("error")
            }
        } catch {
            setStatus("error")
        }
    }

    return (
        <div className="almanac">
            <div className="almanac-page">
                <div className="almanac-top">
                    <Link className="almanac-back" href="/">← home</Link>
                    <span>Docket One</span>
                </div>

                <header className="almanac-masthead">
                    <div className="almanac-eyebrow">Report a bug</div>
                    <h1 className="almanac-h1 sm">Report a Bug</h1>
                    <p className="almanac-sub">
                        Found something broken? We appreciate you letting us know so we can fix it ASAP.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="almanac-form">
                    <div className="almanac-row">
                        <div className="almanac-field">
                            <label className="almanac-label">Your Name (Optional)</label>
                            <input
                                className="almanac-input"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="almanac-field">
                            <label className="almanac-label">Email Address (Optional)</label>
                            <input
                                className="almanac-input"
                                type="email"
                                placeholder="In case we need more info"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Where did you find the bug?</label>
                        <input
                            className="almanac-input"
                            placeholder="e.g. Caffeine Calculator, Homepage, Footer"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Browser / Device</label>
                        <select
                            className="almanac-input"
                            value={formData.browser}
                            onChange={(e) => setFormData({ ...formData, browser: e.target.value })}
                        >
                            <option value="" disabled>What are you using?</option>
                            <option value="chrome">Chrome (Desktop)</option>
                            <option value="safari">Safari (Desktop)</option>
                            <option value="firefox">Firefox</option>
                            <option value="mobile-ios">iPhone / iOS</option>
                            <option value="mobile-android">Android</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Description</label>
                        <textarea
                            className="almanac-textarea"
                            placeholder="What happened? What did you expect to happen? Steps to reproduce?"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="almanac-btn" disabled={status === "submitting"}>
                        {status === "submitting" ? "Sending..." : "🐛 Submit Report"}
                    </button>
                </form>

                <div className="almanac-foot">
                    <span>© 2026 Docket One</span>
                    <Link href="/">Home →</Link>
                </div>

                <FormStatusModal
                    status={status}
                    onClose={() => setStatus(null)}
                    successTitle="Report submitted"
                    successMessage="Thanks for helping us squash bugs! We'll take a look."
                    errorMessage="We couldn't deliver your report just now. Please try again in a moment."
                />
            </div>
        </div>
    )
}
