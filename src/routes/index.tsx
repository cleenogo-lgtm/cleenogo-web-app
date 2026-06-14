import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-carwash.jpg";
import logoImg from "@/assets/logo.png";
import {
  Phone, Mail, MapPin, MessageCircle, Sparkles, Car, Crown,
  Clock, ShieldCheck, Droplets, Instagram, Send, ChevronDown, Lock,
} from "lucide-react";
import { useSiteContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كلينو قو | غسيل سيارات متنقل احترافي" },
      { name: "description", content: "كلينو قو - خدمة غسيل سيارات متنقلة، باقات شهرية مرنة بأسعار مميزة. اتصل بنا الآن 0503503552." },
      { property: "og:title", content: "كلينو قو | غسيل سيارات متنقل" },
      { property: "og:description", content: "خدمة غسيل سيارات متنقلة بجودة احترافية. نصلك أينما كنت." },
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
  { icon: Car, title: "نصلك أينما كنت", desc: "فريقنا المتنقل يأتي إلى موقعك في الوقت المناسب لك." },
  { icon: Sparkles, title: "جودة احترافية", desc: "مواد متخصصة وأيدي مدربة لإظهار سيارتك بأبهى صورة." },
  { icon: Clock, title: "سرعة في الإنجاز", desc: "نحترم وقتك وننجز الخدمة بكفاءة عالية." },
  { icon: ShieldCheck, title: "ضمان الرضا", desc: "رضاك هو معيار نجاحنا، نلتزم بأعلى معايير الجودة." },
];

const serviceIcons = [Droplets, Sparkles, Crown];

function Landing() {
  const { data } = useSiteContent();
  const c: SiteContent = data ?? DEFAULT_CONTENT;
  return (
    <div className="min-h-screen bg-background text-foreground font-display">
      <Header content={c} />
      <Hero content={c} />
      <About />
      <Features />
      <Services content={c} />
      <Packages content={c} />
      <FAQ content={c} />
      <Contact content={c} />
      <Footer content={c} />
      <FloatingWhatsApp content={c} />
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src={logoImg} alt="كلينو قو" className="h-12 w-auto object-contain" />
    </div>
  );
}

function Header({ content }: { content: SiteContent }) {
  const links = [
    { href: "#about", label: "من نحن" },
    { href: "#services", label: "خدماتنا" },
    { href: "#packages", label: "الباقات" },
    { href: "#faq", label: "الأسئلة" },
    { href: "#contact", label: "تواصل" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-accent transition-colors">{l.label}</a>
          ))}
        </nav>
        <button
          onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بحجز خدمة غسيل سيارة")}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition shadow-[var(--shadow-accent)] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          احجز الآن
        </button>
      </div>
    </header>
  );
}

