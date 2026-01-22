import { cn } from "@/lib/utils"
import React from "react"

export function TypographyH1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-sans", className)} {...props}>
      {children}
    </h1>
  )
}

export function TypographyH2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 font-sans", className)} {...props}>
      {children}
    </h2>
  )
}

export function TypographyH3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight font-sans", className)} {...props}>
      {children}
    </h3>
  )
}

export function TypographyH4({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight font-sans", className)} {...props}>
      {children}
    </h4>
  )
}

export function TypographyP({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6 font-sans", className)} {...props}>
      {children}
    </p>
  )
}

export function TypographyLead({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xl text-muted-foreground font-sans", className)} {...props}>
      {children}
    </p>
  )
}

export function TypographyLarge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-lg font-semibold font-sans", className)} {...props}>
      {children}
    </div>
  )
}

export function TypographySmall({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <small className={cn("text-sm font-medium leading-none font-sans", className)} {...props}>
      {children}
    </small>
  )
}

export function TypographyMuted({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground font-sans", className)} {...props}>
      {children}
    </p>
  )
}
