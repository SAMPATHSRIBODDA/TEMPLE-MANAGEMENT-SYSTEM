import { motion } from "framer-motion";
import { Check, Building2, Landmark, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const solutions = [
  {
    icon: Building2,
    title: "Small Temples",
    subtitle: "Up to 500 devotees/day",
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-200",
    features: [
      "Counter software (1 terminal)",
      "Basic admin dashboard",
      "Donation management",
      "Receipt printing",
      "Mobile devotee app",
      "Email support",
    ],
  },
  {
    icon: Landmark,
    title: "Large Temples",
    subtitle: "2000+ devotees/day",
    color: "from-amber-500/10 to-yellow-500/10",
    border: "border-amber-200",
    features: [
      "Unlimited counter terminals",
      "Full admin dashboard",
      "QR ticketing & verification",
      "Laddu & inventory management",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    icon: Users,
    title: "Trust Organizations",
    subtitle: "Registered dharmic trusts",
    color: "from-indigo-500/10 to-blue-500/10",
    border: "border-indigo-200",
    features: [
      "Multi-department access",
      "80G receipt generation",
      "Audit trail & compliance reports",
      "Bank reconciliation",
      "Custom branding",
      "Dedicated account manager",
    ],
  },
  {
    icon: Globe,
    title: "Multi-Temple Management",
    subtitle: "Temple chains & networks",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-200",
    features: [
      "Centralised super dashboard",
      "Per-temple reporting",
      "Unified devotee database",
      "Cross-temple analytics",
      "White label per branch",
      "Enterprise SLA support",
    ],
  },
];

export function Solutions() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            Tailored Solutions
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            A Plan for Every Temple
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you manage a small neighbourhood shrine or a major pilgrimage destination, TempleSphere has a solution built for your scale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map(({ icon: Icon, title, subtitle, color, border, features }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className={`bg-gradient-to-br ${color} border ${border} rounded-2xl p-6 flex flex-col`}
              data-testid={`card-solution-${title.toLowerCase().replace(/ /g, "-")}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground mb-5">{subtitle}</p>
              <ul className="space-y-2.5 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" asChild className="mt-6 w-full border-primary/30 text-primary hover:bg-primary hover:text-white">
                <Link href="/book-demo">Learn More</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
