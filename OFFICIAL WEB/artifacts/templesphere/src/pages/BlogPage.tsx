import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const categories = ["All", "Temple Management", "Digital Transformation", "Case Studies", "Announcements"];

const posts = [
  { title: "How QR Ticketing Reduced Wait Times by 60% at Shri Venkateswara Devasthanam", category: "Case Studies", date: "12 Jun 2025", excerpt: "We dive deep into how TempleSphere's QR ticketing system transformed darshan management at one of India's busiest temples.", readTime: "6 min read" },
  { title: "The Digital Temple: Why India's Sacred Institutions Need Modern Software", category: "Digital Transformation", date: "28 May 2025", excerpt: "Temples across India manage millions of devotees annually. Yet most still operate on paper. Here's why that needs to change.", readTime: "5 min read" },
  { title: "5 Signs Your Temple Is Ready for a Management System", category: "Temple Management", date: "15 May 2025", excerpt: "From long queues to accounting headaches — these are the telltale signs that your temple operations need a digital upgrade.", readTime: "4 min read" },
  { title: "TempleSphere 3.0 — Announcing Multi-Temple Dashboard and Advanced Analytics", category: "Announcements", date: "1 May 2025", excerpt: "Our biggest release yet. Multi-temple management, an overhauled analytics engine, and a brand new mobile app.", readTime: "3 min read" },
  { title: "Managing Laddu Prasadam at Scale: A Technology Perspective", category: "Temple Management", date: "20 Apr 2025", excerpt: "Laddu prasadam management is a multi-crore operation at major temples. Here's how technology is bringing order to the process.", readTime: "7 min read" },
  { title: "Case Study: Siddhivinayak Temple's Digital Donation Transformation", category: "Case Studies", date: "5 Apr 2025", excerpt: "How one of Mumbai's most visited temples increased digital donation collection by 3x in six months with TempleSphere.", readTime: "8 min read" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-12 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Blog</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Insights for Temple Administrators</h1>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">Practical guides, case studies, and product news from the TempleSphere team.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex gap-2 flex-wrap justify-center mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? "bg-primary text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                  data-testid={`button-category-${cat.toLowerCase().replace(/ /g, "-")}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map(({ title, category, date, excerpt, readTime }, i) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="border rounded-2xl bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  data-testid={`card-blog-${i + 1}`}
                >
                  <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-end p-5">
                    <span className="text-xs font-semibold text-primary bg-primary/15 px-3 py-1 rounded-full">{category}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span>{date}</span>
                      <span>·</span>
                      <span>{readTime}</span>
                    </div>
                    <h3 className="font-bold text-base leading-snug mb-3 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{excerpt}</p>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium">
                      Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
