import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoImg from "@/assets/logo.png";
// ─── IMAGE ASSETS NEEDED ────────────────────────────────────────────────────
// Add the following images to your src/assets/ folder:
//   hero-carwash.jpg        – man in black uniform washing a dark luxury car (night, wet, dramatic lighting)
//   car-exterior.jpg        – shiny car exterior being washed (water droplets)
//   car-interior.jpg        – clean leather interior with steering wheel closeup
//   car-vip.jpg             – luxury dark-tinted car detail shot
//   car-pkg-4.jpg           – dark luxury car for 4-wash package card
//   car-pkg-8.jpg           – dark luxury car for 8-wash package card
//   worker-closeup.jpg      – worker hand holding green microfibre cloth on car (for closing banner)
// ────────────────────────────────────────────────────────────────────────────
import heroImg from "@/assets/hero-carwash.jpg";
import carExteriorImg from "@/assets/car-exterior.jpg";
import carInteriorImg from "@/assets/car-interior.jpg";
import carVipImg from "@/assets/car-vip.jpg";
import carPkg4Img from "@/assets/car-pkg-4.jpg";
import carPkg8Img from "@/assets/car-pkg-8.jpg";
import workerCloseupImg from "@/assets/worker-closeup.jpg";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Car,
  Crown,
  Clock,
  ShieldCheck,
  Droplets,
  Instagram,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle2,
  Gauge,
  Star,
  Timer,
  Users,
  Award,
  Headset,
} from "lucide-react";
import { useSiteContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كلينو قو | غسيل سيارات متنقل احترافي" },
      {
        name: "description",
        content:
          "كلينو قو - خدمة غسيل سيارات متنقلة، باقات شهرية مرنة بأسعار مميزة. اتصل بنا الآن 0503503552.",
      },
      { property: "og:title", content: "كلينو قو | غسيل سيارات متنقل" },
      {
        property: "og:description",
        content: "خدمة غسيل سيارات متنقلة بجودة احترافية. نصلك أينما كنت.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const waLink = (whatsapp: string, msg: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
const openWhatsApp = (whatsapp: string, msg: string) => {
  window.open(waLink(whatsapp, msg), "_blank", "noopener,noreferrer");
};

const features = [
  {
    icon: Gauge,
    title: "نصل إليك في دقائق",
    desc: "خدمة سريعة تأتي إلى موقعك في الوقت المناسب لك.",
  },
  { icon: Timer, title: "توفير الوقت", desc: "خدمة سريعة ومريحة دون مغادرة منزلك أو مكتبك." },
  { icon: Award, title: "جودة عالية", desc: "نتائج احترافية تدوم لمعة طويلة." },
  { icon: ShieldCheck, title: "مواد آمنة", desc: "منتجات آمنة على سيارتك وصحتك بالكامل." },
  { icon: Users, title: "فريق محترف", desc: "مدرب ومؤهل على مستوى عالٍ من الاحترافية." },
  { icon: Headset, title: "خدمة عملاء", desc: "متابعة ودعم على مدار الساعة لراحتك." },
];

const serviceAreas = ["الصفا", "العزيزية", "الزهرية", "الروضة"];

const testimonials = [
  {
    name: "أحمد الحربي",
    text: "خدمة ممتازة وسريعة، والسيارة طلعت نظيفة جداً من أنسب أوقات التعامل.",
    rating: 5,
  },
  {
    name: "خالد المالكي",
    text: "الفريق محترف جداً، والنتائج فوق توقعاتي، أسعار مناسبة جداً.",
    rating: 5,
  },
  {
    name: "سارة الغامدي",
    text: "غسيل احترافي وتفاصيل دقيقة، وتعامل راقٍ من البداية للنهاية.",
    rating: 5,
  },
];

function useCountdown(hours = 30 * 24 + 12) {
  const [startTime, setStartTime] = useState(Date.now());
  const [remaining, setRemaining] = useState(hours * 3600);

  useEffect(() => {
    setStartTime(Date.now());
    setRemaining(hours * 3600);
  }, [hours]);

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newRemaining = Math.max(0, hours * 3600 - elapsed);
      setRemaining(newRemaining);
    }, 1000);
    return () => clearInterval(id);
  }, [hours, startTime]);

  const days = Math.floor(remaining / 86400);
  const hrs = Math.floor((remaining % 86400) / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;
  return { days, hrs, mins, secs };
}

