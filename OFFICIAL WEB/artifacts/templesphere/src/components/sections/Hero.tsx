import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Digitally Transform Your <span className="text-primary">Temple Operations</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Manage Darshan, Laddu Sales, Donations, Poojas and Devotees with one powerful, secure, and easy-to-use platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="text-base px-8">
                <Link href="/book-demo">Book Demo</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8">
                Watch Video
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-card border rounded-2xl shadow-xl p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-muted/50 rounded-lg border"></div>
                  <div className="h-24 bg-muted/50 rounded-lg border"></div>
                  <div className="h-24 bg-muted/50 rounded-lg border"></div>
                </div>
                <div className="h-48 bg-muted/30 rounded-lg border flex items-end px-4 pb-4 gap-2">
                  <div className="w-full h-1/2 bg-primary/20 rounded-t"></div>
                  <div className="w-full h-3/4 bg-primary/40 rounded-t"></div>
                  <div className="w-full h-full bg-primary/60 rounded-t"></div>
                  <div className="w-full h-2/3 bg-primary/80 rounded-t"></div>
                  <div className="w-full h-5/6 bg-primary rounded-t"></div>
                </div>
              </div>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary to-accent opacity-20 blur-2xl -z-10 rounded-[2rem]"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
