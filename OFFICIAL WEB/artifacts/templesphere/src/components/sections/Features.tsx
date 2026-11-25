import { motion } from "framer-motion";
import {
  Monitor, LayoutDashboard, Smartphone, QrCode, Printer,
  HandCoins, ShoppingBag, Heart, Package, BarChart3,
  CreditCard, Layers
} from "lucide-react";

const features = [
  { icon: Monitor, title: "Temple Counter Software", desc: "Blazing-fast counter software for darshan, laddu sales, and receipt generation at the temple desk." },
  { icon: LayoutDashboard, title: "Admin Dashboard", desc: "Comprehensive admin panel with real-time insights, staff management, and operational controls." },
  { icon: Smartphone, title: "Devotee Mobile App", desc: "A native mobile app for devotees to book darshan, poojas, and receive digital tickets and updates." },
  { icon: QrCode, title: "QR Ticketing", desc: "Contactless QR-based ticketing system for fast, paperless entry verification at all checkpoints." },
  { icon: Printer, title: "Receipt Printing", desc: "Thermal receipt printing integration for instant donation receipts, laddu bills, and pooja slips." },
  { icon: HandCoins, title: "Pooja Management", desc: "Complete pooja booking, scheduling, and tracking system with online and offline payment support." },
  { icon: ShoppingBag, title: "Laddu Management", desc: "End-to-end laddu prasadam management covering production, sales, inventory, and reporting." },
  { icon: Heart, title: "Donation Management", desc: "Structured donation collection with 80G certificate support, online portals, and audit trails." },
  { icon: Package, title: "Inventory Management", desc: "Track pooja materials, prasadam stock, and temple assets with low-stock alerts and auto-reorder." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Rich reports on footfall, revenue, donation trends, and operational efficiency with export support." },
  { icon: CreditCard, title: "Subscription Management", desc: "Flexible monthly and annual subscription plans for temples of all sizes with easy upgrades." },
  { icon: Layers, title: "White Label Solution", desc: "Deploy TempleSphere under your trust's own brand with custom domain, logo, and color scheme." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            Everything You Need
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful Features, Built for Temples
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From counter operations to analytics, TempleSphere covers every dimension of modern temple management.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              className="group p-6 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-default"
              data-testid={`card-feature-${title.toLowerCase().replace(/ /g, "-")}`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
