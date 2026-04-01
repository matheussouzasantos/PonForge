import type { Section } from '../types'
import type { Template } from './index'

function s(id: string, type: Section['type'], props: Section['props']): Section {
  return { id, type, props } as Section
}

export const digitalCourseTemplate: Template = {
  id: 'digital-course',
  name: 'Digital Course',
  description: 'Para cursos online, mentorias e infoprodutos',
  thumbnail: '',
  content: {
    sections: [
      s('hero-1', 'hero', {
        variant: 'centered',
        headline: 'Master the skill that changes everything.',
        subheadline: 'A practical, no-fluff course for people who want real results. Learn at your own pace.',
        primaryCtaText: 'Enroll now',
        primaryCtaUrl: '#',
        style: { bgColor: '#0F172A', textColor: '#FFFFFF' },
      }),

      s('features-1', 'features', {
        variant: 'grid-3',
        title: "What you'll learn",
        items: [
          { icon: '🎯', title: 'Clear frameworks', description: 'No theory overload. Just proven frameworks you can apply immediately.' },
          { icon: '🎥', title: 'HD video lessons', description: 'Over 40 lessons with lifetime access. Learn at your own pace.' },
          { icon: '🤝', title: 'Community access', description: 'Join a private community of students and get your questions answered.' },
        ],
        style: { bgColor: '#0F172A', textColor: '#FFFFFF' },
      }),

      s('testimonials-1', 'testimonials', {
        variant: 'single',
        items: [
          {
            quote: "I made back the course investment in the first week. This is the most practical thing I've ever bought.",
            authorName: 'Marcus Lima',
            authorRole: 'Freelancer',
          },
        ],
        style: { bgColor: '#1E293B', textColor: '#FFFFFF' },
      }),

      s('cta-1', 'cta', {
        variant: 'centered',
        headline: 'Start learning today.',
        subheadline: 'One-time payment. Lifetime access. 30-day money-back guarantee.',
        primaryCtaText: 'Get instant access',
        primaryCtaUrl: '#',
        style: { bgColor: '#7F77DD', textColor: '#FFFFFF' },
      }),

      s('footer-1', 'footer', {
        copyright: '© 2025 Course Name. All rights reserved.',
        columns: [],
        bottomLinks: [
          { label: 'FAQ', href: '#' },
          { label: 'Contact', href: '#' },
        ],
        style: { bgColor: '#0F172A', textColor: '#888888' },
      }),
    ],
  },
}
