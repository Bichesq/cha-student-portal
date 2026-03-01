import { getCourse, getCourses } from '@/lib/payload'
import { notFound } from 'next/navigation'
import CoursePlayerClient from './CoursePlayerClient'

export const revalidate = 60

export async function generateStaticParams() {
  const courses = await getCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    notFound()
  }

  return <CoursePlayerClient course={course} />
}
