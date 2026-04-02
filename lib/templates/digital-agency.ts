import type { Section } from '../types'
import type { Template } from './index'

function s(id: string, type: Section['type'], props: Section['props']): Section {
  return { id, type, props } as Section
}

export const digitalAgencyTemplate: Template = {
  id: 'digital-agency',
  name: 'Digital Agency',
  description: 'Para agências criativas e estúdios de design',
  thumbnail: '',
  content: {
    sections: [
      s('hero-1', 'hero', {
        variant: 'centered',
        headline: 'We craft digital experiences that matter.',
        subheadline: 'Strategy, design and development for brands that want to lead.',
        primaryCtaText: 'See our work',
        primaryCtaUrl: '#',
        style: { bgColor: '#F5F0E8', textColor: '#1A1A1A' },
      }),

      s('features-1', 'features', {
        variant: 'grid-3',
        title: 'Our services',
        items: [
          { icon: '🎨', title: 'Brand & Identity', description: 'Visual systems that communicate who you are before you say a word.' },
          { icon: '💻', title: 'Web & Digital', description: 'Fast, accessible, beautifully crafted websites and applications.' },
          { icon: '📱', title: 'Campaign & Content', description: 'Campaigns that connect with real people and drive real results.' },
        ],
        style: { bgColor: '#FFFFFF', textColor: '#1A1A1A' },
      }),

      s('testimonials-1', 'testimonials', {
        variant: 'single',
        items: [
          {
            quote: 'Working with them transformed how our brand shows up in the world. The results speak for themselves.',
            authorName: 'Sarah Chen',
            authorRole: 'CMO at Horizon',
          },
        ],
        style: { bgColor: '#F5F0E8', textColor: '#1A1A1A' },
      }),

      s('cta-1', 'cta', {
        variant: 'centered',
        headline: "Let's build something great.",
        subheadline: "Tell us about your project and we'll get back to you within 24h.",
        primaryCtaText: 'Start a project',
        primaryCtaUrl: '#',
        style: { bgColor: '#1A1A1A', textColor: '#FFFFFF' },
      }),

      s('footer-1', 'footer', {
        copyright: '© 2025 Studio Name. All rights reserved.',
        columns: [],
        bottomLinks: [
          { label: 'Work', href: '#' },
          { label: 'About', href: '#' },
          { label: 'Contact', href: '#' },
        ],
        style: { bgColor: '#1A1A1A', textColor: '#888888' },
      }),
    ],
  },
}
