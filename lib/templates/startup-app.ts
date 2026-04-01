import type { Section } from '../types'
import type { Template } from './index'

function s(id: string, type: Section['type'], props: Section['props']): Section {
  return { id, type, props } as Section
}

export const startupAppTemplate: Template = {
  id: 'startup-app',
  name: 'Startup App',
  description: 'Para apps mobile e produtos B2C',
  thumbnail: '',
  content: {
    sections: [
      s('hero-1', 'hero', {
        variant: 'centered',
        headline: 'The app your routine was missing.',
        subheadline: 'Simple, powerful and designed to get out of your way. Available on iOS and Android.',
        primaryCtaText: 'Download free',
        primaryCtaUrl: '#',
        style: { bgColor: '#FFFFFF', textColor: '#0A0A0A' },
      }),

      s('features-1', 'features', {
        variant: 'grid-3',
        title: 'Why people love it',
        items: [
          { icon: '✨', title: 'Beautifully simple', description: 'Designed to be intuitive from the first tap. No tutorial needed.' },
          { icon: '🔄', title: 'Syncs everywhere', description: 'Your data follows you across all your devices, always up to date.' },
          { icon: '🎯', title: 'Actually works', description: 'Built around how people really work, not how we think they do.' },
        ],
        style: { bgColor: '#F8F8F8', textColor: '#0A0A0A' },
      }),

      s('cta-1', 'cta', {
        variant: 'centered',
        headline: 'Download and start today.',
        subheadline: 'Free to start. No credit card required.',
        primaryCtaText: 'Get the app',
        primaryCtaUrl: '#',
        style: { bgColor: '#0A0A0A', textColor: '#FFFFFF' },
      }),

      s('footer-1', 'footer', {
        copyright: '© 2025 App Name. All rights reserved.',
        columns: [],
        bottomLinks: [
          { label: 'Privacy', href: '#' },
          { label: 'Support', href: '#' },
        ],
        style: { bgColor: '#0A0A0A', textColor: '#888888' },
      }),
    ],
  },
}
