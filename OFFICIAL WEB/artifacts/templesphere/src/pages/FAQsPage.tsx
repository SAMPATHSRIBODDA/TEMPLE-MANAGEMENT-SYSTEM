import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomCTA } from "@/components/sections/BottomCTA";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const allFaqs = [
  { category: "General", q: "What is TempleSphere?", a: "TempleSphere is a comprehensive Temple Management System (TMS) SaaS platform covering Counter Software, Admin Dashboard, Devotee Mobile App, and a Super Admin platform — all in one subscription." },
  { category: "General", q: "Who is TempleSphere built for?", a: "Any temple institution — from small local shrines to major pilgrimage destinations, religious trusts, and multi-temple networks across India." },
  { category: "General", q: "Is TempleSphere cloud-based?", a: "Yes. TempleSphere is a 100% cloud-based SaaS platform. You access it from any device with a browser. No server installation required." },
  { category: "Pricing", q: "How does pricing work?", a: "TempleSphere offers Starter (₹2,999/mo), Professional (₹6,999/mo), and Enterprise (custom) plans. Annual plans offer 20% savings. A 30-day free trial is available on any plan." },
  { category: "Pricing", q: "Are there any setup or hidden fees?", a: "No. The subscription price covers everything — onboarding, support, all software updates, and data migration assistance." },
  { category: "Features", q: "Can we customise the modules we use?", a: "Absolutely. TempleSphere is fully modular. Enable only the modules you need and pay only for what you use." },
  { category: "Features", q: "Do you provide mobile apps for devotees?", a: "Yes. The TempleSphere Devotee App is available for Android and iOS on all plans. Devotees can book darshan, poojas, receive QR tickets, and place laddu orders." },
  { category: "Features", q: "Does TempleSphere support multiple languages?", a: "Yes. The platform and app support multiple Indian languages including Telugu, Tamil, Kannada, Hindi, Malayalam, and Marathi." },
  { category: "Features", q: "Can we use TempleSphere for donation receipts and 80G certificates?", a: "Yes. The donation module includes automated 80G-compliant receipt generation, donor database management, and bulk export for audit and tax purposes." },
  { category: "Support", q: "What support is included?", a: "All plans include email and phone support. Professional plans get 4-hour priority SLA. Enterprise customers get a dedicated account manager and 24/7 emergency support." },
  { category: "Support", q: "Do you provide training?", a: "Yes. All onboarding includes virtual training sessions for admin and counter staff. Enterprise plans include on-site training at the temple premises." },
  { category: "Technical", q: "What happens if our internet goes down?", a: "TempleSphere counter software can operate in offline mode for up to 8 hours, caching all transactions locally and syncing automatically when connectivity is restored." },
];

const groupedFaqs = allFaqs.reduce((acc, faq) => {
  if (!acc[faq.category]) acc[faq.category] = [];
  acc[faq.category].push(faq);
  return acc;
}, {} as Record<string, typeof allFaqs>);

export default function FAQsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-12 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">FAQs</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
              <p className="text-muted-foreground text-xl max-w-xl mx-auto">Everything you need to know about TempleSphere, our pricing, features, and support.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            {Object.entries(groupedFaqs).map(([category, faqs], ci) => (
              <motion.div key={category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: ci * 0.08 }} className="mb-10">
                <h2 className="text-lg font-bold mb-4 text-primary">{category}</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map(({ q, a }, i) => (
                    <AccordionItem key={i} value={`${category}-${i}`} className="border rounded-xl px-5 py-1 bg-card" data-testid={`accordion-${category.toLowerCase()}-${i + 1}`}>
                      <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">{q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </section>

        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
