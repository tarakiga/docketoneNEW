import { cn } from "@/lib/utils"
import React from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null

  const blocks = content.split(/\n\n+/)

  return (
    <div className={cn(className)}>
      {blocks.map((block, index) => {
        const trimmed = block.trim()

        if (trimmed.startsWith("### ")) {
          const lines = trimmed.split("\n")
          const header = lines[0]
          const rest = lines.slice(1).join("\n")
          if (rest.trim().length > 0) {
            return (
              <div key={index}>
                <h3>{processInlineStyles(header.replace(/^### /, ""))}</h3>
                <MarkdownRenderer content={rest} />
              </div>
            )
          }
          return <h3 key={index}>{processInlineStyles(trimmed.replace(/^### /, ""))}</h3>
        }

        if (trimmed.startsWith("## ")) {
          const lines = trimmed.split("\n")
          const header = lines[0]
          const rest = lines.slice(1).join("\n")
          if (rest.trim().length > 0) {
            return (
              <div key={index}>
                <h2>{processInlineStyles(header.replace(/^## /, ""))}</h2>
                <MarkdownRenderer content={rest} />
              </div>
            )
          }
          return <h2 key={index}>{processInlineStyles(trimmed.replace(/^## /, ""))}</h2>
        }

        if (trimmed.startsWith("# ")) {
          return <h2 key={index}>{processInlineStyles(trimmed.replace(/^# /, ""))}</h2>
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\. /.test(trimmed)) {
          const isOrdered = /^\d+\. /.test(trimmed)
          const items = trimmed.split(/\n/).map(line => line.replace(/^[-*] |\d+\. /, "").trim())
          const ListTag = isOrdered ? "ol" : "ul"
          return (
            <ListTag key={index}>
              {items.map((item, i) => (
                <li key={i}>{processInlineStyles(item)}</li>
              ))}
            </ListTag>
          )
        }

        if (trimmed.startsWith("> ")) {
          return <blockquote key={index}>{processInlineStyles(trimmed.replace(/^> /, ""))}</blockquote>
        }

        return <p key={index}>{processInlineStyles(trimmed)}</p>
      })}
    </div>
  )
}

function processInlineStyles(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const subParts = part.split(/(_.*?_)/g)
    return subParts.map((subPart, j) => {
      if (subPart.startsWith("_") && subPart.endsWith("_")) {
        return <em key={`${i}-${j}`}>{subPart.slice(1, -1)}</em>
      }
      return subPart
    })
  })
}
