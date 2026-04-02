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
interface SlideInput {
  slideType?: string
  slideTitle?: string
  order?: number
  imgName?: string
  image?: string | number
  content?: string
  objective?: string
  authorName?: string
  authorRole?: string
  bulletPoints?: (string | { point: string })[]
  topicsList?: (string | { topic: string })[]
  subheadings?: { 
    label: string
    body?: string
    items?: (string | { point: string })[]
  }[]
}

interface QuestionInput {
  order?: number
  questionType: 'mcq' | 'completion'
  question?: string
  answers?: { ansId: string; ans: string; isCorrect?: boolean }[]
  completionMessage?: string
  completionSubtext?: string
}

interface KnowledgeCheckInput {
  allowPerQuestionSubmit?: boolean
  playOnNextDefault?: boolean
  showProgress?: boolean
  passingScore?: number
  questions?: QuestionInput[]
}

interface CourseInput {
  courseId: string
  title: string
  authorName?: string
  authorRole?: string
  contentModel?: string
  audioEnabled?: boolean
  status?: 'published' | 'draft'
  objective?: string
  description?: string
  topics?: (string | { topic: string })[]
  slides?: SlideInput[]
  knowledgeCheck?: KnowledgeCheckInput
}

/**
 * Recursively prepares course data for Payload insertion.
 */
