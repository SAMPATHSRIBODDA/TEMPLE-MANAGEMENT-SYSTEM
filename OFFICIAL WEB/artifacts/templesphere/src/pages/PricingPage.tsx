import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "/month",
    desc: "Perfect for small temples with up to 500 devotees per day.",
    highlight: false,
    features: [
      "1 counter terminal",
      "Admin dashboard",
      "Donation management",
      "Receipt printing",
      "Devotee mobile app",
      "Basic reports",
      "Email support",
      "Up to 5 staff accounts",
    ],
  },
  {
    name: "Professional",
    price: "₹6,999",
    period: "/month",
    desc: "For mid-to-large temples that need full operations support.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited counter terminals",
      "Full admin dashboard",
      "QR ticketing & verification",
      "Laddu & inventory management",
      "Pooja booking & management",
      "Advanced analytics & reports",
      "Devotee mobile app",
      "Priority support (4h SLA)",
      "Unlimited staff accounts",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For temple trusts managing multiple temples or high-footfall destinations.",
    highlight: false,
    features: [
      "Multi-temple management",
      "Centralized super dashboard",
      "White label solution",
      "Custom domain & branding",
      "80G certificate management",
      "Bank reconciliation",
      "Dedicated account manager",
      "On-site training",
      "24/7 emergency support",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-16 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Pricing</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Simple, Transparent Pricing</h1>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">No hidden fees. No long-term lock-in. Start with a 30-day free trial on any plan.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map(({ name, price, period, desc, highlight, badge, features }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`relative rounded-2xl border p-8 flex flex-col ${highlight ? "border-primary shadow-xl ring-2 ring-primary/20 bg-gradient-to-b from-primary/5 to-white" : "bg-card shadow-sm"}`}
                  data-testid={`card-pricing-${name.toLowerCase()}`}
                >
                  {badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow">{badge}</span>
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="font-bold text-xl mb-1">{name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{desc}</p>
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{price}</span>
                      <span className="text-muted-foreground text-sm mb-1">{period}</span>
                    </div>
                    {period && <p className="text-xs text-muted-foreground mt-1">Billed monthly. Save 20% annually.</p>}
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check size={15} className={`mt-0.5 shrink-0 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    variant={highlight ? "default" : "outline"}
                    asChild
                    className={`w-full ${!highlight ? "border-primary/30 text-primary hover:bg-primary hover:text-white" : ""}`}
                    data-testid={`button-pricing-${name.toLowerCase()}`}
                  >
                    <Link href="/book-demo">Book Demo</Link>
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-14 p-8 rounded-2xl bg-muted/30 border max-w-2xl mx-auto">
              <p className="font-semibold mb-2">All plans include</p>
              <p className="text-muted-foreground text-sm">Free onboarding, data migration assistance, SSL security, 99.9% uptime SLA, and regular feature updates at no extra cost.</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
