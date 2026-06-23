"use client"

import { ChevronsUpDown, Search as SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { calculators } from "@/data/calculators"

export function Search() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Search calculators"
          className="w-9 px-0 justify-center sm:w-[180px] sm:px-4 sm:justify-between lg:w-[300px] text-muted-foreground bg-background/50 border-input/50 hover:bg-accent/50"
        >
          <span className="flex items-center gap-2 truncate">
            <SearchIcon className="h-4 w-4 opacity-50 shrink-0" />
            <span className="hidden sm:inline truncate">
              {value
                ? calculators.find((calc) => calc.title === value)?.title
                : "Search calculators..."}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden sm:block" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] lg:w-[300px] p-0 glass-card">
        <Command>
          <CommandInput placeholder="Search tools..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {calculators.map((calc) => (
                <CommandItem
                  key={calc.id}
                  value={`${calc.title} ${calc.tags?.join(" ")}`}
                  onSelect={() => {
                    setValue(calc.title)
                    setOpen(false)
                    router.push(`/calculators/${calc.category}/${calc.slug}`)
                  }}
                >
                  <span className="mr-2">{calc.icon}</span>
                  {calc.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
