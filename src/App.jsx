import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ShoppingBag,
  Ticket,
  Trophy,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Rocket,
  Plus,
  Minus,
  Search,
  BadgeCheck,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * GitHub Pages friendly
 * - Static data arrays
 * - Lots of transitions (Framer Motion)
 * - Store/cart demo UI
 */

const BRAND = {
  schoolName: "Auburn Rockets",
  tagline: "Launch the year in style.",
  accent: "from-blue-500 via-cyan-400 to-emerald-400",
};

const sampleEvents = [
  {
    id: "e1",
    title: "Winter Pep Rally",
    date: "2026-02-06",
    time: "2:15 PM",
    location: "Main Gym",
    category: "School Event",
    description: "Spirit, music, shout-outs, and a clean rocket-fuel vibe.",
  },
  {
    id: "e2",
    title: "Class of '28 Fundraiser Planning Meeting",
    date: "2026-02-10",
    time: "7:10 AM",
    location: "Room 214",
    category: "Fundraiser",
    description: "Lock in dates, promos, and who’s running what stations.",
  },
  {
    id: "e3",
    title: "Boys Varsity Basketball vs. Hudson",
    date: "2026-02-13",
    time: "6:30 PM",
    location: "Main Gym",
    category: "Sports",
    description: "Theme: Blue-Out. Pull up loud.",
  },
  {
    id: "e4",
    title: "Community Night: Panera Fundraiser",
    date: "2026-02-18",
    time: "4:00 PM – 8:00 PM",
    location: "Panera (local)",
    category: "Fundraiser",
    description: "Show the flyer at checkout. Percentage goes to class funds.",
  },
];

const sampleFundraisers = [
  {
    id: "f1",
    title: "Panera Community Night",
    date: "2026-02-18",
    goal: "$1,000",
    status: "Scheduled",
    details:
      "Show the flyer or mention the fundraiser at checkout. Proceeds support class events.",
  },
  {
    id: "f2",
    title: "Cookie Box Drop (Pre-orders)",
    date: "2026-03-05",
    goal: "$2,500",
    status: "Planning",
    details:
      "Pre-order window opens soon. Pickup after school in the cafeteria.",
  },
  {
    id: "f3",
    title: "Spirit Merch Launch",
    date: "2026-03-12",
    goal: "$3,000",
    status: "Design Phase",
    details:
      "Hoodies, crewnecks, stickers, and bracelets. Limited run, premium quality.",
  },
];

const sampleSports = [
  {
    id: "s1",
    sport: "Indoor Track",
    matchup: "Meet @ Worcester",
    date: "2026-02-01",
    time: "10:00 AM",
    location: "Worcester Indoor Center",
    level: "Varsity",
  },
  {
    id: "s2",
    sport: "Basketball",
    matchup: "vs. Hudson",
    date: "2026-02-13",
    time: "6:30 PM",
    location: "Auburn HS Gym",
    level: "Varsity",
  },
  {
    id: "s3",
    sport: "Hockey",
    matchup: "@ Shrewsbury",
    date: "2026-02-20",
    time: "7:15 PM",
    location: "Shrewsbury Rink",
    level: "JV",
  },
];

const sampleProducts = [
  {
    id: "p1",
    name: "Rockets Luxe Hoodie",
    price: 55,
    tag: "Best Seller",
    description: "Heavyweight fleece, embroidered rocket mark, clean fit.",
  },
  {
    id: "p2",
    name: "Class of '28 Crewneck",
    price: 45,
    tag: "Limited",
    description: "Premium cotton blend with minimal front crest.",
  },
  {
    id: "p3",
    name: "Rocket Pin Set (2-pack)",
    price: 12,
    tag: "Accessory",
    description: "Metal enamel pins. Subtle, sharp, collectible.",
  },
  {
    id: "p4",
    name: "Rockets Sticker Sheet",
    price: 6,
    tag: "Budget",
    description: "Laptop-ready. Water-resistant. Surprisingly drippy.",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByMonth(items) {
  const map = new Map();
  for (const it of items) {
    const d = new Date(it.date + "T00:00:00");
    const key = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  }
  for (const [k, arr] of map.entries()) {
    arr.sort((a, b) => a.date.localeCompare(b.date));
    map.set(k, arr);
  }
  return map;
}

/** Motion presets */
const pageVariants = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  in: { opacity: 1, y: 0, filter: "blur(0px)" },
  out: { opacity: 0, y: -10, filter: "blur(6px)" },
};

const pageTransition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.6,
};

