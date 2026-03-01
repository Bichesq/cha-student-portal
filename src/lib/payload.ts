import { getPayload } from 'payload'
import config from '@/payload.config'
import { Course, SiteSettings } from '../types/course'

export async function getCourses(): Promise<Course[]> {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'courses',
    where: {
      status: {
        equals: 'published',
      },
    },
    depth: 1,
  })
  return data.docs as unknown as Course[]
}

export async function getCourse(slug: string): Promise<Course | null> {
  const payload = await getPayload({ config })
  const data = await payload.find({
    collection: 'courses',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
  })
  return (data.docs?.[0] as unknown as Course) || null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const payload = await getPayload({ config })
  const data = await payload.findGlobal({
    slug: 'site-settings',
  })
  return data as unknown as SiteSettings
}
