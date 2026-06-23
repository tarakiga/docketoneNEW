export type BlogPost = {
  id: number
  date: string
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  link: string
  _embedded?: {
      "wp:featuredmedia"?: Array<{ source_url: string }>
  }
}

const namedEntities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: "\"",
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  ndash: "–",
  mdash: "—",
  hellip: "…",
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)))
    .replace(/&([a-zA-Z]+);/g, (_, name) => namedEntities[name] ?? `&${name};`)
}

export function sanitizeBlogText(html: string) {
  const withoutTags = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  return decodeHtmlEntities(withoutTags)
}

export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
 try {
    const res = await fetch(`https://blog.docket.one/wp-json/wp/v2/posts?per_page=${limit}&categories=31&_embed`, {
        next: { revalidate: 60 } // Revalidate every minute
    })
    
    if (!res.ok) {
        throw new Error('Failed to fetch posts')
    }

    return res.json()
 } catch (e) {
    console.error("Error fetching blog posts:", e)
    return []
 }
}
