import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-12 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Contact Us</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">We'd love to learn about your temple and show you what TempleSphere can do for you.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-5" data-testid="form-contact">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="contact-name">Your Name</label>
                      <input id="contact-name" type="text" placeholder="Sri Ramesh Kumar" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-contact-name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="contact-temple">Temple Name</label>
                      <input id="contact-temple" type="text" placeholder="Shri Balaji Temple" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-contact-temple" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="contact-email">Email Address</label>
                      <input id="contact-email" type="email" placeholder="admin@temple.org" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-contact-email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="contact-phone">Phone Number</label>
                      <input id="contact-phone" type="tel" placeholder="+91 98765 43210" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-contact-phone" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block" htmlFor="contact-message">Message</label>
                    <textarea id="contact-message" rows={5} placeholder="Tell us about your temple and what you'd like to know..." className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" data-testid="input-contact-message" />
                  </div>
                  <Button size="lg" className="w-full" type="submit" data-testid="button-contact-submit">Send Message</Button>
                </form>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
                <div className="space-y-5 mb-8">
                  {[
                    { icon: Mail, label: "Email", value: "info@templesphere.in" },
                    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                    { icon: MapPin, label: "Address", value: "12th Floor, Prestige Tech Tower, Outer Ring Road, Bellandur, Bengaluru — 560103, Karnataka, India" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-4 p-5 rounded-2xl border bg-muted/20">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Icon size={18} className="text-primary" /></div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl overflow-hidden border bg-muted/30 h-56 flex items-center justify-center" data-testid="map-placeholder">
                  <div className="text-center">
                    <MapPin size={32} className="text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bellandur, Bengaluru, Karnataka</p>
                    <p className="text-xs text-muted-foreground mt-1">Interactive map coming soon</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
