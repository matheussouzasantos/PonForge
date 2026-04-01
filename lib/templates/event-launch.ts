import type { Section } from '../types'
import type { Template } from './index'

function s(id: string, type: Section['type'], props: Section['props']): Section {
  return { id, type, props } as Section
}

export const eventLaunchTemplate: Template = {
  id: 'event-launch',
  name: 'Event Launch',
  description: 'Para eventos, workshops e lançamentos',
  thumbnail: '',
  content: {
    sections: [
      s('hero-1', 'hero', {
        variant: 'centered',
        headline: "The event you've been waiting for.",
        subheadline: 'Two days of talks, workshops and networking with the people shaping the future of the industry.',
        primaryCtaText: 'Grab your ticket',
        primaryCtaUrl: '#',
        style: { bgColor: '#0A0A0A', textColor: '#FFFFFF' },
      }),

      s('features-1', 'features', {
        variant: 'grid-3',
        title: "What's happening",
        items: [
          { icon: '🎤', title: '20+ speakers', description: 'Founders, operators and creators sharing what actually works.' },
          { icon: '🛠️', title: 'Hands-on workshops', description: 'Practical sessions where you build things, not just watch.' },
          { icon: '🌐', title: 'Global community', description: 'Meet 500+ professionals from across the industry in one place.' },
        ],
        style: { bgColor: '#111111', textColor: '#FFFFFF' },
      }),

      s('testimonials-1', 'testimonials', {
        variant: 'single',
        items: [
          {
            quote: "Best event I've attended in years. Came for the talks, stayed for the people.",
            authorName: 'Julia Martins',
            authorRole: 'Founder at Buildco',
          },
        ],
        style: { bgColor: '#0A0A0A', textColor: '#FFFFFF' },
      }),

      s('cta-1', 'cta', {
        variant: 'centered',
        headline: 'Spots are limited.',
        subheadline: 'Early bird tickets available until the end of the month.',
        primaryCtaText: 'Reserve my spot',
        primaryCtaUrl: '#',
        style: { bgColor: '#7F77DD', textColor: '#FFFFFF' },
      }),

      s('footer-1', 'footer', {
        copyright: '© 2025 Event Name. All rights reserved.',
        columns: [],
        bottomLinks: [
          { label: 'Schedule', href: '#' },
          { label: 'FAQ', href: '#' },
          { label: 'Contact', href: '#' },
        ],
        style: { bgColor: '#0A0A0A', textColor: '#888888' },
      }),
    ],
  },
}
