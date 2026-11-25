import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Eye, ShoppingBag, HandCoins, Heart,
  Package, BarChart3, QrCode, Smartphone, TrendingUp
} from "lucide-react";

const modules = [
  {
    icon: Ticket,
    title: "Entry Tickets",
    desc: "Issue timed entry tickets for different darshan queues. Manage general, special, and VIP entry with capacity controls and real-time queue tracking.",
  },
  {
    icon: Eye,
    title: "Darshan Tickets",
    desc: "End-to-end darshan ticket management including advance booking, on-spot issuance, QR verification, and automated queue management.",
  },
  {
    icon: ShoppingBag,
    title: "Laddu Sales",
    desc: "Streamline prasadam laddu orders with batch tracking, counter billing, customer receipts, and daily production vs. sales reconciliation.",
  },
  {
    icon: HandCoins,
    title: "Pooja Booking",
    desc: "Accept online and walk-in pooja bookings with priest assignment, scheduling, confirmation messages, and payment collection.",
  },
  {
    icon: Heart,
    title: "Donations",
    desc: "Collect and manage donations across multiple seva heads. Generate 80G receipts, issue donor cards, and track campaign progress.",
  },
  {
    icon: Package,
    title: "Inventory",
    desc: "Track pooja samagri, prasadam stock, and temple assets. Set reorder levels, manage vendors, and get automated low-stock alerts.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    desc: "Comprehensive daily, weekly, and monthly reports covering footfall, revenue, donation trends, and module-wise performance.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    desc: "Fast, contactless QR scan verification at entry gates. Works offline and syncs automatically when connectivity is restored.",
  },
  {
    icon: Smartphone,
    title: "Mobile Booking",
    desc: "Let devotees book darshan, poojas, and laddu prasadam directly from the TempleSphere mobile app — anytime, anywhere.",
  },
  {
    icon: TrendingUp,
    title: "Analytics",
    desc: "Deep analytics on devotee behaviour, seasonal patterns, revenue streams, and operational efficiency to drive smarter decisions.",
  },
];

export function ModuleShowcase() {
  const [active, setActive] = useState(0);
  const current = modules[active];

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            Module Explorer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Every Module, One Platform
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Click any module to explore what TempleSphere does for that area of temple operations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {modules.map(({ icon: Icon, title }, i) => (
              <button
                key={title}
                onClick={() => setActive(i)}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all duration-200 ${
                  active === i
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-white text-foreground border-border hover:border-primary/40 hover:bg-primary/5"
                }`}
                data-testid={`button-module-${title.toLowerCase().replace(/ /g, "-")}`}
              >
                <Icon size={18} className={active === i ? "text-primary-foreground" : "text-primary"} />
                <span className="text-sm font-medium">{title}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="bg-white border rounded-2xl p-8 shadow-sm h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <current.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{current.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{current.desc}</p>
                <div className="mt-8 p-4 rounded-xl bg-muted/40 border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground font-medium">Live preview</span>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-3 bg-muted rounded-full" style={{ width: `${100 - n * 12}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
