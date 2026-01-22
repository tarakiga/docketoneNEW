"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { useState } from "react"
import { toast } from "sonner"

export default function BugReportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success("Report submitted! Thanks for helping us squash bugs.")
        setIsSubmitting(false)
    }

    return (
        <main className="flex-1 bg-background relative">
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/5 via-background to-background" />
            
            <div className="container py-16 md:py-24 max-w-2xl mx-auto">
                <div className="glass-card p-8 rounded-xl border-white/10 shadow-2xl">
                    <header className="mb-8 text-center">
                        <TypographyH1 className="text-gradient mb-2">Report a Bug</TypographyH1>
                        <TypographyP className="text-muted-foreground">
                            Found something broken? We appreciate you letting us know so we can fix it ASAP.
                        </TypographyP>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Name (Optional)</label>
                                <Input placeholder="John Doe" className="bg-background/50 border-input/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address (Optional)</label>
                                <Input type="email" placeholder="In case we need more info" className="bg-background/50 border-input/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Where did you find the bug?</label>
                            <Input placeholder="e.g. Caffeine Calculator, Homepage, Footer" required className="bg-background/50 border-input/50" />
                        </div>

                         <div className="space-y-2">
                            <label className="text-sm font-medium">Browser / Device</label>
                            <Select>
                                <SelectTrigger className="bg-background/50 border-input/50">
                                    <SelectValue placeholder="What are you using?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chrome">Chrome (Desktop)</SelectItem>
                                    <SelectItem value="safari">Safari (Desktop)</SelectItem>
                                    <SelectItem value="firefox">Firefox</SelectItem>
                                    <SelectItem value="mobile-ios">iPhone / iOS</SelectItem>
                                    <SelectItem value="mobile-android">Android</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea 
                                placeholder="What happened? What did you expect to happen? Steps to reproduce?" 
                                required 
                                className="bg-background/50 border-input/50 min-h-[150px]" 
                            />
                        </div>

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-6" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "🐛 Submit Report"}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    )
}
