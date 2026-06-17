import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteService = { title: string; desc: string };
export type SitePackage = {
  title: string;
  period: string;
  price: string;
  tier: "basic" | "popular" | "vip";
  features: string[];
};
export type SiteFaq = { q: string; a: string };
export type SiteOffer = {
  badge: string;
  discount: string;
  description: string;
  priceIntro: string;
  price: string;
  priceUnit: string;
  countdownLabel: string;
  // countdownHours: number;
  // countdownStartTime: number; // Unix timestamp in ms when countdown was started
  countdownEndTime: number;
};

export type SiteContent = {
  contact: { phone: string; whatsapp: string; email: string };
  hero: { badge: string; title1: string; title2: string; subtitle: string };
  offer: SiteOffer;
  services: SiteService[];
  packages: SitePackage[];
  faqs: SiteFaq[];
};

export const DEFAULT_CONTENT: SiteContent = {
  contact: { phone: "0503503552", whatsapp: "966503503552", email: "cleenogo@gmail.com" },
  hero: {
    badge: "خدمة متنقلة • على مدار الأسبوع",
    title1: "سيارتك تلمع",
    title2: "أينما كنت",
    subtitle:
      "كلينو قو - خدمة غسيل سيارات متنقلة احترافية. فريق مدرب، مواد عالية الجودة، وباقات مرنة تناسب احتياجاتك.",
  },
  offer: {
    badge: "عرض الافتتاح",
    discount: "50%",
    description: "خصم على جميع الباقات",
    priceIntro: "يبدأ السعر من",
    price: "15",
    priceUnit: "ريال",
    countdownLabel: "ينتهي العرض خلال:",
    // countdownHours: 36,
    // countdownStartTime: 0,
    countdownEndTime: Date.now() + 36 * 60 * 60 * 1000,
  },
  services: [
    { title: "الغسيل الخارجي", desc: "غسيل شامل للهيكل الخارجي مع تلميع الإطارات والزجاج." },
    {
      title: "الغسيل الداخلي والخارجي",
      desc: "تنظيف متكامل داخلياً وخارجياً يشمل المقاعد والأرضيات.",
    },
    { title: "خدمة VIP", desc: "تجربة فاخرة تشمل تلميع متقدم، تعطير، وعناية كاملة بالتفاصيل." },
  ],
  packages: [
    {
      title: "4 غسلات",
      period: "شهرياً",
      price: "199",
      tier: "basic",
      features: ["غسيل خارجي شامل", "تلميع الإطارات", "تنظيف الزجاج"],
    },
    {
      title: "8 غسلات",
      period: "كل 3 أشهر",
      price: "349",
      tier: "popular",
      features: ["تنظيف داخلي وخارجي", "تعطير السيارة", "تنظيف شامل"],
    },
    {
      title: "4 غسلات VIP",
      period: "شهرياً",
      price: "599",
      tier: "vip",
      features: ["تجربة VIP كاملة", "تلميع متقدم", "عناية بالتفاصيل"],
    },
    {
      title: "8 غسلات خارجي",
      period: "كل 3 أشهر",
      price: "369",
      tier: "basic",
      features: ["توفير 7%", "مرونة في المواعيد", "جودة ثابتة"],
    },
    {
      title: "8 غسلات داخلي وخارجي",
      period: "كل 3 أشهر",
      price: "649",
      tier: "popular",
      features: ["توفير 8%", "تنظيف داخلي كامل", "تعطير في كل زيارة"],
    },
    {
      title: "8 غسلات VIP",
      period: "كل 3 أشهر",
      price: "1099",
      tier: "vip",
      features: ["توفير 9%", "تجربة فاخرة دائمة", "أولوية في الحجز"],
    },
  ],
  faqs: [
    {
      q: "كيف يمكنني الحجز؟",
      a: "يمكنك الحجز عبر الضغط على زر (احجز الآن) أو التواصل معنا مباشرة على الواتساب أو الاتصال على الرقم 0503503552.",
    },
    {
      q: "ما هي مناطق الخدمة؟",
      a: "نقدم خدماتنا في معظم أحياء المدينة، تواصل معنا للتأكد من توفر الخدمة في موقعك.",
    },
    {
      q: "ما هي طرق الدفع المتاحة؟",
      a: "نقبل الدفع النقدي، التحويل البنكي، وعبر تطبيقات الدفع الإلكتروني.",
    },
    {
      q: "كم تستغرق عملية الغسيل؟",
      a: "تتراوح المدة بين 20-45 دقيقة حسب نوع الباقة والخدمة المختارة.",
    },
    {
      q: "هل أحتاج لتوفير ماء أو كهرباء؟",
      a: "لا، فريقنا يأتي بمعداته المتكاملة بما فيها الماء والكهرباء.",
    },
  ],
};

export async function fetchSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_CONTENT;
  return { ...DEFAULT_CONTENT, ...(data.data as SiteContent) };
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site_content"],
    queryFn: fetchSiteContent,
    staleTime: 30_000,
  });
}
