"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function DatePicker({
  date,
  setDate,
  disabled = false,
  className,
  placeholder = "Pick a date"
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-[240px] justify-start text-left font-normal border-input/50 bg-background/50 hover:bg-accent/50 transition-all",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 glass-card" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  )
}
