"use client"

import { ThemeToggle } from "@/components/atoms/theme-toggle"
import { Search } from "@/components/molecules/search"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CATEGORY_META } from "@/data/calculators"
import { Calculator, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function NavBar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="almanac-nav">
            <div className="almanac-nav-inner">
                <Link href="/" className="almanac-brand">
                    <Calculator className="h-5 w-5" style={{ color: "var(--accent)" }} />
                    Docket One
                </Link>

                {/* Desktop nav */}
                <div className="almanac-navlinks" style={{ marginLeft: "auto", marginRight: 8 }}>
                    <Link href="/" className="almanac-navlink hidden md:inline-flex">Home</Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="almanac-navlink hidden md:inline-flex">Categories</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="almanac-navmenu">
                            {CATEGORY_META.map((cat) => (
                                <DropdownMenuItem key={cat.id} asChild className="almanac-navmenu-item cursor-pointer">
                                    <Link href={`/calculators/${cat.id}/`}>
                                        <span style={{ marginRight: 8 }}>{cat.emoji}</span>{cat.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="https://blog.docket.one" className="almanac-navlink hidden md:inline-flex">Blog</Link>
                </div>

                <div className="flex items-center gap-3">
                    <Search />
                    <ThemeToggle />

                    {/* Mobile menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <button className="almanac-navlink md:hidden" aria-label="Open menu" style={{ padding: 8 }}>
                                <Menu className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="almanac-sheet p-0 overflow-y-auto">
                            <div className="flex flex-col h-full p-8 pt-12">
                                <SheetTitle asChild>
                                    <span className="almanac-sheet-brand" style={{ marginBottom: 28 }}>
                                        <Calculator className="h-6 w-6" style={{ color: "var(--accent)" }} />
                                        Docket One
                                    </span>
                                </SheetTitle>

                                <div className="flex flex-col gap-7 flex-1">
                                    <div className="flex flex-col gap-3">
                                        <div className="almanac-sheet-label" style={{ marginBottom: 4 }}>Navigation</div>
                                        <Link href="/" onClick={() => setOpen(false)} className="almanac-sheet-item">
                                            <span className="ic">🏠</span><span className="t">Home</span>
                                        </Link>
                                        <Link href="https://blog.docket.one" onClick={() => setOpen(false)} className="almanac-sheet-item">
                                            <span className="ic">📰</span><span className="t">The Calculator Blog</span>
                                        </Link>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="almanac-sheet-label" style={{ marginBottom: 4 }}>Collections</div>
                                        {CATEGORY_META.map(cat => (
                                            <Link key={cat.id} href={`/calculators/${cat.id}/`} onClick={() => setOpen(false)} className="almanac-sheet-item">
                                                <span className="ic">{cat.emoji}</span>
                                                <span className="t">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
