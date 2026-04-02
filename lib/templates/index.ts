import type { PageContent } from '../types'
import { saasLaunchTemplate } from './saas-launch'
import { digitalAgencyTemplate } from './digital-agency'
import { digitalCourseTemplate } from './digital-course'
import { startupAppTemplate } from './startup-app'
import { eventLaunchTemplate } from './event-launch'

export type Template = {
  id: string
  name: string
  description: string
  thumbnail: string
  content: PageContent
}

export const TEMPLATES: Template[] = [
  saasLaunchTemplate,
  digitalAgencyTemplate,
  digitalCourseTemplate,
  startupAppTemplate,
  eventLaunchTemplate,
]

export const TEMPLATE_MAP = Object.fromEntries(
  TEMPLATES.map((t) => [t.id, t])
) as Record<string, Template>