function Landing() {
  const { data } = useSiteContent();
  const c: SiteContent = data ?? DEFAULT_CONTENT;
  return (
    <div className="min-h-screen bg-background text-foreground font-display" dir="rtl">
      <Header content={c} />
      <Hero content={c} />
      <ServiceHighlights content={c} />
      <Subscriptions content={c} />
      <WhyChooseUs />
      <ServiceAreasAndTestimonials />
      <FAQ content={c} />
      <ClosingBanner content={c} />
      <Footer content={c} />
      <FloatingWhatsApp content={c} />
    </div>
  );
}

/* ─── HEADER (full black) ──────────────────────────────────────────────── */
function Header({ content }: { content: SiteContent }) {
  const links = [
    { href: "#", label: "الرئيسية" },
    { href: "#services", label: "خدماتنا" },
    { href: "#packages", label: "الاشتراكات" },
    { href: "#areas", label: "مناطق الخدمة" },
    { href: "#testimonials", label: "آراء العملاء" },
    { href: "#faq", label: "الأسئلة الشائعة" },
    { href: "#contact", label: "تواصل معنا" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="كلينو قو" className="h-10 w-auto object-contain" />
        </div>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-white/80 hover:text-[#00b4c8] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${content.contact.phone}`}
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-[#00b4c8] transition"
          >
            <Phone className="w-4 h-4 text-[#00b4c8]" /> {content.contact.phone}
          </a>
          <button
            onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بحجز خدمة")}
            className="inline-flex items-center gap-2 bg-[#ff6a1a] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#e55a0d] transition"
          >
            <MessageCircle className="w-4 h-4" /> احجز عبر واتساب
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── HERO (full black background) ────────────────────────────────────── */
function Hero({ content }: { content: SiteContent }) {
  const { days, hrs, mins, secs } = useCountdown(content.offer.countdownHours);
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 grid gap-10 lg:grid-cols-[1fr_auto] items-center">
        {/* Left text side */}
        <div className="space-y-6 text-right max-w-xl">
          <span className="inline-block border border-[#00b4c8]/50 text-[#00b4c8] px-4 py-1.5 rounded-full text-xs font-bold">
            خدمة غسيل سيارات متنقل
          </span>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            {content.hero.title1}
            <br />
            <span className="text-[#00b4c8]">{content.hero.title2}</span>
          </h1>
          <p className="text-white/70 text-base leading-relaxed">{content.hero.subtitle}</p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { icon: Clock, label: "نصل إليك خلال دقائق" },
              { icon: ShieldCheck, label: "مواد آمنة" },
              { icon: Users, label: "فريق محترف" },
              { icon: Car, label: "بدون مغادرة منزلك" },
            ].map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/80"
              >
                <f.icon className="w-4 h-4 text-[#00b4c8]" /> {f.label}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بحجز موعد")}
              className="inline-flex items-center gap-2 bg-[#ff6a1a] text-white px-6 py-3.5 rounded-md text-sm font-bold hover:bg-[#e55a0d] transition shadow-lg"
            >
              <MessageCircle className="w-5 h-5" /> احجز الآن عبر واتساب
            </button>
            <a
              href={`tel:${content.contact.phone}`}
              className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-md text-sm font-bold hover:bg-white/10 transition"
            >
              <Phone className="w-4 h-4" /> تواصل معنا
            </a>
          </div>
        </div>

        {/* Right: Offer card + countdown */}
        <div className="flex flex-col gap-4 min-w-[260px] max-w-[300px]">
          {/* Offer card */}
          <div className="bg-gray-100 rounded-2xl p-5 text-[#0a0a0a] shadow-2xl text-right">
            <p className="text-[0.6rem] font-black uppercase tracking-widest text-[#ff6a1a] mb-1">
              {content.offer.badge}
            </p>
            <p className="text-5xl font-black text-[#00b4c8] leading-none">
              {content.offer.discount}
            </p>
            <p className="font-bold text-sm mt-1">{content.offer.description}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {content.offer.priceIntro}{" "}
              <span className="font-black text-[#ff6a1a]">
                {content.offer.price} {content.offer.priceUnit}
              </span>
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-gray-100 border border-white/10 rounded-2xl p-4 text-center shadow-2xl">
            <p className="text-[0.6rem] font-bold text-gray-600 mb-3">
              {content.offer.countdownLabel}
            </p>
            <div className="flex items-center justify-center gap-2">
              <TimeBlock value={days} label="يوم" />
              <span className="text-gray-400 text-lg font-black">:</span>
              <TimeBlock value={hrs} label="ساعة" />
              <span className="text-gray-400 text-lg font-black">:</span>
              <TimeBlock value={mins} label="دقيقة" />
              <span className="text-gray-400 text-lg font-black">:</span>
              <TimeBlock value={secs} label="ثانية" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black text-[#00b4c8] tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[0.55rem] text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

/* ─── SERVICES ──────────────────────────────────────────────────────────── */
function ServiceHighlights({ content }: { content: SiteContent }) {
  const serviceImages = [carExteriorImg, carInteriorImg, carVipImg];
  const serviceIcons = [Car, Droplets, Crown];
  const servicePrices = ["15", "20", "23"];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <SectionDivider label="خدماتنا" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {content.services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <div
                key={service.title}
                className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={serviceImages[index % serviceImages.length]}
                    alt={service.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Icon badge */}
                  <div className="absolute top-3 right-3 h-10 w-10 rounded-xl bg-[#00b4c8] text-white grid place-items-center shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-5 text-right">
                  <h3 className="text-lg font-black mb-1">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    {service.desc}
                  </p>
                  <p className="text-sm font-bold text-foreground/70 mb-3">
                    يبدأ من{" "}
                    <span className="text-[#ff6a1a] font-black text-base">
                      {servicePrices[index]} ريال
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      openWhatsApp(
                        content.contact.whatsapp,
                        `مرحباً، أرغب بحجز خدمة ${service.title}`,
                      )
                    }
                    className="w-full border border-[#00b4c8] text-[#00b4c8] py-2 rounded-md text-sm font-bold hover:bg-[#00b4c8] hover:text-white transition"
                  >
                    احجز الآن
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── SUBSCRIPTIONS (only 2 packages) ──────────────────────────────────── */
function Subscriptions({ content }: { content: SiteContent }) {
  const subscriptions = content.packages.slice(0, 2);
  const images = [carPkg4Img, carPkg8Img];

  return (
    <section id="packages" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <SectionDivider label="الاشتراكات" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {subscriptions.map((pkg, index) => (
            <div
              key={pkg.title}
              className={`rounded-[2rem] overflow-hidden border-2 bg-card transition hover:-translate-y-1 ${
                pkg.tier === "popular"
                  ? "border-[#ff6a1a] shadow-[0_0_30px_rgba(255,106,26,0.22)]"
                  : "border-[#00b4c8] shadow-[0_0_24px_rgba(0,180,200,0.16)]"
              } min-h-[420px] md:min-h-[520px]`}
            >
              <div className="h-48 md:h-72 overflow-hidden bg-[#111]">
                <img
                  src={images[index]}
                  alt={pkg.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="p-4 md:p-8 text-right space-y-4 md:space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      الاشتراك
                    </p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-black">{pkg.title}</h3>
                  </div>
                  <div
                    className={`rounded-full px-4 py-2 text-xs font-black uppercase ${
                      pkg.tier === "popular"
                        ? "bg-[#ff6a1a]/10 text-[#ff6a1a]"
                        : "bg-[#00b4c8]/10 text-[#00b4c8]"
                    }`}
                  >
                    {pkg.tier === "popular" ? "الأكثر طلباً" : "اشتراك"}
                  </div>
                </div>

                <div className="space-y-3">
                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start justify-end gap-2 md:gap-3 text-xs md:text-sm text-foreground/80"
                    >
                      <span className="mt-1 inline-flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-[#00b4c8]/10 text-[#00b4c8] text-xs">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end justify-between gap-4 flex-col-reverse md:flex-row">
                  <div className="text-right w-full md:w-auto">
                    <p className="text-xs text-muted-foreground">السعر</p>
                    <p className="text-3xl md:text-4xl font-black text-[#ff6a1a] leading-none">
                      {pkg.price}
                    </p>
                    <span className="text-sm text-muted-foreground">ريال</span>
                  </div>
                  <button
                    onClick={() =>
                      openWhatsApp(
                        content.contact.whatsapp,
                        `مرحباً، أرغب بالاشتراك في باقة ${pkg.title}`,
                      )
                    }
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ff6a1a] px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold text-white shadow-lg hover:bg-[#e55a0d] transition"
                  >
                    <MessageCircle className="w-4 h-4" /> احجز الآن
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY CHOOSE US ─────────────────────────────────────────────────────── */
function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <SectionDivider label="لماذا كلينو قو؟" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:border-[#00b4c8]/50 hover:shadow-lg"
            >
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00b4c8]/10 text-[#00b4c8]">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-black mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICE AREAS + TESTIMONIALS ─────────────────────────────────────── */
function ServiceAreasAndTestimonials() {
  const [active, setActive] = useState(0);
  const next = () => setActive((p) => (p + 1) % testimonials.length);
  const prev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-2">
        <div id="areas">
          <SectionDivider label="مناطق الخدمة" align="right" />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-3">
            {serviceAreas.map((area) => (
              <div
                key={area}
                className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#00b4c8]" />
                <span className="font-bold">{area}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#00b4c8]/10 px-4 py-3 flex items-center gap-2 text-sm font-bold text-[#00b4c8]">
            <MapPin className="w-4 h-4" /> تغطية مناطق أكثر قريباً
          </div>
        </div>

        <div id="testimonials">
          <SectionDivider label="آراء العملاء" align="right" />
          <div className="mt-6 rounded-2xl border border-border bg-card p-7 relative">
            <div className="flex items-center gap-1 mb-4 justify-end">
              {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#ff6a1a] text-[#ff6a1a]" />
              ))}
            </div>
            <p className="text-foreground/90 leading-relaxed min-h-[4.5rem] text-right">
              {testimonials[active].text}
            </p>
            <p className="mt-4 font-black text-[#00b4c8] text-right">{testimonials[active].name}</p>
            <div className="mt-5 flex items-center justify-start gap-2">
              <button
                onClick={next}
                aria-label="التالي"
                className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={prev}
                aria-label="السابق"
                className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────────── */
function FAQ({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 container mx-auto px-4">
      <div className="text-center mb-12">
        <SectionDivider label="الأسئلة الشائعة" />
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {content.faqs.map((f, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-right font-bold hover:bg-secondary/40 transition"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
              <span>{f.q}</span>
            </button>
            {open === i && <div className="px-5 pb-5 text-muted-foreground text-right">{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── CLOSING BANNER ────────────────────────────────────────────────────── */
function ClosingBanner({ content }: { content: SiteContent }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] text-white grid md:grid-cols-2 min-h-[220px]">
          {/* Text side */}
          <div className="relative z-10 p-10 md:p-14 flex flex-col justify-center text-right space-y-4">
            <h2 className="text-3xl font-black md:text-4xl">لماذا تنتظر؟</h2>
            <p className="text-white/70">خصم 50% لفترة محدودة، احجز الآن وغسّل سيارتك.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بحجز موعد")}
                className="inline-flex items-center gap-2 bg-[#ff6a1a] text-white px-6 py-3 rounded-md text-sm font-bold hover:bg-[#e55a0d] transition"
              >
                <MessageCircle className="w-5 h-5" /> احجز الآن عبر واتساب
              </button>
            </div>
            <p className="font-black text-xl text-[#00b4c8]">{content.contact.phone}</p>
          </div>
          {/* Image side */}
          <div className="relative hidden md:block">
            <img
              src={workerCloseupImg}
              alt="غسيل سيارات"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */
function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="bg-[#0a0a0a] text-white py-14">
      <div className="container mx-auto px-4 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <img src={logoImg} alt="كلينو قو" className="h-11 w-auto object-contain" />
          <p className="text-white/60 text-sm leading-relaxed">
            خدمة غسيل سيارات متنقلة احترافية تصلك أينما كنت.
          </p>
          <div className="flex gap-3 pt-2">
            {[
              { href: "https://snapchat.com/t/ip6QmNDg", icon: SnapchatIcon, label: "Snapchat" },
              { href: "https://www.instagram.com/cleenogo", icon: Instagram, label: "Instagram" },
              { href: "https://www.tiktok.com/@cleenogo1", icon: TikTokIcon, label: "TikTok" },
              { href: "https://x.com/cleenogo", icon: XIcon, label: "X" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-[#00b4c8] transition"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="text-right">
          <h4 className="font-black mb-4">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>
              <a href="#" className="hover:text-[#00b4c8] transition">
                الرئيسية
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#00b4c8] transition">
                خدماتنا
              </a>
            </li>
            <li>
              <a href="#packages" className="hover:text-[#00b4c8] transition">
                الاشتراكات
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#00b4c8] transition">
                تواصل معنا
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[#00b4c8] transition">
                الأسئلة الشائعة
              </a>
            </li>
          </ul>
        </div>

        <div className="text-right">
          <h4 className="font-black mb-4">خدماتنا</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li>غسيل خارجي</li>
            <li>غسيل داخلي وخارجي</li>
            <li>VIP</li>
          </ul>
        </div>

        <div className="text-right">
          <h4 className="font-black mb-4">مناطق الخدمة</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            {serviceAreas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 text-sm text-white/60">
            <p className="font-black text-white">تواصل معنا</p>
            <a
              href={`tel:${content.contact.phone}`}
              className="flex items-center gap-1.5 hover:text-[#00b4c8] transition justify-end"
            >
              {content.contact.phone} <Phone className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:${content.contact.email}`}
              className="flex items-center gap-1.5 hover:text-[#00b4c8] transition justify-end"
            >
              {content.contact.email} <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
        <p>جميع الحقوق محفوظة © كلينو قو {new Date().getFullYear()}</p>
        <Link to="/auth" className="inline-flex items-center gap-1 hover:text-[#00b4c8] transition">
          <Lock className="w-3 h-3" /> دخول المالك
        </Link>
      </div>
    </footer>
  );
}

/* ─── FLOATING WHATSAPP ─────────────────────────────────────────────────── */
function FloatingWhatsApp({ content }: { content: SiteContent }) {
  return (
    <button
      onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بالاستفسار")}
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 grid place-items-center rounded-full bg-[#ff6a1a] text-white shadow-lg hover:scale-110 transition cursor-pointer"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */
function SectionDivider({
  label,
  align = "center",
}: {
  label: string;
  align?: "center" | "right";
}) {
  return (
    <div
      className={`flex items-center gap-3 ${align === "center" ? "justify-center" : "justify-end"}`}
    >
      <div className="h-px w-12 bg-[#00b4c8]" />
      <span className="text-xl font-black">{label}</span>
      <div className="h-px w-12 bg-[#00b4c8]" />
    </div>
  );
}

/* ─── SVG ICONS ─────────────────────────────────────────────────────────── */
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.92a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}
function SnapchatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 .17.01.33.03.5-.32.18-.65.35-.97.56-.47.32-.4 1.03.1 1.28.24.1.5.16.76.16.3 0 .6-.08.9-.2.08-.03.17-.07.25-.1.12.9.37 1.74.73 2.52-.35.18-.69.38-1.03.6-.45.32-.42.97.06 1.25.3.2.65.3 1 .3.23 0 .47-.05.7-.13.17 1.54.4 2.95.7 4.06.18.68.63 1.2 1.28 1.42.46.15.95.22 1.44.22s.98-.07 1.44-.22c.65-.22 1.1-.74 1.28-1.42.3-1.11.53-2.52.7-4.06.23.08.47.13.7.13.35 0 .7-.1 1-.3.48-.28.5-.93.06-1.25-.34-.22-.68-.42-1.03-.6.36-.78.61-1.62.73-2.52.08.03.17.07.25.1.3.12.6.2.9.2.26 0 .52-.06.76-.16.5-.25.57-.96.1-1.28-.32-.21-.65-.38-.97-.56.02-.17.03-.33.03-.5 0-3.87-3.13-7-7-7z" />
    </svg>
  );
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.844l-5.36-7.01L4 22H.744l8.02-9.16L1.5 2h7.02l4.84 6.39L18.244 2zm-1.2 18h1.88L7.04 4H5.06l11.984 16z" />
    </svg>
  );
}
