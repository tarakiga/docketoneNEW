"use client"
import { FormStatusModal, type FormStatus } from "@/components/molecules/form-status-modal"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
    const [status, setStatus] = useState<FormStatus>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")
        try {
            const response = await fetch("/api/mail-relay.php?type=contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                setStatus("success")
                setFormData({ name: "", email: "", message: "" })
            } else {
                setStatus("error")
            }
        } catch {
            setStatus("error")
        }
    }

    return (
        <div className="almanac"><div className="almanac-page">
            <div className="almanac-top"><Link className="almanac-back" href="/">← home</Link><span>Docket One</span></div>
            <header className="almanac-masthead"><div className="almanac-eyebrow">Get in touch</div><h1 className="almanac-h1 sm">Contact Us</h1><p className="almanac-sub">Have a calculator idea or found a bug? Let us know.</p></header>
            <form onSubmit={handleSubmit} className="almanac-form">
                <div className="almanac-row">
                    <div className="almanac-field">
                        <label className="almanac-label">Name</label>
                        <input
                            className="almanac-input"
                            placeholder="John Doe"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="almanac-field">
                        <label className="almanac-label">Email</label>
                        <input
                            className="almanac-input"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <div className="almanac-field">
                    <label className="almanac-label">Message</label>
                    <textarea
                        className="almanac-textarea"
                        placeholder="How can we help?"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>
                <button type="submit" className="almanac-btn" disabled={status === "submitting"}>
                    {status === "submitting" ? "Sending..." : "Send message"}
                </button>
            </form>
            <div className="almanac-foot"><span>© 2026 Docket One</span><Link href="/">Home →</Link></div>

            <FormStatusModal
                status={status}
                onClose={() => setStatus(null)}
                successTitle="Message sent"
                successMessage="Thanks for reaching out! We'll get back to you soon."
                errorMessage="We couldn't send your message just now. Please try again in a moment."
            />
        </div></div>
    )
}
