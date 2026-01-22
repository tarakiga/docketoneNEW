"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"

export function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check local storage
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setOpen(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass-card sm:max-w-md border-0 fixed bottom-4 right-4 translate-y-0 translate-x-0 top-auto left-auto animate-in slide-in-from-bottom-5 duration-500 rounded-2xl shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Privacy Choices</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We use cookies to enhance your calculation experience. 
            No tracking of sensitive data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button type="button" variant="secondary" className="flex-1" onClick={handleDecline}>
              Essential Only
            </Button>
            <Button type="button" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAccept}>
              Accept All
            </Button>
          </div>
          <Button variant="link" className="text-xs h-auto p-0 text-muted-foreground" onClick={() => window.open('/privacy', '_blank')}>
            View Privacy Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
