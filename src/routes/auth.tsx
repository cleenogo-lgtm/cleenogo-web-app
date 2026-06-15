import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginOwner } from "@/lib/owner-auth.functions";
import { setOwnerToken, getOwnerToken, isTokenLikelyValid } from "@/lib/owner-session";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("cleenogo@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (typeof window !== "undefined" && isTokenLikelyValid(getOwnerToken())) {
    queueMicrotask(() => navigate({ to: "/admin" }));
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await loginOwner(email, password);
      setOwnerToken(res.token);
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err?.message ?? "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4" dir="rtl">
      <form onSubmit={submit} className="w-full max-w-md bg-card border border-border rounded-3xl p-8 space-y-5 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black">لوحة تحكم المالك</h1>
          <p className="text-sm text-muted-foreground">سجّل دخولك للوصول إلى لوحة التحكم</p>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">كلمة المرور</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-full hover:opacity-90 transition disabled:opacity-50">
          {loading ? "..." : "تسجيل الدخول"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">← العودة للموقع</Link>
      </form>
    </div>
  );
}
