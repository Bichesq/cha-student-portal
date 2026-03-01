import { getPayload } from 'payload'
import config from '@/payload.config'
import { Course, SiteSettings } from '../types/course'

export async function getCourses(): Promise<Course[]> {
  try {
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
  } catch (err) {
    console.error('⚠️ [Payload] Failed to fetch courses (Is DB linked?):', err)
    return []
  }
}

export async function getCourse(slug: string): Promise<Course | null> {
  try {
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
  } catch (err) {
    console.error(`⚠️ [Payload] Failed to fetch course ${slug}:`, err)
    return null
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.findGlobal({
      slug: 'site-settings',
    })
    return data as unknown as SiteSettings
  } catch (err) {
    console.error('⚠️ [Payload] Failed to fetch site settings:', err)
    // Return a minimal fallback to prevent UI crash
    return { siteName: 'CHA Student Portal' } as SiteSettings
  }
}