function Hero({ content }: { content: SiteContent }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[var(--gradient-soft)]" />
      <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center md:text-right">
          <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> {content.hero.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            {content.hero.title1}
            <span className="block bg-gradient-to-l from-accent to-primary bg-clip-text text-transparent">
              {content.hero.title2}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">{content.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a href="#packages" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition shadow-[var(--shadow-brand)]">
              <Car className="w-5 h-5" /> تصفح الباقات
            </a>
            <button onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بحجز موعد")}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition shadow-[var(--shadow-accent)] cursor-pointer">
              <MessageCircle className="w-5 h-5" /> احجز عبر واتساب
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-[var(--gradient-hero)] rounded-3xl opacity-30 blur-2xl" />
          <img
            src={heroImg}
            alt="خدمة غسيل سيارات متنقلة احترافية"
            width={1600} height={1024}
            className="relative rounded-3xl shadow-2xl object-cover w-full aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <SectionTag>من نحن</SectionTag>
        <h2 className="text-3xl md:text-4xl font-black">قصة كلينو قو</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          انطلقنا برؤية بسيطة: أن نوفر لعملائنا وقتهم وجهدهم بخدمة غسيل سيارات احترافية تأتي إليهم.
          نؤمن أن سيارتك تستحق العناية الفائقة دون الحاجة لمغادرة منزلك أو مكتبك.
        </p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        {[
          { title: "رؤيتنا", desc: "أن نكون الخيار الأول لخدمة غسيل السيارات المتنقلة في المملكة." },
          { title: "رسالتنا", desc: "تقديم تجربة عناية بالسيارات تجمع بين الراحة، الاحترافية، والقيمة." },
          { title: "قيمنا", desc: "الجودة، الالتزام بالمواعيد، ورضا العميل قبل كل شيء." },
        ].map((v) => (
          <div key={v.title} className="bg-card rounded-2xl p-6 border border-border hover:shadow-[var(--shadow-brand)] transition">
            <h3 className="font-black text-xl mb-2 text-accent">{v.title}</h3>
            <p className="text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-16 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <SectionTag>لماذا كلينو قو</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black">مميزات تجعلنا الخيار الأفضل</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-2xl p-6 border border-border text-center hover:-translate-y-1 transition">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--gradient-hero)] grid place-items-center mb-4 shadow-[var(--shadow-brand)]">
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ content }: { content: SiteContent }) {
  return (
    <section id="services" className="py-20 container mx-auto px-4">
      <div className="text-center mb-12 space-y-3">
        <SectionTag>خدماتنا</SectionTag>
        <h2 className="text-3xl md:text-4xl font-black">عناية شاملة لكل أنواع السيارات</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {content.services.map((s, i) => {
          const Icon = serviceIcons[i % serviceIcons.length];
          const accentIdx = i === content.services.length - 1;
          return (
            <div key={i} className="relative bg-card rounded-3xl p-8 border border-border overflow-hidden group">
              <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-30 ${accentIdx ? "bg-accent" : "bg-primary"}`} />
              <Icon className={`w-10 h-10 mb-4 ${accentIdx ? "text-accent" : "text-primary"}`} />
              <h3 className="font-black text-2xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Packages({ content }: { content: SiteContent }) {
  return (
    <section id="packages" className="py-20 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <SectionTag>الباقات والأسعار</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black">اختر الباقة المناسبة لك</h2>
          <p className="text-muted-foreground">جميع الأسعار بالريال السعودي • يمكنك إلغاء أو تعديل باقتك في أي وقت</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.packages.map((p, i) => {
            const isPopular = p.tier === "popular";
            const isVip = p.tier === "vip";
            return (
              <div key={i}
                className={`relative rounded-3xl p-8 border-2 transition hover:-translate-y-1 ${
                  isPopular ? "border-accent bg-card shadow-[var(--shadow-accent)]" :
                  isVip ? "border-accent bg-white shadow-[var(--shadow-accent)]" :
                  "border-border bg-card"
                }`}>
                {isPopular && (
                  <span className="absolute -top-3 right-6 bg-accent text-accent-foreground text-xs font-black px-3 py-1 rounded-full">
                    الأكثر طلباً
                  </span>
                )}
                <h3 className="font-black text-xl mb-1">{p.title}</h3>
                <p className="text-sm mb-5 text-muted-foreground">{p.period}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black">{p.price}</span>
                  <span className="mr-2 text-muted-foreground">ر.س</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 ${isPopular ? "text-accent" : "text-primary"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openWhatsApp(content.contact.whatsapp, `مرحباً، أرغب بالاشتراك في باقة: ${p.title}`)}
                  className={`block w-full text-center font-bold py-3 rounded-full transition cursor-pointer ${
                    isVip ? "bg-foreground text-background hover:opacity-90" :
                    isPopular ? "bg-accent text-accent-foreground hover:opacity-90" :
                    "bg-primary text-primary-foreground hover:opacity-90"
                  }`}>
                  اشترك الآن
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQ({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 container mx-auto px-4">
      <div className="text-center mb-12 space-y-3">
        <SectionTag>الأسئلة الشائعة</SectionTag>
        <h2 className="text-3xl md:text-4xl font-black">إجابات لأكثر استفساراتكم</h2>
      </div>
      <div className="max-w-3xl mx-auto space-y-3">
        {content.faqs.map((f, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-right font-bold hover:bg-secondary/40 transition"
            >
              <span>{f.q}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="px-5 pb-5 text-muted-foreground">{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ content }: { content: SiteContent }) {
  const [form, setForm] = useState({ name: "", phone: "", msg: "" });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `الاسم: ${form.name}\nالجوال: ${form.phone}\nالرسالة: ${form.msg}`;
    openWhatsApp(content.contact.whatsapp, msg);
  };
  return (
    <section id="contact" className="py-20 bg-secondary/40">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionTag>تواصل معنا</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black">نحن هنا لخدمتك</h2>
          <p className="text-muted-foreground">يسعدنا تواصلك معنا في أي وقت، فريقنا جاهز للرد على استفساراتك وحجز موعدك.</p>
          <div className="space-y-3">
            <ContactItem icon={Phone} label="الجوال" value={content.contact.phone} href={`tel:${content.contact.phone}`} />
            <ContactItem icon={MessageCircle} label="واتساب" value={content.contact.phone} href={waLink(content.contact.whatsapp, "مرحباً")} />
            <ContactItem icon={Mail} label="البريد الإلكتروني" value={content.contact.email} href={`mailto:${content.contact.email}`} />
            <ContactItem icon={MapPin} label="منطقة الخدمة" value="المملكة العربية السعودية" />
          </div>
        </div>
        <form onSubmit={onSubmit} className="bg-card rounded-3xl p-6 md:p-8 border border-border space-y-4 shadow-[var(--shadow-brand)]">
          <h3 className="font-black text-xl">أرسل لنا رسالة</h3>
          <Input label="الاسم" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="رقم الجوال" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <div>
            <label className="block text-sm font-bold mb-1.5">رسالتك</label>
            <textarea required rows={4} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-bold py-3 rounded-full hover:opacity-90 transition shadow-[var(--shadow-accent)]">
            <Send className="w-4 h-4" /> إرسال عبر واتساب
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-2 inline-block">
            <img src={logoImg} alt="كلينو قو" className="h-12 w-auto object-contain" />
          </div>
          <p className="text-background/70 text-sm">خدمة غسيل سيارات متنقلة احترافية تصلك أينما كنت.</p>
        </div>
        <div>
          <h4 className="font-black mb-3">روابط سريعة</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><a href="#about" className="hover:text-primary">من نحن</a></li>
            <li><a href="#services" className="hover:text-primary">خدماتنا</a></li>
            <li><a href="#packages" className="hover:text-primary">الباقات</a></li>
            <li><a href="#contact" className="hover:text-primary">تواصل معنا</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black mb-3">تابعنا</h4>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "https://snapchat.com", icon: SnapchatIcon, label: "Snapchat" },
              { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
              { href: "https://tiktok.com", icon: TikTokIcon, label: "TikTok" },
              { href: "https://x.com", icon: XIcon, label: "X" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                className="w-10 h-10 grid place-items-center rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition">
                <s.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <p className="text-xs text-background/50 mt-6">
            © {new Date().getFullYear()} كلينو قو. جميع الحقوق محفوظة.
            {" • "}
            <Link to="/auth" className="inline-flex items-center gap-1 hover:text-primary">
              <Lock className="w-3 h-3" /> دخول المالك
            </Link>
          </p>
          {/* unused contact in footer (kept to silence TS unused warning) */}
          <span className="hidden">{content.contact.email}</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp({ content }: { content: SiteContent }) {
  return (
    <button onClick={() => openWhatsApp(content.contact.whatsapp, "مرحباً، أرغب بالاستفسار")}
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 grid place-items-center rounded-full bg-accent text-accent-foreground shadow-[var(--shadow-accent)] hover:scale-110 transition cursor-pointer">
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return <span className="inline-block bg-primary/20 text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">{children}</span>;
}

function ContactItem({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary transition">
      <div className="w-10 h-10 rounded-xl bg-primary/20 grid place-items-center">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{content}</a> : content;
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">{label}</label>
      <input required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.92a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z"/>
    </svg>
  );
}
function SnapchatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9v3.4c0 1-.5 1.6-1.5 1.6-.5 0-1-.2-1.6-.2-.9 0-1.6.3-1.6 1.1 0 1.4 2 2.1 3.2 2.5.8.3 1 .8.6 1.7-1 2.4-2.9 4.3-5.4 5.2-1 .4-1.6 1.2-1.1 2.1 1 2.3 4.8 3.1 7.5 3.3.2.8.3 1.5.5 2.1.3.8 1.3 1 2.1.6.9-.4 2.1-.5 3.3-.5 2.2 0 3.5 1.3 6.4 3.3 1.4.8 2.9 1.2 4.2 1.2s2.8-.4 4.2-1.2c2.9-2 4.2-3.3 6.4-3.3 1.2 0 2.4.1 3.3.5.8.4 1.8.2 2.1-.6.2-.6.3-1.3.5-2.1 2.7-.2 6.5-1 7.5-3.3.5-.9-.1-1.7-1.1-2.1-2.5-.9-4.4-2.8-5.4-5.2-.4-.9-.2-1.4.6-1.7 1.2-.4 3.2-1.1 3.2-2.5 0-.8-.7-1.1-1.6-1.1-.6 0-1.1.2-1.6.2-1 0-1.5-.6-1.5-1.6V9c0-3.87-3.13-7-7-7z"/>
    </svg>
  );
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.844l-5.36-7.01L4 22H.744l8.02-9.16L1.5 2h7.02l4.84 6.39L18.244 2zm-1.2 18h1.88L7.04 4H5.06l11.984 16z"/>
    </svg>
  );
}
