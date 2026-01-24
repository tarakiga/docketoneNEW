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
