import type { Section } from '../types'
import type { Template } from './index'

function s(id: string, type: Section['type'], props: Section['props']): Section {
  return { id, type, props } as Section
}

export const saasLaunchTemplate: Template = {
  id: 'saas-launch',
  name: 'SaaS Launch',
  description: 'Para produtos digitais e ferramentas online',
  thumbnail: '',
  content: {
    sections: [
      s('hero-1', 'hero', {
        variant: 'centered',
        headline: 'Launch your product faster.',
        subheadline: 'The all-in-one platform for modern teams. Build, ship, and scale without limits.',
        primaryCtaText: 'Start for free',
        primaryCtaUrl: '#',
        style: { bgColor: '#0A0A0A', textColor: '#FFFFFF' },
      }),

      s('features-1', 'features', {
        variant: 'grid-3',
        title: 'Everything you need',
        items: [
          { icon: '⚡', title: 'Blazing fast', description: 'Optimized for performance from day one. Your users will feel the difference.' },
          { icon: '🔒', title: 'Secure by default', description: 'Enterprise-grade security built in. Sleep well knowing your data is safe.' },
          { icon: '📈', title: 'Built to scale', description: 'From 10 to 10 million users. Infrastructure that grows with you.' },
        ],
        style: { bgColor: '#0A0A0A', textColor: '#FFFFFF' },
      }),

      s('cta-1', 'cta', {
        variant: 'centered',
        headline: 'Ready to get started?',
        subheadline: 'Join thousands of teams already using the platform.',
        primaryCtaText: 'Get started free',
        primaryCtaUrl: '#',
        style: { bgColor: '#7F77DD', textColor: '#FFFFFF' },
      }),

      s('footer-1', 'footer', {
        copyright: '© 2025 YourProduct. All rights reserved.',
        columns: [],
        bottomLinks: [
          { label: 'Privacy', href: '#' },
          { label: 'Terms', href: '#' },
        ],
        style: { bgColor: '#0A0A0A', textColor: '#888888' },
      }),
    ],
  },
}
