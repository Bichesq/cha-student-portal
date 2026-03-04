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
 * - Filters out relationship fields if they are strings (must be IDs).
 */
function transformCourseData(data: any) {
  // Create a clean object with only supported fields
  const transformed: any = {
    courseId: data.courseId,
    title: data.title,
    authorName: data.authorName,
    authorRole: data.authorRole || 'Author and Designer',
    contentModel: data.contentModel || 'slides',
    audioEnabled: typeof data.audioEnabled === 'boolean' ? data.audioEnabled : true,
    status: data.status || 'published', // Default to published for imports
  }

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
      const s: any = {
        slideType: slide.slideType,
        slideTitle: slide.slideTitle,
        order: slide.order,
        imgName: slide.imgName,
      }

      if (typeof slide.content === 'string') s.content = stringToLexical(slide.content)
      if (typeof slide.objective === 'string') s.objective = slide.objective
      if (typeof slide.authorName === 'string') s.authorName = slide.authorName
      if (typeof slide.authorRole === 'string') s.authorRole = slide.authorRole
      
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
          const newSh: any = { label: sh.label }
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
    const kc: any = {
      allowPerQuestionSubmit: !!data.knowledgeCheck.allowPerQuestionSubmit,
      playOnNextDefault: !!data.knowledgeCheck.playOnNextDefault,
      showProgress: !!data.knowledgeCheck.showProgress,
      passingScore: data.knowledgeCheck.passingScore || 100,
    }

    if (Array.isArray(data.knowledgeCheck.questions)) {
      kc.questions = data.knowledgeCheck.questions.map((q: any) => {
        const newQ: any = {
          order: q.order,
          questionType: q.questionType,
        }

        if (q.questionType === 'mcq') {
          newQ.question = q.question
          if (Array.isArray(q.answers)) {
            newQ.answers = q.answers.map((a: any) => ({
              ansId: a.ansId,
              ans: a.ans,
              isCorrect: !!a.isCorrect
            }))
          }
        } else if (q.questionType === 'completion') {
          newQ.completionMessage = q.completionMessage
          if (typeof q.completionSubtext === 'string') {
            newQ.completionSubtext = stringToLexical(q.completionSubtext)
          }
        }
        return newQ
      })
    }
    transformed.knowledgeCheck = kc
  }

  return transformed
}

export async function importCoursesAction(courses: any[]) {
  console.log(`Starting creation process for ${courses?.length || 0} items...`)
  try {
    const payload = await getPayload({ config })
    let count = 0

    if (!Array.isArray(courses)) {
       console.error("Creation failed: Input is not an array")
       return { success: false, message: "Invalid input: expected an array." }
    }

    for (const rawData of courses) {
      console.log(`Processing course: ${rawData.courseId || 'unknown'} - ${rawData.title || 'no title'}`)
      try {
        if (!rawData.title || !rawData.courseId) {
           console.warn(`Skipping item due to missing title (${rawData.title}) or courseId (${rawData.courseId})`)
           continue
        }

        const courseData = transformCourseData(rawData)
        console.log(`Transformed data for ${courseData.courseId}:`, JSON.stringify(courseData).substring(0, 200) + "...")

        const existing = await payload.find({
          collection: 'courses',
          where: { courseId: { equals: courseData.courseId } },
        })

        if (existing.docs.length > 0) {
          console.log(`Updating existing course ${courseData.courseId} (ID: ${existing.docs[0].id})`)
          await payload.update({
            collection: 'courses',
            id: existing.docs[0].id,
            data: courseData,
          })
        } else {
          console.log(`Creating new course ${courseData.courseId}`)
          await payload.create({
            collection: 'courses',
            data: courseData,
          })
        }
        
        count++
        console.log(`Successfully processed ${courseData.courseId}. Total count: ${count}`)
      } catch (err) {
        console.error(`Error creating course ${rawData.courseId}:`, err)
        // Check for validation errors manually if possible
        if (err && typeof err === 'object' && 'data' in err) {
           console.error("Validation details:", JSON.stringify((err as any).data))
        }
      }
    }

    console.log(`Creation finished. Final count: ${count}`)
    return {
      success: true,
      message: `Creation completed. ${count} courses processed.`,
      count,
    }
  } catch (err) {
    console.error('Creation action failed fatally:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'An unexpected error occurred during course creation.',
    }
  }
}
