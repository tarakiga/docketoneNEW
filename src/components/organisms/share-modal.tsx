"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Copy, Facebook, Linkedin, Share2, Twitter } from "lucide-react"
import { useState } from "react"

interface ShareModalProps {
  title: string
  url: string
  description?: string
  image?: string
}

export function ShareModal({ title, url, description, image = "/og-image.jpg" }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card border-white/20">
        <DialogHeader>
          <DialogTitle>Share this calculator</DialogTitle>
          <DialogDescription>
            Share "{title}" with your friends and followers.
          </DialogDescription>
        </DialogHeader>
        
        {/* Preview Card */}
        <div className="rounded-lg border border-white/10 overflow-hidden bg-black/40 mb-4">
           <div className="aspect-video relative bg-muted/50 flex items-center justify-center text-muted-foreground">
               {/* In a real app, this would be the OG Image */}
               <span className="text-sm">Preview Image</span>
               {/* <Image src={image} alt="Preview" fill className="object-cover" /> */}
           </div>
           <div className="p-3">
               <div className="font-semibold text-sm truncate">{title}</div>
               <div className="text-xs text-muted-foreground truncate">{description}</div>
           </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={url}
                readOnly
                className="bg-background/50 border-white/10"
              />
            </div>
            <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-center gap-4">
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2]">
                   <Twitter className="h-5 w-5" />
               </Button>
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#4267B2]/20 hover:text-[#4267B2]">
                   <Facebook className="h-5 w-5" />
               </Button>
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#0077b5]/20 hover:text-[#0077b5]">
                   <Linkedin className="h-5 w-5" />
               </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
