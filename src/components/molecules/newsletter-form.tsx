"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Send } from "lucide-react"

interface NewsletterFormProps {
  className?: string
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  return (
    <div className={cn("glass-card p-6 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all duration-500", className)}>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors animate-pulse"></div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2 tracking-tight">Stay Calculated</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Join our premium newsletter for the latest tools and life hacks.
        </p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); /* Handle submit later */ }}>
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="bg-background/50 border-white/10 focus-visible:ring-primary backdrop-blur-sm"
          />
          <Button type="submit" size="icon" className="shrink-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Send className="w-4 h-4" />
            <span className="sr-only">Subscribe</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
