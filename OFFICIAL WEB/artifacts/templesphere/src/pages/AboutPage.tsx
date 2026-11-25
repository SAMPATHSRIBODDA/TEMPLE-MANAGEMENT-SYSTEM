import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { Heart, Lightbulb, Shield, Users } from "lucide-react";

const values = [
  { icon: Heart, title: "Devotion to Service", desc: "Every product decision is made with the devotee experience at its heart. We serve the institutions that serve millions." },
  { icon: Shield, title: "Integrity & Transparency", desc: "Temple finances are sacred. We build audit trails, compliance tools, and transparency features as a core commitment — not an afterthought." },
  { icon: Lightbulb, title: "Innovation with Purpose", desc: "We innovate not for novelty, but to solve real problems faced by temple administrators every day." },
  { icon: Users, title: "Inclusive Accessibility", desc: "Our software works in multiple Indian languages and is designed for staff with varying levels of digital literacy." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-20 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Our Story</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Built for Temples, by People Who Care</h1>
              <p className="text-muted-foreground text-xl leading-relaxed mb-6">TempleSphere was founded in 2021 by a team of technology professionals who grew up visiting temples — and grew frustrated watching ancient institutions struggle with paper registers, cash counting errors, and long queues that turned spiritual visits into exhausting ordeals.</p>
              <p className="text-muted-foreground text-lg leading-relaxed">We believed that India's temples — which collectively serve over 500 million devotees annually — deserved software as thoughtful as the institutions themselves. TempleSphere was built to honour that belief.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl font-bold mb-5">Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">To empower India's temple institutions with world-class digital tools that preserve their sanctity, improve devotee experience, and bring operational transparency to every aspect of temple management.</p>
              <h2 className="text-3xl font-bold mb-5">Vision</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">A future where every temple in India — from the grandest of pilgrimage sites to the smallest village shrine — has access to the technology it needs to serve devotees with dignity and efficiency.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "500+", label: "Temples Served" },
                  { num: "5M+", label: "Devotees / Month" },
                  { num: "₹200Cr+", label: "Donations Processed" },
                  { num: "99.9%", label: "Uptime SLA" },
                  { num: "12+", label: "States Covered" },
                  { num: "2021", label: "Founded" },
                ].map(({ num, label }) => (
                  <div key={label} className="bg-muted/40 rounded-2xl p-5 text-center">
                    <p className="text-2xl font-bold text-primary">{num}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="bg-white rounded-2xl p-6 border shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4"><Icon size={20} className="text-primary" /></div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
