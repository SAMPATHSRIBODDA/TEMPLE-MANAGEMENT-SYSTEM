import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/sections/Features";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Monitor, LayoutDashboard, Smartphone, QrCode, BarChart3, Layers } from "lucide-react";

const highlights = [
  { icon: Monitor, title: "Counter Software", desc: "Purpose-built for temple counters. Fast billing, receipt printing, and queue management in a single interface that staff can master in minutes." },
  { icon: LayoutDashboard, title: "Admin Dashboard", desc: "A real-time view of your entire temple operation — footfall, revenue, staff activity, and module performance — all in one beautifully designed panel." },
  { icon: Smartphone, title: "Devotee App", desc: "Available on iOS and Android. Devotees can book darshan, pay for poojas, receive QR tickets, and get temple notifications without standing in any queue." },
  { icon: QrCode, title: "QR Infrastructure", desc: "Generate and verify QR codes for darshan tickets, pooja receipts, and prasadam orders. Works offline and syncs automatically." },
  { icon: BarChart3, title: "Analytics Engine", desc: "Turn temple data into decisions. Track devotee trends, seasonal peaks, revenue per module, and operational bottlenecks with visual reports." },
  { icon: Layers, title: "White Label", desc: "Deploy TempleSphere under your temple trust's brand. Custom domain, logo, colors, and app store listing — entirely yours." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-16 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Platform Features</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Built for Every Aspect of Temple Management</h1>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">From entry gates to donation ledgers, TempleSphere covers it all — with enterprise-grade reliability and an interface that feels effortless.</p>
              <Button size="lg" asChild data-testid="button-features-book-demo"><Link href="/book-demo">Get a Demo</Link></Button>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="p-8 border rounded-2xl bg-card hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5"><Icon size={22} className="text-primary" /></div>
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Features />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
