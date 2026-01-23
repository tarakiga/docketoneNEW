"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { useState } from "react"
import { toast } from "sonner"

export default function RequestCalculatorPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        setIsSubmitting(true)
        
        try {
            const response = await fetch("/api/mail-relay.php?type=request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast.success("Request sent! We'll review your awesome idea.")
                setFormData({ name: "", email: "", type: "new", title: "", description: "", priority: "medium" })
            } else {
                toast.error("Failed to send request. Please try again.")
            }
        } catch (error) {
            toast.error("Portal malfunction.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex-1 bg-background relative">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-background to-background" />
            
            <div className="container py-16 md:py-24 max-w-2xl mx-auto">
                <div className="glass-card p-8 rounded-xl border-white/10 shadow-2xl">
                    <header className="mb-8 text-center">
                        <TypographyH1 className="text-gradient mb-2">Request a Calculator</TypographyH1>
                        <TypographyP className="text-muted-foreground">
                            Got an idea for a tool that would make life easier or more fun? We want to hear it!
                        </TypographyP>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Name</label>
                                <Input 
                                    placeholder="What should we call you?" 
                                    required 
                                    className="bg-background/50 border-input/50" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input 
                                    type="email" 
                                    placeholder="your@email.com" 
                                    required 
                                    className="bg-background/50 border-input/50" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Request Type</label>
                            <Select onValueChange={(v) => setFormData({ ...formData, type: v })} value={formData.type}>
                                <SelectTrigger className="bg-background/50 border-input/50">
                                    <SelectValue placeholder="Choose type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">Brand New Calculator</SelectItem>
                                    <SelectItem value="enhancement">Improve Existing One</SelectItem>
                                    <SelectItem value="category">New Category Idea</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Calculator Title</label>
                            <Input 
                                placeholder="e.g. 'Pizza vs Ramen Budget Optimizer'" 
                                required 
                                className="bg-background/50 border-input/50" 
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tell Us About Your Idea</label>
                            <Textarea 
                                placeholder="Describe your idea! What are the inputs? What's the output? get creative!" 
                                required 
                                className="bg-background/50 border-input/50 min-h-[150px]" 
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority Level</label>
                            <Select onValueChange={(v) => setFormData({ ...formData, priority: v })} value={formData.priority}>
                                <SelectTrigger className="bg-background/50 border-input/50">
                                    <SelectValue placeholder="How much do you want this?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Would be nice to have</SelectItem>
                                    <SelectItem value="medium">Really want this!</SelectItem>
                                    <SelectItem value="high">NEED this in my life!</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-6" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "🚀 Send My Idea"}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    )
}
