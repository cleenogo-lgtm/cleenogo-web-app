
-- Roles
CREATE TYPE public.app_role AS ENUM ('owner', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-grant 'owner' role on signup for the configured owner email
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'cleenogo@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'owner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Site content singleton
CREATE TABLE public.site_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT UPDATE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Only owners can update site content" ON public.site_content
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

CREATE OR REPLACE FUNCTION public.touch_site_content_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.touch_site_content_updated_at();

-- Seed initial content
INSERT INTO public.site_content (id, data) VALUES (1, '{
  "contact": {
    "phone": "0503503552",
    "whatsapp": "966503503552",
    "email": "cleenogo@gmail.com"
  },
  "hero": {
    "badge": "خدمة متنقلة • على مدار الأسبوع",
    "title1": "سيارتك تلمع",
    "title2": "أينما كنت",
    "subtitle": "كلينو قو - خدمة غسيل سيارات متنقلة احترافية. فريق مدرب، مواد عالية الجودة، وباقات مرنة تناسب احتياجاتك."
  },
  "services": [
    {"title": "الغسيل الخارجي", "desc": "غسيل شامل للهيكل الخارجي مع تلميع الإطارات والزجاج."},
    {"title": "الغسيل الداخلي والخارجي", "desc": "تنظيف متكامل داخلياً وخارجياً يشمل المقاعد والأرضيات."},
    {"title": "خدمة VIP", "desc": "تجربة فاخرة تشمل تلميع متقدم، تعطير، وعناية كاملة بالتفاصيل."}
  ],
  "packages": [
    {"title": "4 غسلات خارجي", "period": "شهرياً", "price": "199", "tier": "basic", "features": ["غسيل خارجي شامل", "تلميع الإطارات", "تنظيف الزجاج"]},
    {"title": "4 غسلات داخلي وخارجي", "period": "شهرياً", "price": "349", "tier": "popular", "features": ["غسيل خارجي شامل", "تنظيف داخلي كامل", "تعطير السيارة"]},
    {"title": "4 غسلات VIP", "period": "شهرياً", "price": "599", "tier": "vip", "features": ["تجربة VIP كاملة", "تلميع متقدم", "عناية بالتفاصيل"]},
    {"title": "8 غسلات خارجي", "period": "كل 3 أشهر", "price": "369", "tier": "basic", "features": ["توفير 7%", "مرونة في المواعيد", "جودة ثابتة"]},
    {"title": "8 غسلات داخلي وخارجي", "period": "كل 3 أشهر", "price": "649", "tier": "popular", "features": ["توفير 8%", "تنظيف داخلي كامل", "تعطير في كل زيارة"]},
    {"title": "8 غسلات VIP", "period": "كل 3 أشهر", "price": "1099", "tier": "vip", "features": ["توفير 9%", "تجربة فاخرة دائمة", "أولوية في الحجز"]}
  ],
  "faqs": [
    {"q": "كيف يمكنني الحجز؟", "a": "يمكنك الحجز عبر الضغط على زر (احجز الآن) أو التواصل معنا مباشرة على الواتساب أو الاتصال على الرقم 0503503552."},
    {"q": "ما هي مناطق الخدمة؟", "a": "نقدم خدماتنا في معظم أحياء المدينة، تواصل معنا للتأكد من توفر الخدمة في موقعك."},
    {"q": "ما هي طرق الدفع المتاحة؟", "a": "نقبل الدفع النقدي، التحويل البنكي، وعبر تطبيقات الدفع الإلكتروني."},
    {"q": "كم تستغرق عملية الغسيل؟", "a": "تتراوح المدة بين 20-45 دقيقة حسب نوع الباقة والخدمة المختارة."},
    {"q": "هل أحتاج لتوفير ماء أو كهرباء؟", "a": "لا، فريقنا يأتي بمعداته المتكاملة بما فيها الماء والكهرباء."}
  ]
}'::jsonb);
