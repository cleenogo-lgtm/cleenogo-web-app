import { supabase } from "@/integrations/supabase/client";

const OWNER_EMAIL = "cleenogo@gmail.com";

export async function loginOwner(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error("بيانات الدخول غير صحيحة");
  return { token: data.session?.access_token, email };
}

export async function verifyOwnerToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { valid: false };
  return { valid: data.user.email === OWNER_EMAIL };
}

export async function saveSiteContent(token: string, content: any) {
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("site_content")
    .upsert({ id: 1, data: content });

  if (error) throw new Error(error.message);
  return { ok: true };
}