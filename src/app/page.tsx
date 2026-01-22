import { SarcasticDivider } from "@/components/atoms/sarcastic-divider"
import { NewsletterForm } from "@/components/molecules/newsletter-form"
import { CategoryGrid } from "@/components/organisms/category-grid"
import { HeroSection } from "@/components/organisms/hero-section"
import { UniversalCalculator } from "@/components/organisms/universal-calculator"
import { Button } from "@/components/ui/button"
import { getLatestPosts } from "@/lib/blog"
import Image from "next/image"
import Link from "next/link"

export default async function Home() {
  const latestPosts = await getLatestPosts(3)

  return (
    <main className="flex-1 relative selection:bg-primary/30">

      <HeroSection />

      <SarcasticDivider />

      <section id="universal" className="container pb-12 relative z-10 px-4 md:px-6">
        <UniversalCalculator />
      </section>

      <CategoryGrid />

      {/* Blog Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Latest from Our Blog</h2>
                    <p className="text-muted-foreground">Insights, tips, and stories from our calculator experts.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="https://blog.docket.one">View All Posts</Link>
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map(post => (
                    <Link key={post.id} href={post.link} className="group block h-full">
                        <article className="glass-card rounded-xl overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300">
                           {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                               <div className="aspect-video relative overflow-hidden">
                                   <Image 
                                        src={post._embedded["wp:featuredmedia"][0].source_url}
                                        alt={post.title.rendered}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                   />
                               </div>
                           )}
                           <div className="p-6 flex flex-col flex-1">
                               <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
                               <div className="text-muted-foreground text-sm flex-1 line-clamp-3 mb-4" dangerouslySetInnerHTML={{__html: post.excerpt.rendered}} />
                               <span className="text-primary text-sm font-medium mt-auto">Read Article →</span>
                           </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 container px-4 md:px-6">
         <div className="max-w-4xl mx-auto">
             <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                 {/* Decorative blobs */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                 
                 <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
                     <h2 className="text-3xl font-bold">Join the Calculation Nation</h2>
                     <p className="text-muted-foreground text-lg">
                        Get the latest calculators, life hacks, and fun simulations delivered straight to your inbox. No spam, just math magic.
                     </p>
                 </div>
                 <div className="w-full md:w-auto relative z-10">
                    <NewsletterForm className="w-full md:w-[350px] shadow-2xl" />
                 </div>
             </div>
         </div>
      </section>

    </main>
  )
}
