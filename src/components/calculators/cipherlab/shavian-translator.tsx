"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"

// Shavian mapping sorted by length for greedy match
const SHAVIAN_MAP: Record<string, string> = {
    'church': '𐑗𐑻𐑗', 'measure': '𐑥𐑧𐑠𐑼', 'enough': '𐑦𐑯𐑳𐑓',
    'the': '𐑞', 'and': '𐑯', 'for': '𐑓', 'are': '𐑸', 'you': '𐑿',
    'ch': '𐑗', 'sh': '𐑖', 'th': '𐑔', 'dh': '𐑞', 'ng': '𐑙',
    'p': '𐑐', 'b': '𐑚', 't': '𐑑', 'd': '𐑛', 'k': '𐑒', 'g': '𐑜',
    'f': '𐑓', 'v': '𐑝', 's': '𐑕', 'z': '𐑟', 'h': '𐑣', 'j': '𐑡',
    'l': '𐑤', 'r': '𐑮', 'm': '𐑥', 'n': '𐑯', 'w': '𐑢', 'y': '𐑘',
    'a': '𐑨', 'e': '𐑧', 'i': '𐑦', 'o': '𐑪', 'u': '𐑳',
    'aa': '𐑸', 'ee': '𐑰', 'ie': '𐑲', 'ou': '𐑬', 'oi': '𐑶',
    'air': '𐑺', 'ear': '𐑽', 'our': '𐑻', 'or': '𐑹', 
    'er': '𐑼', 'ur': '𐑻', 'oo': '𐑵', 'eau': '𐑴'
}

const SORTED_KEYS = Object.keys(SHAVIAN_MAP).sort((a, b) => b.length - a.length)

export function ShavianTranslator() {
    const [text, setText] = useState("Hello world")
    const [shavian, setShavian] = useState("")

    useEffect(() => {
        let input = text.toLowerCase()
        let result = ""
        let i = 0
        
        while (i < input.length) {
            let foundMatch = false
            for (const key of SORTED_KEYS) {
                if (input.substring(i, i + key.length) === key) {
                    result += SHAVIAN_MAP[key]
                    i += key.length
                    foundMatch = true
                    break
                }
            }
            if (!foundMatch) {
                result += input[i] // Append unknown char as is
                i++
            }
        }
        
        setShavian(result)
    }, [text])

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>English Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Type English..." 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg"
                        />
                         <p className="mt-2 text-xs text-muted-foreground">
                            Try words like "the", "and", "church", "measure", "enough".
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-card bg-orange-500/5 border-orange-500/20">
                     <CardContent className="pt-6">
                        <h4 className="font-bold text-orange-500 mb-2 flex items-center gap-2">
                             🇬🇧 George Bernard Shaw's Dream
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            A constructed phonetic alphabet designed to replace the complex spelling of English. 
                            Funded by the will of playwright George Bernard Shaw. It is phonetic, meaning one symbol = one sound.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card className="glass-card h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Shavian Output</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="p-8 bg-orange-50 dark:bg-stone-900/50 rounded-xl border border-orange-200 dark:border-orange-900/30 min-h-[300px] flex items-center justify-center text-center">
                            {shavian ? (
                                <p className="text-4xl leading-relaxed text-orange-700 dark:text-orange-300 font-serif">
                                    {shavian}
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">Translation will appear here...</p>
                            )}
                        </div>
                    </CardContent>
                     <div className="p-6 pt-0">
                         <ShareResult 
                            title="Shavian Alphabet 📜"
                            text={`I translated into Shavian: "${shavian}"`}
                            className="w-full"
                        />
                    </div>
                </Card>
            </div>
        </div>
    )
}
