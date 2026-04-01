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

// ─── Tipos de seção ───────────────────────────────────
export type SectionType =
  | 'hero'
  | 'features'
  | 'cta'
  | 'testimonial'
  | 'footer'

// ─── Props de cada tipo de seção ─────────────────────
export type HeroProps = {
  headline: string
  subheadline: string
  ctaText: string
  ctaUrl: string
  bgColor: string
  textColor: string
  imageUrl?: string
}

export type FeaturesProps = {
  title: string
  items: {
    icon: string
    title: string
    description: string
  }[]
  bgColor: string
  textColor: string
}

export type CTAProps = {
  headline: string
  subheadline: string
  buttonText: string
  buttonUrl: string
  bgColor: string
  textColor: string
}

export type TestimonialProps = {
  quote: string
  authorName: string
  authorRole: string
  avatarUrl?: string
  bgColor: string
  textColor: string
}

export type FooterProps = {
  copyright: string
  links: {
    label: string
    url: string
  }[]
  bgColor: string
  textColor: string
}

export type SectionProps =
  | HeroProps
  | FeaturesProps
  | CTAProps
  | TestimonialProps
  | FooterProps

// ─── Seção ────────────────────────────────────────────
export type Section = {
  id: string
  type: SectionType
  props: SectionProps
}

// ─── Conteúdo da página ───────────────────────────────
export type PageContent = {
  sections: Section[]
}

// ─── Status do projeto ────────────────────────────────
export type ProjectStatus = 'draft' | 'published'

// ─── Projeto ──────────────────────────────────────────
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
