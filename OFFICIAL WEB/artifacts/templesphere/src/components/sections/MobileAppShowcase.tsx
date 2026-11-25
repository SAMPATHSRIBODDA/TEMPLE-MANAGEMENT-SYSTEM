import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Calendar, ShoppingBag, HandCoins, Bell } from "lucide-react";

const screens = [
  {
    title: "Booking Screens",
    icon: Calendar,
    color: "bg-primary",
    content: (
      <div className="space-y-3 p-4">
        <div className="bg-white/20 rounded-xl p-3">
          <p className="text-white/70 text-xs mb-1">Select Date</p>
          <p className="text-white font-semibold text-sm">Tomorrow, 14 Jul</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3">
          <p className="text-white/70 text-xs mb-1">Slot</p>
          <p className="text-white font-semibold text-sm">6:00 AM - 8:00 AM</p>
        </div>
        <div className="bg-white rounded-xl p-3">
          <p className="text-primary font-semibold text-sm text-center">Confirm Booking →</p>
        </div>
      </div>
    ),
  },
  {
    title: "QR Tickets",
    icon: QrCode,
    color: "bg-indigo-600",
    content: (
      <div className="flex flex-col items-center p-4 gap-3">
        <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center">
          <div className="grid grid-cols-5 gap-0.5">
            {Array.from({length: 25}).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${[0,1,2,3,4,5,10,15,20,21,22,23,24,12,6].includes(i) ? "bg-indigo-700" : "bg-gray-100"}`} />
            ))}
          </div>
        </div>
        <p className="text-white text-xs font-mono">TS-2024-00124</p>
        <p className="text-white/70 text-xs">General Darshan · 6 AM</p>
      </div>
    ),
  },
  {
    title: "Laddu Orders",
    icon: ShoppingBag,
    color: "bg-amber-600",
    content: (
      <div className="space-y-2 p-4">
        {[
          { item: "Laddu (500g)", qty: 2, price: "₹120" },
          { item: "Laddu (1kg)", qty: 1, price: "₹220" },
        ].map((o) => (
          <div key={o.item} className="bg-white/20 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-white text-xs font-semibold">{o.item}</p>
              <p className="text-white/60 text-xs">Qty: {o.qty}</p>
            </div>
            <p className="text-white font-bold text-sm">{o.price}</p>
          </div>
        ))}
        <div className="bg-white rounded-xl p-3 flex justify-between items-center">
          <p className="text-amber-700 font-semibold text-xs">Total</p>
          <p className="text-amber-700 font-bold text-sm">₹460</p>
        </div>
      </div>
    ),
  },
  {
    title: "Pooja Booking",
    icon: HandCoins,
    color: "bg-purple-700",
    content: (
      <div className="space-y-2 p-4">
        {["Abhishekam","Archana","Sahasranama"].map((pooja) => (
          <div key={pooja} className="bg-white/20 rounded-xl p-3 flex justify-between items-center">
            <p className="text-white text-xs font-semibold">{pooja}</p>
            <span className="text-xs bg-white/30 text-white rounded-full px-2 py-0.5">Book</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Notifications",
    icon: Bell,
    color: "bg-teal-600",
    content: (
      <div className="space-y-2 p-4">
        {[
          { msg: "Darshan confirmed for 6 AM", time: "2m ago" },
          { msg: "Laddu order ready for pickup", time: "1h ago" },
          { msg: "Pooja reminder: tomorrow 8 AM", time: "Yesterday" },
        ].map((n) => (
          <div key={n.msg} className="bg-white/20 rounded-xl p-3">
            <p className="text-white text-xs">{n.msg}</p>
            <p className="text-white/50 text-xs mt-1">{n.time}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export function MobileAppShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((v) => (v + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const current = screens[active];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              Devotee Mobile App
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              In Every Devotee's Pocket
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              The TempleSphere devotee app brings the temple experience to millions of smartphones. Book darshan, receive QR tickets, order prasadam, and stay updated — all from one app.
            </p>
            <div className="flex flex-wrap gap-2">
              {screens.map(({ title, icon: Icon }, i) => (
                <button
                  key={title}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active === i
                      ? "bg-primary text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  data-testid={`button-app-screen-${title.toLowerCase().replace(/ /g, "-")}`}
                >
                  <Icon size={14} />
                  {title}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative w-64">
              <div className="w-64 h-[520px] rounded-[3rem] border-[8px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 ${current.color} flex flex-col`}
                  >
                    <div className="pt-10 pb-4 px-4 flex items-center justify-between">
                      <p className="text-white font-bold text-sm">TempleSphere</p>
                      <current.icon size={16} className="text-white/70" />
                    </div>
                    <div className="flex-1">
                      {current.content}
                    </div>
                    <div className="pb-6 flex justify-center">
                      <div className="w-20 h-1 rounded-full bg-white/30" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute -inset-8 bg-gradient-radial from-primary/20 to-transparent blur-3xl -z-10 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
