import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";

const OWNER_EMAIL = "cleenogo@gmail.com";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function loginOwner(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return { token: data.session?.access_token, email };
}

export async function verifyOwnerToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { valid: false };
  return { valid: data.user.email === OWNER_EMAIL };
}

export async function saveSiteContent(token: string, content: any) {
  const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: userData, error: authError } = await authedClient.auth.getUser();
  if (authError || !userData.user) throw new Error("Unauthorized");

  const { error } = await authedClient.from("site_content").upsert({ id: 1, data: content });

  if (error) throw new Error(error.message);
  return { ok: true };
}
