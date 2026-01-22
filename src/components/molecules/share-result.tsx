import { PremiumShareModal } from "@/components/organisms/premium-share-modal"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useState } from "react"

interface ShareResultProps {
    title: string
    text: string // Used as description in modal
    url?: string
    className?: string
    resultValue?: string // Optional specific result string for the card
}

export function ShareResult({ title, text, url, className, resultValue }: ShareResultProps) {
    const [isOpen, setIsOpen] = useState(false)
    
    // Extract result from text if resultValue not provided (simple heuristic or passed prop)
    const displayResult = resultValue || text.split('.')[0] 

    return (
        <>
            <Button 
                onClick={() => setIsOpen(true)} 
                variant="outline" 
                className={`gap-2 w-full sm:w-auto bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary ${className}`}
            >
                <Share2 className="w-4 h-4" />
                Share Result
            </Button>

            <PremiumShareModal 
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title={title}
                result={displayResult}
                description={text}
                url={url}
            />
        </>
    )
}
