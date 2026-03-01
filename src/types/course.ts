export interface Media {
  id: string | number
  url: string
  filename: string
  mimeType: string
  width?: number
  height?: number
  alt?: string
}

export interface Tag {
  id: string | number
  name: string
  slug: string
}

export interface TopicItem {
  id?: string
  topic: string
}

export interface SubheadingItem {
  id?: string
  point: string
}

export interface Subheading {
  id?: string
  label: string
  body?: any // Lexical rich text
  items?: SubheadingItem[]
}

export interface BulletPoint {
  id?: string
  point: string
}

export interface CourseSlide {
  id: string
  order: number
  slideType: 'tutorial' | 'intro' | 'topics' | 'content' | 'content-subheadings' | 'content-list' | 'outro'
  image: Media
  audio?: Media
  slideTitle: string
  content?: any // Lexical rich text
  objective?: string
  authorName?: string
  authorRole?: string
  topicsList?: TopicItem[]
  subheadings?: Subheading[]
  bulletPoints?: BulletPoint[]
}

export interface CourseAnswer {
  id: string
  ansId: string
  ans: string
  isCorrect: boolean
}

export interface CourseQuestion {
  id: string
  order: number
  questionType: 'mcq' | 'completion'
  question?: string
  answers?: CourseAnswer[]
  completionMessage?: string
  completionSubtext?: any // Lexical rich text
}

export interface KnowledgeCheck {
  allowPerQuestionSubmit: boolean
  playOnNextDefault: boolean
  showProgress: boolean
  passingScore: number
  questions?: CourseQuestion[]
}

export interface Course {
  id: string | number
  courseId: string
  title: string
  slug: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  objective: any // Lexical rich text
  description: any // Lexical rich text
  topics: TopicItem[]
  authorName: string
  authorRole: string
  contentModel: 'slides'
  audioEnabled: boolean
  thumbnail?: Media
  publishedAt?: string
  estimatedDuration?: number
  version?: string
  tags?: Tag[]
  prerequisites?: Course[]
  slides: CourseSlide[]
  knowledgeCheck: KnowledgeCheck
}

export interface SiteSettings {
  siteName: string
  siteTagline?: string
  logoImage?: Media
  primaryColor?: string
  footerText?: string
}
