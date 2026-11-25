import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is TempleSphere?",
    a: "TempleSphere is a comprehensive Temple Management System (TMS) — a SaaS platform that digitizes and streamlines all core temple operations including darshan ticketing, laddu prasadam sales, donation management, pooja bookings, inventory tracking, and devotee engagement. It comes with a Counter Software, Admin Dashboard, Devotee Mobile App, and a Super Admin platform.",
  },
  {
    q: "How does pricing work?",
    a: "TempleSphere offers three pricing tiers: Starter (₹2,999/month), Professional (₹6,999/month), and Enterprise (custom pricing). Each plan is subscription-based with no hidden fees. You can start with a 30-day free trial. Annual plans come with a 20% discount. Contact us for a custom quote for large temple networks.",
  },
  {
    q: "Can we customise the modules we use?",
    a: "Absolutely. TempleSphere is modular by design. You enable only the modules relevant to your temple — darshan, poojas, laddu, donations, inventory, analytics — and pay only for what you use. The White Label solution also allows complete branding customisation.",
  },
  {
    q: "Do you provide mobile apps for devotees?",
    a: "Yes. The TempleSphere Devotee Mobile App is available on both Android and iOS. Devotees can use it to book darshan slots, receive digital QR tickets, place laddu prasadam orders, book poojas, and receive important temple notifications. The app is included in all plans.",
  },
  {
    q: "What support do you provide after setup?",
    a: "All plans include email and phone support. The Professional plan includes priority support with a 4-hour response SLA. Enterprise customers get a dedicated account manager, on-site training, and 24/7 emergency support. We also provide comprehensive documentation, video tutorials, and a help center.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Everything you need to know about TempleSphere. Can't find the answer? Our team is happy to help.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map(({ q, a }, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border rounded-xl px-5 py-1 bg-card data-[state=open]:shadow-sm"
                  data-testid={`accordion-faq-${i + 1}`}
                >
                  <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
