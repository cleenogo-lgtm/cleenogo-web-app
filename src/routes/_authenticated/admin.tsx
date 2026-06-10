import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_CONTENT, useSiteContent, type SiteContent, type SitePackage } from "@/lib/site-content";
import { LogOut, Save, Plus, Trash2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم | كلينو قو" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { data: initial, isLoading } = useSiteContent();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initial && !content) setContent(structuredClone(initial));
  }, [initial, content]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setIsOwner(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id)
        .eq("role", "owner")
        .maybeSingle();
      setIsOwner(!!data);
    })();
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("site_content")
      .update({ data: content as any })
      .eq("id", 1);
    setSaving(false);
    if (error) setMsg("خطأ: " + error.message);
    else {
      setMsg("تم الحفظ بنجاح ✓");
      qc.invalidateQueries({ queryKey: ["site_content"] });
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isLoading || !content || isOwner === null) {
    return <div className="min-h-screen grid place-items-center">جاري التحميل...</div>;
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center" dir="rtl">
        <div className="space-y-4 max-w-md">
          <h1 className="text-2xl font-black">غير مصرح</h1>
          <p className="text-muted-foreground">
            حسابك ليس له صلاحية المالك. فقط بريد المالك المحدد يمكنه التعديل.
          </p>
          <div className="flex gap-2 justify-center">
            <button onClick={logout} className="bg-secondary px-4 py-2 rounded-full font-bold">تسجيل خروج</button>
            <Link to="/" className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold">العودة</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30" dir="rtl">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-black">لوحة تحكم المالك</h1>
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-full hover:bg-secondary">
              <ExternalLink className="w-4 h-4" /> عرض الموقع
            </Link>
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-sm disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "جارٍ الحفظ..." : "حفظ كل التغييرات"}
            </button>
            <button onClick={logout} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-full hover:bg-secondary">
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>
        {msg && <div className="container mx-auto px-4 py-2 text-sm">{msg}</div>}
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        <Card title="معلومات التواصل">
          <Field label="رقم الجوال" value={content.contact.phone}
            onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })} />
          <Field label="رقم الواتساب (مع رمز الدولة)" value={content.contact.whatsapp}
            onChange={(v) => setContent({ ...content, contact: { ...content.contact, whatsapp: v } })} />
          <Field label="البريد الإلكتروني" value={content.contact.email}
            onChange={(v) => setContent({ ...content, contact: { ...content.contact, email: v } })} />
        </Card>

        <Card title="القسم الرئيسي (Hero)">
          <Field label="الشارة العلوية" value={content.hero.badge}
            onChange={(v) => setContent({ ...content, hero: { ...content.hero, badge: v } })} />
          <Field label="العنوان (السطر الأول)" value={content.hero.title1}
            onChange={(v) => setContent({ ...content, hero: { ...content.hero, title1: v } })} />
          <Field label="العنوان (السطر الثاني)" value={content.hero.title2}
            onChange={(v) => setContent({ ...content, hero: { ...content.hero, title2: v } })} />
          <Field label="النص التعريفي" textarea value={content.hero.subtitle}
            onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} />
        </Card>

        <Card title="الخدمات" onAdd={() => setContent({
          ...content,
          services: [...content.services, { title: "خدمة جديدة", desc: "وصف" }],
        })}>
          {content.services.map((s, i) => (
            <RowCard key={i} onDelete={() => setContent({
              ...content,
              services: content.services.filter((_, x) => x !== i),
            })}>
              <Field label="العنوان" value={s.title}
                onChange={(v) => { const a = [...content.services]; a[i] = { ...a[i], title: v }; setContent({ ...content, services: a }); }} />
              <Field label="الوصف" textarea value={s.desc}
                onChange={(v) => { const a = [...content.services]; a[i] = { ...a[i], desc: v }; setContent({ ...content, services: a }); }} />
            </RowCard>
          ))}
        </Card>

        <Card title="الباقات والأسعار" onAdd={() => setContent({
          ...content,
          packages: [...content.packages, { title: "باقة جديدة", period: "شهرياً", price: "0", tier: "basic", features: [] }],
        })}>
          {content.packages.map((p, i) => (
            <RowCard key={i} onDelete={() => setContent({
              ...content,
              packages: content.packages.filter((_, x) => x !== i),
            })}>
              <Field label="عنوان الباقة" value={p.title}
                onChange={(v) => updatePkg(content, setContent, i, { title: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="السعر (ر.س)" value={p.price}
                  onChange={(v) => updatePkg(content, setContent, i, { price: v })} />
                <Field label="الفترة" value={p.period}
                  onChange={(v) => updatePkg(content, setContent, i, { period: v })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">المستوى</label>
                <select value={p.tier} onChange={(e) => updatePkg(content, setContent, i, { tier: e.target.value as SitePackage["tier"] })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3">
                  <option value="basic">عادي</option>
                  <option value="popular">الأكثر طلباً</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">المميزات (سطر لكل ميزة)</label>
                <textarea rows={4} value={p.features.join("\n")}
                  onChange={(e) => updatePkg(content, setContent, i, { features: e.target.value.split("\n").filter(Boolean) })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3" />
              </div>
            </RowCard>
          ))}
        </Card>

        <Card title="الأسئلة الشائعة" onAdd={() => setContent({
          ...content,
          faqs: [...content.faqs, { q: "سؤال جديد", a: "إجابة" }],
        })}>
          {content.faqs.map((f, i) => (
            <RowCard key={i} onDelete={() => setContent({
              ...content,
              faqs: content.faqs.filter((_, x) => x !== i),
            })}>
              <Field label="السؤال" value={f.q}
                onChange={(v) => { const a = [...content.faqs]; a[i] = { ...a[i], q: v }; setContent({ ...content, faqs: a }); }} />
              <Field label="الإجابة" textarea value={f.a}
                onChange={(v) => { const a = [...content.faqs]; a[i] = { ...a[i], a: v }; setContent({ ...content, faqs: a }); }} />
            </RowCard>
          ))}
        </Card>

        <div className="flex gap-3 justify-end pb-12">
          <button onClick={() => setContent(structuredClone(initial ?? DEFAULT_CONTENT))}
            className="px-5 py-3 rounded-full bg-secondary font-bold">تراجع</button>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </div>
      </main>
    </div>
  );
}

function updatePkg(content: SiteContent, setContent: (c: SiteContent) => void, i: number, patch: Partial<SitePackage>) {
  const a = [...content.packages];
  a[i] = { ...a[i], ...patch };
  setContent({ ...content, packages: a });
}

function Card({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="inline-flex items-center gap-1 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold">
            <Plus className="w-4 h-4" /> إضافة
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function RowCard({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="relative border border-border rounded-xl p-4 space-y-3 bg-background">
      <button onClick={onDelete} className="absolute top-2 left-2 p-1.5 rounded-full text-red-600 hover:bg-red-50">
        <Trash2 className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
      )}
    </div>
  );
}