function Pill({ children, tone = "default" }) {
  const tones = {
    default: "bg-white/8 text-white/90 ring-1 ring-white/10",
    good: "bg-emerald-400/10 text-emerald-100 ring-1 ring-emerald-300/20",
    warn: "bg-amber-400/10 text-amber-100 ring-1 ring-amber-300/20",
    cool: "bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur",
        tones[tone] || tones.default
      )}
    >
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, kicker, title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-white/70">
        {Icon ? <Icon size={16} /> : null}
        <p className="text-xs uppercase tracking-[0.22em]">{kicker}</p>
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm text-white/70">{subtitle}</p>
      ) : null}
    </div>
  );
}

function GlassCard({ children, className }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={cn(
        "rounded-3xl bg-white/6 backdrop-blur-xl ring-1 ring-white/10",
        "shadow-[0_20px_80px_-30px_rgba(0,0,0,0.85)]",
        "hover:ring-white/20 hover:bg-white/8",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: [0.65, 0.85, 0.65] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full blur-3xl",
          "bg-gradient-to-br",
          BRAND.accent
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/75" />
    </div>
  );
}

function Nav({ page, setPage, cartCount, openCart }) {
  const links = [
    { key: "home", label: "Home" },
    { key: "calendar", label: "Calendar" },
    { key: "fundraisers", label: "Fundraisers" },
    { key: "sports", label: "Sports" },
    { key: "store", label: "Store" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setPage("home")}
          className="group flex items-center gap-2 rounded-2xl px-3 py-2 text-white hover:bg-white/8"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <Rocket size={18} className="text-white/90" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold leading-tight">{BRAND.schoolName}</div>
            <div className="text-[11px] text-white/60 leading-tight">Bougie Hub</div>
          </div>
        </motion.button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={l.key}
              onClick={() => setPage(l.key)}
              className={cn(
                "rounded-2xl px-4 py-2 text-sm transition",
                page === l.key
                  ? "bg-white/10 text-white ring-1 ring-white/15"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              )}
            >
              {l.label}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={openCart}
          className="relative inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/15"
        >
          <ShoppingBag size={16} />
          Cart
          {cartCount > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-white text-black text-xs font-semibold px-2">
              {cartCount}
            </span>
          ) : null}
        </motion.button>
      </div>

      {/* Mobile row */}
      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex flex-wrap gap-2">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => setPage(l.key)}
              className={cn(
                "rounded-2xl px-3 py-2 text-xs transition",
                page === l.key
                  ? "bg-white/10 text-white ring-1 ring-white/15"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero({ setPage }) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.10),transparent_45%)]" />
      </div>

      <div className="relative p-8 md:p-12">
        <Pill tone="cool">
          <span className="inline-flex items-center gap-2">
            <Sparkles size={14} /> Auburn • Massachusetts • Rockets
          </span>
        </Pill>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl"
        >
          {BRAND.tagline}
        </motion.h1>

        <p className="mt-4 max-w-2xl text-white/70">
          A sleek home for school events, fundraisers, sports schedules, contact, and a store
          that feels premium, not plastic. Rockets energy, luxury finish.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage("calendar")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            View Calendar <ArrowRight size={16} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage("store")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Shop Rockets Gear <ShoppingBag size={16} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage("fundraisers")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
          >
            Fundraisers <Ticket size={16} />
          </motion.button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <Pill>Next Up</Pill>
              <CalendarDays size={18} className="text-white/80" />
            </div>
            <p className="mt-3 text-white font-semibold">Upcoming Events</p>
            <p className="mt-1 text-sm text-white/70">See what’s happening this month.</p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <Pill tone="good">Support</Pill>
              <BadgeCheck size={18} className="text-white/80" />
            </div>
            <p className="mt-3 text-white font-semibold">Fundraisers</p>
            <p className="mt-1 text-sm text-white/70">
              Every purchase helps the class and clubs.
            </p>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <Pill tone="warn">Game Day</Pill>
              <Trophy size={18} className="text-white/80" />
            </div>
            <p className="mt-3 text-white font-semibold">Sports</p>
            <p className="mt-1 text-sm text-white/70">Schedules, locations, matchups.</p>
          </GlassCard>
        </div>
      </div>
    </GlassCard>
  );
}

