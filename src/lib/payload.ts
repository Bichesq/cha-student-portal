import { Course, SiteSettings } from '../types/course'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'

async function fetchPayload<T>(path: string): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}${path}`, {
    next: { revalidate: 60 },
  })
  
  if (!res.ok) {
    throw new Error(`Failed to fetch from Payload: ${res.statusText}`)
  }
  
  return res.json()
}

export async function getCourses(): Promise<Course[]> {
  const data = await fetchPayload<{ docs: Course[] }>('/api/courses?where[status][equals]=published&depth=1')
  return data.docs
}

export async function getCourse(slug: string): Promise<Course | null> {
  const data = await fetchPayload<{ docs: Course[] }>(`/api/courses?where[slug][equals]=${slug}&depth=2`)
  return data.docs?.[0] || null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await fetchPayload<SiteSettings>('/api/globals/site-settings')
  return data
}
