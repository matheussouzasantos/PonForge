import type { Section } from '@/lib/types'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { CTASection } from './CTASection'
import { TestimonialsSection } from './TestimonialsSection'
import { FooterSection } from './FooterSection'
import './renderer.css'

interface PageRendererProps {
  sections: Section[]
}

export function PageRenderer({ sections }: PageRendererProps) {
  return (
    <div className="pf-r">
      {sections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id} props={section.props} />
          case 'features':
            return <FeaturesSection key={section.id} props={section.props} />
          case 'cta':
            return <CTASection key={section.id} props={section.props} />
          case 'testimonials':
            return <TestimonialsSection key={section.id} props={section.props} />
          case 'footer':
            return <FooterSection key={section.id} props={section.props} />
          default:
            return null
        }
      })}
    </div>
  )
}
