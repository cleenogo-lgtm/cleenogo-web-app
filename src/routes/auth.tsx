import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول | كلينو قو" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message ?? "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4" dir="rtl">
      <form onSubmit={submit} className="w-full max-w-md bg-card border border-border rounded-3xl p-8 space-y-5 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black">لوحة تحكم المالك</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "سجّل دخولك للوصول إلى لوحة التحكم" : "أنشئ حساب المالك (cleenogo@gmail.com)"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">كلمة المرور</label>
          <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-full hover:opacity-90 transition disabled:opacity-50">
          {loading ? "..." : mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
        </button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="w-full text-sm text-muted-foreground hover:text-foreground">
          {mode === "login" ? "ليس لديك حساب؟ إنشاء حساب المالك" : "لديك حساب؟ تسجيل الدخول"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">← العودة للموقع</Link>
      </form>
    </div>
  );
}
