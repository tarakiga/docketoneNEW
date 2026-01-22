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
import { Calculator, Menu } from "lucide-react"
import Link from "next/link"

export function NavBar() {
  const categories = [
    "BigKidMath", "CipherLab", "GeekGalaxy", "LifeHacks", "Math_Magik", "Otaku_Ops"
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
                <DropdownMenuItem key={cat} asChild className="focus:bg-white/10 cursor-pointer">
                  <Link href={`/calculators/${cat}`}>
                    {cat.replace(/_/g, ' ')}
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-card w-[300px] border-l border-white/20">
              <SheetTitle className="text-left mb-4">Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-4">
                 <Link href="/" className="text-lg font-medium hover:text-primary">Home</Link>
                 
                 <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Categories</div>
                    <div className="pl-4 flex flex-col gap-3 border-l border-white/10">
                        {categories.map(cat => (
                          <Link key={cat} href={`/calculators/${cat}`} className="text-base text-muted-foreground hover:text-foreground transition-colors">
                            {cat.replace(/_/g, ' ')}
                          </Link>
                        ))}
                    </div>
                 </div>

                 <Link href="https://blog.docket.one" className="text-lg font-medium hover:text-primary">Blog</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
