import { motion } from "framer-motion";
import { Building2, Settings2, PlayCircle, FileBarChart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Setup Temple",
    desc: "Register your temple, configure basic details, and onboard your team — all in under 30 minutes.",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configure Modules",
    desc: "Enable only the modules you need — darshan, poojas, laddu, donations — and customise them for your workflow.",
  },
  {
    number: "03",
    icon: PlayCircle,
    title: "Start Managing",
    desc: "Go live immediately. Counter staff, admin team, and devotees all get access to their dedicated interfaces.",
  },
  {
    number: "04",
    icon: FileBarChart,
    title: "Generate Reports",
    desc: "Get daily, weekly, and monthly reports on footfall, revenue, inventory, and more — instantly, with one click.",
  },
];

export function HowItWorks() {
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
            Simple Onboarding
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Up and Running in 4 Steps
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No lengthy implementation. No IT team required. TempleSphere is designed to be operational the same day you sign up.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ number, icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
                data-testid={`card-step-${i + 1}`}
              >
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-2xl bg-muted/40 border flex items-center justify-center">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {number}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
