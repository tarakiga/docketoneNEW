"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            const response = await fetch("/api/mail-relay.php?type=contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast.success("Message sent! We'll get back to you soon.")
                setFormData({ name: "", email: "", message: "" })
            } else {
                toast.error("Failed to send message. Please try again.")
            }
        } catch (error) {
            toast.error("Portal communication error.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex-1 bg-background relative">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background" />
            <div className="container py-24 px-4 md:px-6 max-w-2xl mx-auto flex-1 h-full">
                <div className="glass-card p-8 rounded-xl border-white/20 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <h1 className="text-3xl font-bold mb-2 text-gradient">Contact Us</h1>
                    <p className="text-muted-foreground mb-6">Have a calculator idea or found a bug? Let us know.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input 
                                    placeholder="John Doe" 
                                    required 
                                    className="bg-background/50 border-input/50" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input 
                                    placeholder="john@example.com" 
                                    type="email" 
                                    required 
                                    className="bg-background/50 border-input/50" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea 
                                placeholder="How can we help?" 
                                required 
                                className="bg-background/50 border-input/50 min-h-[150px]" 
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    )
}