function CalendarPage() {
  const grouped = useMemo(() => groupByMonth(sampleEvents), []);
  return (
    <div>
      <SectionTitle
        icon={CalendarDays}
        kicker="Calendar"
        title="Upcoming events"
        subtitle="A clean view: school events, fundraisers, sports."
      />

      <div className="space-y-6">
        {[...grouped.entries()].map(([month, items]) => (
          <GlassCard key={month} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{month}</h3>
              <Pill>{items.length} item(s)</Pill>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {items.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{e.title}</p>
                      <p className="mt-1 text-sm text-white/70">
                        {formatDate(e.date)} • {e.time}
                      </p>
                      <p className="mt-1 text-sm text-white/60">{e.location}</p>
                    </div>
                    <Pill tone={e.category === "Sports" ? "warn" : e.category === "Fundraiser" ? "good" : "cool"}>
                      {e.category}
                    </Pill>
                  </div>
                  <p className="mt-3 text-sm text-white/70">{e.description}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function FundraisersPage() {
  return (
    <div>
      <SectionTitle
        icon={Ticket}
        kicker="Fundraisers"
        title="Support the class"
        subtitle="Clean, transparent info so people actually show up and spend. 😄"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {sampleFundraisers.map((f) => (
          <GlassCard key={f.id} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white font-semibold">{f.title}</p>
                <p className="mt-1 text-sm text-white/70">{formatDate(f.date)}</p>
              </div>
              <Pill tone={f.status === "Scheduled" ? "good" : f.status === "Planning" ? "cool" : "warn"}>
                {f.status}
              </Pill>
            </div>
            <p className="mt-3 text-sm text-white/70">{f.details}</p>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-sm text-white/70">Goal</p>
              <p className="text-white font-semibold">{f.goal}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function SportsPage() {
  return (
    <div>
      <SectionTitle
        icon={Trophy}
        kicker="Sports"
        title="Schedules"
        subtitle="Matchups, locations, and times. Easy for students and parents."
      />
      <div className="space-y-4">
        {sampleSports.map((s) => (
          <GlassCard key={s.id} className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-white font-semibold">{s.sport} • {s.level}</p>
                <p className="mt-1 text-sm text-white/70">{s.matchup}</p>
              </div>
              <Pill tone="warn">{formatDate(s.date)} • {s.time}</Pill>
            </div>
            <p className="mt-3 text-sm text-white/60">{s.location}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div>
      <SectionTitle
        icon={Phone}
        kicker="Contact"
        title="Reach out"
        subtitle="Questions, ideas, issues. Make it easy for people to connect."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-6">
          <p className="text-white font-semibold">Main Office</p>
          <p className="mt-2 text-sm text-white/70 inline-flex items-center gap-2">
            <Phone size={16} /> (555) 555-5555
          </p>
          <p className="mt-2 text-sm text-white/70 inline-flex items-center gap-2">
            <Mail size={16} /> office@school.org
          </p>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2">
          <p className="text-white font-semibold">Send a message</p>
          <p className="mt-2 text-sm text-white/70">
            (Static site tip) You can swap this form to a Google Form link or Formspree later.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-2xl bg-white/5 p-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20" placeholder="Name" />
            <input className="rounded-2xl bg-white/5 p-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20" placeholder="Email" />
            <input className="md:col-span-2 rounded-2xl bg-white/5 p-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20" placeholder="Subject" />
            <textarea className="md:col-span-2 min-h-[120px] rounded-2xl bg-white/5 p-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20" placeholder="Message" />
          </div>

          <button className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90">
            Submit (Demo) <ChevronRight size={16} />
          </button>

          <p className="mt-3 text-xs text-white/50">
            Demo only right now. No backend is connected on GitHub Pages.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

function StorePage({ cart, addToCart }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return sampleProducts;
    return sampleProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.tag.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [q]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div>
      <SectionTitle
        icon={ShoppingBag}
        kicker="Store"
        title="Rockets shop"
        subtitle="Premium-looking merch page. Cart is demo-only until you connect payment."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <Search size={16} className="text-white/70" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            placeholder="Search merch..."
          />
        </div>

        <Pill tone="cool">{cartCount} item(s) in cart</Pill>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <GlassCard key={p.id} className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-white font-semibold">{p.name}</p>
                <p className="mt-1 text-sm text-white/70">{p.description}</p>
              </div>
              <Pill>{p.tag}</Pill>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-white font-semibold">${p.price}</p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(p.id)}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
              >
                Add <Plus size={16} />
              </motion.button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function CartDrawer({ isOpen, onClose, cart, addToCart, removeFromCart }) {
  const items = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = sampleProducts.find((x) => x.id === id);
        return { ...p, qty };
      });
  }, [cart]);

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />

          <motion.div
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/10 bg-black/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <p className="text-white font-semibold">Cart</p>
              <button
                onClick={onClose}
                className="rounded-2xl bg-white/10 p-2 text-white hover:bg-white/15"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              {items.length === 0 ? (
                <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                  <p className="text-white font-semibold">Your cart is empty</p>
                  <p className="mt-2 text-sm text-white/70">
                    Add some Rockets gear and come back.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-semibold">{it.name}</p>
                          <p className="text-sm text-white/70">${it.price} each</p>
                        </div>
                        <Pill>{it.tag}</Pill>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                          <button
                            onClick={() => removeFromCart(it.id)}
                            className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/15"
                          >
                            <Minus size={16} />
                          </button>
                          <p className="w-8 text-center text-white font-semibold">{it.qty}</p>
                          <button
                            onClick={() => addToCart(it.id)}
                            className="rounded-xl bg-white/10 p-2 text-white hover:bg-white/15"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-white font-semibold">
                          ${(it.price * it.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 rounded-3xl bg-white/6 p-5 ring-1 ring-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/70">Subtotal</p>
                      <p className="text-white font-semibold">${subtotal.toFixed(2)}</p>
                    </div>
                    <button className="mt-4 w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black hover:bg-white/90">
                      Checkout (Demo)
                    </button>
                    <p className="mt-2 text-xs text-white/50">
                      Static site demo. For real payments: Stripe Payment Links or Shopify Buy Button.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <div className="mt-14 border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white">
              <Rocket size={18} />
              <p className="font-semibold">{BRAND.schoolName}</p>
            </div>
            <p className="mt-2 text-sm text-white/60 max-w-md">
              Built on GitHub Pages. Clean, premium, and easy to maintain.
            </p>
          </div>

          <div className="grid gap-2 text-sm text-white/60">
            <p className="inline-flex items-center gap-2"><MapPin size={16} /> Auburn, MA</p>
            <p className="inline-flex items-center gap-2"><Mail size={16} /> contact@school.org</p>
            <p className="inline-flex items-center gap-2"><Phone size={16} /> (555) 555-5555</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-white/40">
          © {new Date().getFullYear()} • Rockets Hub • Demo build
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({}); // { productId: qty }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  return (
    <div className="min-h-screen text-white">
      <AuroraBackground />

      <Nav
        page={page}
        setPage={(p) => {
          setCartOpen(false);
          setPage(p);
        }}
        cartCount={cartCount}
        openCart={() => setCartOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-6"
          >
            {page === "home" ? <Hero setPage={setPage} /> : null}
            {page === "calendar" ? <CalendarPage /> : null}
            {page === "fundraisers" ? <FundraisersPage /> : null}
            {page === "sports" ? <SportsPage /> : null}
            {page === "store" ? <StorePage cart={cart} addToCart={addToCart} /> : null}
            {page === "contact" ? <ContactPage /> : null}
          </motion.div>
        </AnimatePresence>

        <Footer />
      </main>

      {/* Tailwind via CDN feel without installing Tailwind:
         We’re using plain classes anyway. But for this to look correct,
         install Tailwind (recommended) OR swap these classes for your own CSS.
      */}
    </div>
  );
}
