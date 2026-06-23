import { VerdictShareModal } from "@/components/organisms/verdict-share-modal"
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
    
    // Extract result from text if resultValue not provided
    // Split by period followed by space to avoid breaking at decimal points (e.g., 1.5x)
    const displayResult = resultValue || (text.includes('. ') ? text.split('. ')[0] + '.' : text); 

    return (
        <>
            <Button 
                onClick={() => setIsOpen(true)} 
                variant="outline"
                className={`gap-2 w-full sm:w-auto bg-[#241a52] hover:bg-[#2f2466] border border-[#4a3f7a] text-[#ECEAE3] ${className}`}
            >
                <Share2 className="w-4 h-4" />
                Share Result
            </Button>

            <VerdictShareModal 
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
