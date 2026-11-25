import { motion } from "framer-motion";

const temples = [
  "Shri Venkateswara Devasthanam",
  "Somnath Temple Trust",
  "Shirdi Sai Baba Sansthan",
  "Siddhivinayak Temple",
  "Kashi Vishwanath Trust",
  "Vaishno Devi Shrine Board",
];

export function TrustStrip() {
  return (
    <section className="py-12 bg-muted/30 border-y overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-xs text-muted-foreground font-medium uppercase tracking-widest mb-8">
          Trusted by Temples Across India
        </p>
        <div className="flex gap-10 items-center justify-center flex-wrap">
          {temples.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border bg-card"
              data-testid={`badge-temple-${i + 1}`}
            >
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1L1 5H2.5V9H7.5V5H9L5 1Z" fill="hsl(247 66% 58%)"/>
                </svg>
              </div>
              <span className="text-xs font-medium text-foreground/70 whitespace-nowrap">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