function transformCourseData(data: CourseInput) {
  const transformed: Record<string, unknown> = {
    courseId: data.courseId,
    title: data.title,
    authorName: data.authorName,
    authorRole: data.authorRole || 'Author and Designer',
    contentModel: data.contentModel || 'slides',
    audioEnabled: typeof data.audioEnabled === 'boolean' ? data.audioEnabled : true,
    status: data.status || 'published',
  }

  if (typeof data.objective === 'string') transformed.objective = stringToLexical(data.objective)
  if (typeof data.description === 'string') transformed.description = stringToLexical(data.description)

  if (Array.isArray(data.topics)) {
    transformed.topics = data.topics.map((t) => 
      typeof t === 'string' ? { topic: t } : t
    )
  }

  if (Array.isArray(data.slides)) {
    transformed.slides = data.slides.map((slide) => {
      const s: Record<string, unknown> = {
        slideType: slide.slideType || 'content',
        slideTitle: slide.slideTitle,
        order: slide.order,
        imgName: slide.imgName,
        image: slide.image,
      }

      if (typeof slide.content === 'string') s.content = stringToLexical(slide.content)
      if (typeof slide.objective === 'string') s.objective = slide.objective
      if (typeof slide.authorName === 'string') s.authorName = slide.authorName
      if (typeof slide.authorRole === 'string') s.authorRole = slide.authorRole
      
      if (Array.isArray(slide.bulletPoints)) {
        s.bulletPoints = slide.bulletPoints.map((p) => 
          typeof p === 'string' ? { point: p } : p
        )
      }

      if (Array.isArray(slide.topicsList)) {
        s.topicsList = slide.topicsList.map((t) => 
          typeof t === 'string' ? { topic: t } : t
        )
      }

      if (Array.isArray(slide.subheadings)) {
        s.subheadings = slide.subheadings.map((sh) => {
          const newSh: Record<string, unknown> = { label: sh.label }
          if (typeof sh.body === 'string') newSh.body = stringToLexical(sh.body)
          if (Array.isArray(sh.items)) {
            newSh.items = sh.items.map((i) => 
              typeof i === 'string' ? { point: i } : i
            )
          }
          return newSh
        })
      }

      return s
    })
  }

  if (data.knowledgeCheck) {
    const kc: Record<string, unknown> = {
      allowPerQuestionSubmit: !!data.knowledgeCheck.allowPerQuestionSubmit,
      playOnNextDefault: !!data.knowledgeCheck.playOnNextDefault,
      showProgress: !!data.knowledgeCheck.showProgress,
      passingScore: data.knowledgeCheck.passingScore || 100,
    }

    if (Array.isArray(data.knowledgeCheck.questions)) {
      kc.questions = data.knowledgeCheck.questions.map((q) => {
        const newQ: Record<string, unknown> = {
          order: q.order,
          questionType: q.questionType,
        }

        if (q.questionType === 'mcq') {
          newQ.question = q.question
          if (Array.isArray(q.answers)) {
            newQ.answers = q.answers.map((a) => ({
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

export async function importCoursesAction(courses: CourseInput[]) {
  console.log(`Starting creation process for ${courses?.length || 0} items...`)
  try {
    const payload = await getPayload({ config })
    let count = 0

    if (!Array.isArray(courses)) {
       console.error("Creation failed: Input is not an array")
       return { success: false, message: "Invalid input: expected an array." }
    }

    const results: { courseId: string; success: boolean; error?: string }[] = []
    for (const rawData of courses) {
      console.log(`Processing course: ${rawData.courseId || 'unknown'} - ${rawData.title || 'no title'}`)
      try {
        if (!rawData.title || !rawData.courseId) {
           const error = `Skipping item due to missing title (${rawData.title}) or courseId (${rawData.courseId})`
           console.warn(error)
           results.push({ courseId: rawData.courseId || 'unknown', success: false, error })
           continue
        }

        const courseData = transformCourseData(rawData)
        console.log(`Transformed data for ${courseData.courseId as string}:`, JSON.stringify(courseData).substring(0, 200) + "...")

        const existing = await payload.find({
          collection: 'courses',
          where: { courseId: { equals: courseData.courseId } },
        })

        if (existing.docs.length > 0) {
          console.log(`Updating existing course ${courseData.courseId} (ID: ${existing.docs[0].id})`)
          await payload.update({
            collection: 'courses',
            id: existing.docs[0].id,
            data: courseData as any,
          })
        } else {
          console.log(`Creating new course ${courseData.courseId}`)
          await payload.create({
            collection: 'courses',
            data: courseData as any,
          })
        }
        
        count++
        results.push({ courseId: courseData.courseId, success: true })
        console.log(`Successfully processed ${courseData.courseId}. Total count: ${count}`)
      } catch (err: unknown) {
        console.error(`Error creating course ${rawData.courseId}:`, err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        results.push({ courseId: rawData.courseId, success: false, error: errorMessage })
        
        // Safely check for validation errors
        if (err && typeof err === 'object' && 'data' in err && err.data && typeof err.data === 'object') {
           console.error("Validation details:", JSON.stringify(err.data))
        }
      }
    }

    const failedCount = results.filter(r => !r.success).length
    console.log(`Creation finished. Success: ${count}, Failed: ${failedCount}`)
    
    if (count === 0 && courses.length > 0) {
      return {
        success: false,
        message: `Failed to create any courses. Errors: ${results.filter(r => !r.success).map(r => r.error).join(', ')}`,
        count: 0
      }
    }

    return {
      success: true,
      message: `Creation completed. ${count} courses successful, ${failedCount} failed.`,
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

export async function createManualCourseAction(formData: FormData) {
  console.log('Starting manual creation process...')
  try {
    const payload = await getPayload({ config })
    const courseDataRaw = formData.get('courseData') as string
    if (!courseDataRaw) {
      return { success: false, message: 'Missing course data.' }
    }
    
    const courseData = JSON.parse(courseDataRaw) as CourseInput
    
    // 1. Handle file uploads for slides
    if (courseData.slides && Array.isArray(courseData.slides)) {
      for (let i = 0; i < courseData.slides.length; i++) {
        const slide = courseData.slides[i]
        const fileKey = `slideImage_${i}`
        const file = formData.get(fileKey) as File | null
        
        if (file && file.size > 0) {
          console.log(`Uploading image for slide ${i}: ${file.name}`)
          
          try {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            
            const mediaDoc = await payload.create({
              collection: 'media',
              data: {
                alt: slide.slideTitle || `${courseData.title}-Slide-${i + 1}`,
              },
              file: {
                data: buffer,
                name: file.name,
                mimetype: file.type,
                size: file.size,
              },
            })
            
            // Link media ID to slide
            slide.image = mediaDoc.id
            console.log(`Successfully uploaded and linked image: ${mediaDoc.id}`)
          } catch (uploadErr) {
            console.error(`Failed to upload image for slide ${i}:`, uploadErr)
            // Continue without image or fail? Let's continue for now.
          }
        }
      }
    }

    // 2. Reuse the import logic
    return await importCoursesAction([courseData])
  } catch (err) {
    console.error('Manual creation failed fatally:', err)
    return {
      success: false,
      message: err instanceof Error ? err.message : 'An unexpected error occurred during manual creation.',
    }
  }
}
