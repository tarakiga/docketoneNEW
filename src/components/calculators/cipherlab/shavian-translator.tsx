"use client"

import { ShareResult } from "@/components/molecules/share-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useMemo, useState } from "react"

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
    const shavian = useMemo(() => {
        const input = text.toLowerCase()
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
                result += input[i]
                i++
            }
        }

        return result
    }, [text])

    return (
        <div
            className="almanac grid lg:grid-cols-2 gap-8"
            style={{
                ['--card' as string]: 'var(--dk-surface)',
                ['--ink' as string]: 'var(--dk-ink)',
                ['--ink-soft' as string]: 'var(--dk-ink-soft)',
                ['--accent' as string]: '#b388ff',
                ['--line' as string]: 'var(--dk-line)',
            }}
        >
            <div className="space-y-6">
                <Card
                    className="glass-card"
                    style={{ background: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}
                >
                    <CardHeader>
                        <CardTitle style={{ color: 'var(--dk-ink)' }}>English Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Type English..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[150px] text-lg focus-visible:ring-[#b388ff]"
                            style={{ background: 'var(--dk-sunk)', borderColor: 'var(--dk-line)', color: 'var(--dk-ink)' }}
                        />
                         <p className="mt-2 text-xs" style={{ color: 'var(--dk-ink-soft)' }}>
                            Try words like &quot;the&quot;, &quot;and&quot;, &quot;church&quot;, &quot;measure&quot;, &quot;enough&quot;.
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="glass-card"
                    style={{ background: 'var(--dk-raised)', borderColor: 'var(--dk-line)' }}
                >
                     <CardContent className="pt-6">
                        <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#b388ff' }}>
                             🇬🇧 George Bernard Shaw&apos;s Dream
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--dk-ink-soft)' }}>
                            A constructed phonetic alphabet designed to replace the complex spelling of English.
                            Funded by the will of playwright George Bernard Shaw. It is phonetic, meaning one symbol = one sound.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                 <Card
                    className="glass-card h-full flex flex-col"
                    style={{ background: 'var(--dk-surface)', borderColor: 'var(--dk-line)' }}
                 >
                    <CardHeader>
                        <CardTitle style={{ color: 'var(--dk-ink)' }}>Shavian Output</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div
                            className="p-8 rounded-xl min-h-[300px] flex items-center justify-center text-center"
                            style={{ background: 'var(--dk-sunk)', border: '1px solid var(--dk-line)' }}
                        >
                            {shavian ? (
                                <p className="text-4xl leading-relaxed font-serif" style={{ color: '#b388ff' }}>
                                    {shavian}
                                </p>
                            ) : (
                                <p className="italic" style={{ color: 'var(--dk-ink-soft)' }}>Translation will appear here...</p>
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
