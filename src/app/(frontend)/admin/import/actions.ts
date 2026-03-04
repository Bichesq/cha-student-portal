'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Converts a plain string to a basic Lexical RichText object structure.
 * This is necessary because Payload's Lexical editor expects a specific JSON format.
 */
function stringToLexical(text: string) {
  if (!text) return null
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              text: text,
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

/**
 * Recursively prepares course data for Payload insertion.
 * - Converts strings to RichText where expected.
 * - Maps simple arrays to Payload's array of objects format.
 */
function transformCourseData(data: any) {
  const transformed = { ...data }

  // 1. Root level RichText fields
  if (typeof data.objective === 'string') transformed.objective = stringToLexical(data.objective)
  if (typeof data.description === 'string') transformed.description = stringToLexical(data.description)

  // Root level topics transformation
  if (Array.isArray(data.topics)) {
    transformed.topics = data.topics.map((t: any) => 
      typeof t === 'string' ? { topic: t } : t
    )
  }

  // 2. Transform Slides
  if (Array.isArray(data.slides)) {
    transformed.slides = data.slides.map((slide: any) => {
      const s = { ...slide }
      if (typeof slide.content === 'string') s.content = stringToLexical(slide.content)
      
      // Transform bulletPoints string array to { point: string } array
      if (Array.isArray(slide.bulletPoints)) {
        s.bulletPoints = slide.bulletPoints.map((p: any) => 
          typeof p === 'string' ? { point: p } : p
        )
      }

      // Transform topicsList string array to { topic: string } array
      if (Array.isArray(slide.topicsList)) {
        s.topicsList = slide.topicsList.map((t: any) => 
          typeof t === 'string' ? { topic: t } : t
        )
      }

      // Transform subheadings
      if (Array.isArray(slide.subheadings)) {
        s.subheadings = slide.subheadings.map((sh: any) => {
          const newSh = { ...sh }
          if (typeof sh.body === 'string') newSh.body = stringToLexical(sh.body)
          if (Array.isArray(sh.items)) {
            newSh.items = sh.items.map((i: any) => 
              typeof i === 'string' ? { point: i } : i
            )
          }
          return newSh
        })
      }

      return s
    })
  }

  // 3. Transform Knowledge Check
  if (data.knowledgeCheck) {
    const kc = { ...data.knowledgeCheck }
    if (Array.isArray(kc.questions)) {
      kc.questions = kc.questions.map((q: any) => {
        const newQ = { ...q }
        if (typeof q.completionSubtext === 'string') newQ.completionSubtext = stringToLexical(q.completionSubtext)
        return newQ
      })
    }
    transformed.knowledgeCheck = kc
  }

  return transformed
}

export async function importCoursesAction(courses: any[]) {
  try {
    const payload = await getPayload({ config })
    let count = 0

    for (const rawData of courses) {
      try {
        if (!rawData.title || !rawData.courseId) continue

        const courseData = transformCourseData(rawData)

        const existing = await payload.find({
          collection: 'courses',
          where: { courseId: { equals: courseData.courseId } },
        })

        if (existing.docs.length > 0) {
          await payload.update({
            collection: 'courses',
            id: existing.docs[0].id,
            data: courseData,
          })
        } else {
          await payload.create({
            collection: 'courses',
            data: courseData,
          })
        }
        
        count++
      } catch (err) {
        console.error(`Error importing course ${rawData.courseId}:`, err)
      }
    }

    return {
      success: true,
      message: `Import completed. ${count} courses processed.`,
      count,
    }
  } catch (err) {
    console.error('Import action failed:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'An unexpected error occurred during import.',
    }
  }
}
