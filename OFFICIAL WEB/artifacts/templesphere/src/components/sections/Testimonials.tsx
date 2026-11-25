import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sri Raghunath Sharma",
    role: "Chief Priest & Administrator",
    temple: "Shri Venkateswara Devasthanam, Tirupati",
    quote:
      "TempleSphere transformed how we manage the 15,000 devotees who visit us daily. The QR ticketing system alone has cut wait times by 40%. It is a blessing for temple administration.",
    rating: 5,
  },
  {
    name: "Smt. Meenakshi Sundaram",
    role: "Executive Director",
    temple: "Madurai Meenakshi Amman Temple Trust",
    quote:
      "The donation management module has given our trust complete transparency. Every rupee is tracked, every receipt is digital. Our donors trust us more than ever before.",
    rating: 5,
  },
  {
    name: "Sri Govind Bhatt",
    role: "Managing Trustee",
    temple: "Somnath Trust, Prabhas Patan",
    quote:
      "We manage seven temples under our trust. TempleSphere's multi-temple dashboard lets us see the complete picture in one place. Implementation was smooth and support is excellent.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
            Trusted Across India
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What Temple Administrators Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Temples that have made the digital transition with TempleSphere.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, temple, quote, rating }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="bg-card border rounded-2xl p-7 flex flex-col shadow-sm hover:shadow-md transition-shadow"
              data-testid={`card-testimonial-${i + 1}`}
            >
              <Quote size={28} className="text-primary/25 mb-4" />
              <p className="text-foreground/80 leading-relaxed text-sm flex-1 mb-6">"{quote}"</p>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
                <p className="text-xs text-primary mt-0.5">{temple}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
