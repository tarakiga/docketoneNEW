import { MetadataRoute } from "next"

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      {
        // Explicitly welcome AI assistants & search crawlers so Docket One can
        // surface in AI answers (ChatGPT, Claude, Perplexity, Gemini/AI Overviews,
        // Copilot, etc.). Flip any of these to `disallow: '/'` to opt out later.
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-User',
          'anthropic-ai',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot-Extended',
          'meta-externalagent',
          'CCBot',
        ],
        allow: '/',
        disallow: '/private/',
      },
    ],
    sitemap: 'https://docket.one/sitemap.xml',
  }
}
