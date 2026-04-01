// ─── Planos ───────────────────────────────────────────
export type Plan = 'trial' | 'starter' | 'pro' | 'agency'

// ─── Perfil do usuário ────────────────────────────────
export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  plan_started_at: string
  plan_expires_at: string
  trial_ends_at: string
  is_active: boolean
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  ai_calls_today: number
  ai_calls_reset_at: string
  created_at: string
  updated_at: string
}

/* ═══════════════════════════════════════════════════════
   Section Style — override de estilos por seção
   ═══════════════════════════════════════════════════════ */
export type SectionStyle = {
  bgColor?: string
  textColor?: string
  accentColor?: string
  paddingY?: 'sm' | 'md' | 'lg' | 'xl'
}

/* ═══════════════════════════════════════════════════════
   Props de cada tipo de seção
   ═══════════════════════════════════════════════════════ */

// ── Navbar ────────────────────────────────────────────
export type NavbarProps = {
  logo: string
  links: { label: string; href: string }[]
  ctaText?: string
  ctaUrl?: string
  style?: SectionStyle
}

// ── Hero ──────────────────────────────────────────────
export type HeroProps = {
  variant: 'centered' | 'split-left' | 'split-right'
  headline: string
  subheadline: string
  primaryCtaText: string
  primaryCtaUrl: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  imageUrl?: string
  style?: SectionStyle
}

// ── Logos (faixa de clientes/parceiros) ───────────────
export type LogosProps = {
  title?: string
  items: { name: string; imageUrl: string }[]
  style?: SectionStyle
}

// ── Features (grade de funcionalidades) ───────────────
export type FeaturesProps = {
  variant: 'grid-3' | 'grid-2' | 'list'
  label?: string
  title: string
  subtitle?: string
  items: { icon: string; title: string; description: string }[]
  style?: SectionStyle
}

// ── Benefits (por que escolher / diferenciais) ────────
export type BenefitsProps = {
  variant: 'image-left' | 'image-right' | 'centered'
  label?: string
  title: string
  subtitle?: string
  items: { icon?: string; title: string; description: string }[]
  imageUrl?: string
  ctaText?: string
  ctaUrl?: string
  style?: SectionStyle
}

// ── Steps (como funciona / passo a passo) ─────────────
export type StepsProps = {
  label?: string
  title: string
  subtitle?: string
  steps: { title: string; description: string; imageUrl?: string }[]
  style?: SectionStyle
}

// ── Testimonials ──────────────────────────────────────
export type TestimonialsProps = {
  variant: 'grid' | 'single'
  label?: string
  title?: string
  items: {
    quote: string
    authorName: string
    authorRole: string
    authorCompany?: string
    avatarUrl?: string
    rating?: number // 1–5
  }[]
  style?: SectionStyle
}

// ── Pricing ───────────────────────────────────────────
export type PricingProps = {
  label?: string
  title: string
  subtitle?: string
  plans: {
    name: string
    price: string
    period?: string
    description?: string
    features: string[]
    ctaText: string
    ctaUrl: string
    highlighted?: boolean
    badge?: string
  }[]
  style?: SectionStyle
}

// ── FAQ ───────────────────────────────────────────────
export type FAQProps = {
  label?: string
  title: string
  subtitle?: string
  items: { question: string; answer: string }[]
  style?: SectionStyle
}

// ── CTA ───────────────────────────────────────────────
export type CTAProps = {
  variant: 'centered' | 'card'
  headline: string
  subheadline?: string
  primaryCtaText: string
  primaryCtaUrl: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  style?: SectionStyle
}

// ── Footer ────────────────────────────────────────────
export type FooterProps = {
  logo?: string
  tagline?: string
  columns: { title: string; links: { label: string; href: string }[] }[]
  copyright: string
  bottomLinks?: { label: string; href: string }[]
  style?: SectionStyle
}

/* ═══════════════════════════════════════════════════════
   Section — union discriminada por type
   ═══════════════════════════════════════════════════════ */
export type Section =
  | { id: string; type: 'navbar';       props: NavbarProps       }
  | { id: string; type: 'hero';         props: HeroProps         }
  | { id: string; type: 'logos';        props: LogosProps        }
  | { id: string; type: 'features';     props: FeaturesProps     }
  | { id: string; type: 'benefits';     props: BenefitsProps     }
  | { id: string; type: 'steps';        props: StepsProps        }
  | { id: string; type: 'testimonials'; props: TestimonialsProps }
  | { id: string; type: 'pricing';      props: PricingProps      }
  | { id: string; type: 'faq';         props: FAQProps          }
  | { id: string; type: 'cta';         props: CTAProps          }
  | { id: string; type: 'footer';      props: FooterProps       }

export type SectionType = Section['type']

// Helper: extrai Props a partir do type
export type PropsForType<T extends SectionType> = Extract<Section, { type: T }>['props']

/* ═══════════════════════════════════════════════════════
   PageContent
   ═══════════════════════════════════════════════════════ */
export type PageContent = {
  sections: Section[]
}

/* ═══════════════════════════════════════════════════════
   Status / Projeto
   ═══════════════════════════════════════════════════════ */
export type ProjectStatus = 'draft' | 'published'

export type Project = {
  id: string
  user_id: string
  name: string
  slug: string
  status: ProjectStatus
  content: PageContent
  created_at: string
  updated_at: string
}
