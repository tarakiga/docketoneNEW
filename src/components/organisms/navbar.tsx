"use client"

import { Search } from "@/components/molecules/search"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Binary, Calculator, Gamepad2, GraduationCap, Home, Lightbulb, Menu, Newspaper, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function NavBar() {
  const [open, setOpen] = useState(false)
  const categories = [
    { name: "bigkidmath", label: "Big Kid Math", icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "cipherlab", label: "Cipher Lab", icon: Binary, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "geekgalaxy", label: "Geek Galaxy", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "lifehacks", label: "Life Hacks", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "mathmagik", label: "Math Magik", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "otakuops", label: "Otaku Ops", icon: Gamepad2, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 shrink-0">
          <Calculator className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 hidden md:inline-block">
            Docket One
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0">
                Categories
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="glass-card border-white/20">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.name} asChild className="focus:bg-white/10 cursor-pointer">
                  <Link href={`/calculators/${cat.name}`}>
                    {cat.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="https://blog.docket.one" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Search />
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-l border-white/10 overflow-hidden">
               {/* Premium Backdrop Background */}
               <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl -z-10" />
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 -z-10" />
               
               <div className="flex flex-col h-full p-8 pt-12">
                  <SheetTitle className="text-left mb-8 flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-xl border border-primary/20">
                      <Calculator className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                      Docket One
                    </span>
                  </SheetTitle>

                  <div className="flex flex-col gap-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 font-mono">Navigation</div>
                        <Link 
                           href="/" 
                           onClick={() => setOpen(false)}
                           className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                        >
                           <Home className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                           <span className="font-bold text-slate-200">Dashboard Home</span>
                        </Link>
                        <Link 
                           href="https://blog.docket.one" 
                           onClick={() => setOpen(false)}
                           className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                        >
                           <Newspaper className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
                           <span className="font-bold text-slate-200">The Calculator Blog</span>
                        </Link>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-mono">Categories</div>
                        <div className="grid gap-3">
                            {categories.map(cat => (
                              <Link 
                                key={cat.name} 
                                href={`/calculators/${cat.name}`} 
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                              >
                                <div className={`p-2.5 rounded-xl ${cat.bg} border border-white/5 transition-transform group-active:scale-90`}>
                                   <cat.icon className={`h-5 w-5 ${cat.color}`} />
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-sm font-bold text-slate-200">{cat.label}</span>
                                   <span className="text-[9px] text-slate-500 font-medium font-mono uppercase tracking-wider">Explore Modules</span>
                                </div>
                              </Link>
                            ))}
                        </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 mt-auto">
                     <p className="text-[10px] text-slate-500 font-medium text-center italic">
                        Built for precision. Crafted for curiosity.
                     </p>
                  </div>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
