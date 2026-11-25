import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function BookDemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-8 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Free Demo</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Book Your Free Demo</h1>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">See TempleSphere in action — tailored to your temple's specific needs. 30 minutes, no commitment required.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-5 gap-14 items-start max-w-5xl mx-auto">
              <div className="lg:col-span-3">
                <form className="space-y-5 bg-card border rounded-2xl p-8 shadow-sm" data-testid="form-book-demo">
                  <h2 className="text-xl font-bold mb-2">Your Details</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="demo-temple">Temple Name *</label>
                      <input id="demo-temple" type="text" placeholder="Shri Balaji Temple" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-demo-temple" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="demo-contact">Contact Person *</label>
                      <input id="demo-contact" type="text" placeholder="Sri Ramesh Kumar" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-demo-contact" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="demo-phone">Phone *</label>
                      <input id="demo-phone" type="tel" placeholder="+91 98765 43210" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-demo-phone" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block" htmlFor="demo-email">Email *</label>
                      <input id="demo-email" type="email" placeholder="admin@temple.org" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="input-demo-email" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block" htmlFor="demo-size">Temple Size *</label>
                    <select id="demo-size" className="w-full h-11 px-4 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" data-testid="select-demo-size">
                      <option value="">Select approximate daily footfall</option>
                      <option value="small">Small — up to 500 devotees/day</option>
                      <option value="medium">Medium — 500 to 2,000 devotees/day</option>
                      <option value="large">Large — 2,000+ devotees/day</option>
                      <option value="multi">Multi-temple / Trust Organization</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block" htmlFor="demo-requirements">Requirements</label>
                    <textarea id="demo-requirements" rows={4} placeholder="Tell us which modules interest you, current challenges, timeline..." className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" data-testid="input-demo-requirements" />
                  </div>
                  <Button size="lg" className="w-full" type="submit" data-testid="button-demo-submit">Schedule My Free Demo</Button>
                  <p className="text-xs text-muted-foreground text-center">By submitting, you agree to our Privacy Policy. We will never share your information.</p>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="bg-muted/30 rounded-2xl p-6 border">
                  <h3 className="font-semibold mb-4">What to Expect</h3>
                  <ul className="space-y-3">
                    {["30-minute personalised walkthrough","Live demo on your use case","Pricing tailored to your temple size","Q&A with a product specialist","No obligation, no credit card needed"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm">
                        <Check size={15} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <p className="text-sm font-semibold text-primary mb-2">Response Time</p>
                  <p className="text-sm text-muted-foreground">Our team responds within 2 business hours. Demo sessions are available Monday–Saturday, 9 AM–7 PM IST.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
