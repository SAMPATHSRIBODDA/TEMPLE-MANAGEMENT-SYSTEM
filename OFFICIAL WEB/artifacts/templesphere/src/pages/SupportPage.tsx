import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { HelpCircle, Ticket, BookOpen, Phone } from "lucide-react";

const channels = [
  { icon: HelpCircle, title: "Help Center", desc: "Browse our comprehensive knowledge base with step-by-step guides for every feature.", action: "Browse Articles", href: "#" },
  { icon: Ticket, title: "Raise a Ticket", desc: "Submit a support ticket and our team will respond within your plan's SLA timeframe.", action: "Open Ticket", href: "#" },
  { icon: BookOpen, title: "Documentation", desc: "Technical documentation, API references, and integration guides for developers.", action: "View Docs", href: "#" },
  { icon: Phone, title: "Contact Support", desc: "Speak directly with our support team. Available Monday–Saturday, 9 AM–7 PM IST.", action: "Call Support", href: "tel:+919876543210" },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-12 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Support</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">We're Here to Help</h1>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">Multiple ways to get assistance — choose whichever works best for you.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {channels.map(({ icon: Icon, title, desc, action, href }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="border rounded-2xl p-6 bg-card text-center flex flex-col hover:shadow-md transition-shadow" data-testid={`card-support-${title.toLowerCase().replace(/ /g, "-")}`}>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Icon size={22} className="text-primary" /></div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{desc}</p>
                  <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary hover:text-white" asChild><a href={href}>{action}</a></Button>
                </motion.div>
              ))}
            </div>

            <div className="bg-muted/30 rounded-2xl p-8 border text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-3">Enterprise Support</h2>
              <p className="text-muted-foreground mb-5">Enterprise plan customers get a dedicated support manager, on-site training, and 24/7 emergency response. Contact us to upgrade.</p>
              <Button asChild data-testid="button-enterprise-support"><a href="mailto:enterprise@templesphere.in">Contact Enterprise Support</a></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
