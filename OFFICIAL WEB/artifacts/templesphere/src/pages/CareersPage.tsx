import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";

const openings = [
  { role: "Senior Frontend Engineer", team: "Engineering", location: "Bengaluru / Remote", type: "Full-time", desc: "Build beautiful, accessible React interfaces used by temple administrators across India." },
  { role: "Backend Engineer (Node.js)", team: "Engineering", location: "Bengaluru / Remote", type: "Full-time", desc: "Design and build scalable APIs, real-time systems, and integrations for our SaaS platform." },
  { role: "Product Designer (UX)", team: "Design", location: "Bengaluru / Remote", type: "Full-time", desc: "Shape the experience of products used at ancient temples. User research, flows, and high-fidelity design." },
  { role: "Customer Success Manager", team: "Success", location: "Bengaluru", type: "Full-time", desc: "Onboard temples, drive adoption, and ensure every customer gets maximum value from TempleSphere." },
  { role: "Sales Development Representative", team: "Sales", location: "Bengaluru", type: "Full-time", desc: "Identify and engage temple trusts across India who would benefit from TempleSphere." },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="pt-20 pb-16 bg-gradient-to-b from-muted/30 to-white">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">Careers</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">Build Technology for Sacred India</h1>
              <p className="text-muted-foreground text-xl leading-relaxed">Join a small, focused team doing meaningful work. We're building software that serves millions of devotees at India's most important institutions. If that moves you, we'd love to hear from you.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
            <div className="space-y-4">
              {openings.map(({ role, team, location, type, desc }, i) => (
                <motion.div key={role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="border rounded-2xl p-6 bg-card hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid={`card-job-${i + 1}`}>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">{team}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{role}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{desc}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin size={12} />{location}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{type}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-white shrink-0" data-testid={`button-apply-${i + 1}`}>Apply Now</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
