"use client"
import { FormStatusModal, type FormStatus } from "@/components/molecules/form-status-modal"
import Link from "next/link"
import { useState } from "react"

export default function RequestCalculatorPage() {
    const [status, setStatus] = useState<FormStatus>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "new",
        title: "",
        description: "",
        priority: "medium"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")
        try {
            const response = await fetch("/api/mail-relay.php?type=request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (response.ok) {
                setStatus("success")
                setFormData({ name: "", email: "", type: "new", title: "", description: "", priority: "medium" })
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
                    <div className="almanac-eyebrow">Request a calculator</div>
                    <h1 className="almanac-h1 sm">Request a Calculator</h1>
                    <p className="almanac-sub">
                        Got an idea for a tool that would make life easier or more fun? We want to hear it!
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="almanac-form">
                    <div className="almanac-row">
                        <div className="almanac-field">
                            <label className="almanac-label">Your Name</label>
                            <input
                                className="almanac-input"
                                placeholder="What should we call you?"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="almanac-field">
                            <label className="almanac-label">Email Address</label>
                            <input
                                className="almanac-input"
                                type="email"
                                placeholder="your@email.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Request Type</label>
                        <select
                            className="almanac-select"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="new">Brand New Calculator</option>
                            <option value="enhancement">Improve Existing One</option>
                            <option value="category">New Category Idea</option>
                        </select>
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Calculator Title</label>
                        <input
                            className="almanac-input"
                            placeholder="e.g. 'Pizza vs Ramen Budget Optimizer'"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Tell Us About Your Idea</label>
                        <textarea
                            className="almanac-textarea"
                            placeholder="Describe your idea! What are the inputs? What's the output? get creative!"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="almanac-field">
                        <label className="almanac-label">Priority Level</label>
                        <select
                            className="almanac-select"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Would be nice to have</option>
                            <option value="medium">Really want this!</option>
                            <option value="high">NEED this in my life!</option>
                        </select>
                    </div>

                    <button type="submit" className="almanac-btn" disabled={status === "submitting"}>
                        {status === "submitting" ? "Sending..." : "🚀 Send My Idea"}
                    </button>
                </form>

                <div className="almanac-foot">
                    <span>© 2026 Docket One</span>
                    <Link href="/">Home →</Link>
                </div>

                <FormStatusModal
                    status={status}
                    onClose={() => setStatus(null)}
                    successTitle="Idea received"
                    successMessage="Thanks! We'll review your awesome idea and see what we can build."
                    errorMessage="We couldn't send your request just now. Please try again in a moment."
                />
            </div>
        </div>
    )
}
