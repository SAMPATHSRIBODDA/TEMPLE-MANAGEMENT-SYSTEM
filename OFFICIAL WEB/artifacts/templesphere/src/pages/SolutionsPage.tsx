import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Solutions } from "@/components/sections/Solutions";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { motion } from "framer-motion";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-16 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Solutions</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">The Right Fit for Every Temple</h1>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Whether you manage a single shrine or a network of major temples, TempleSphere has been designed to scale with you.</p>
            </motion.div>
          </div>
        </section>
        <Solutions />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
