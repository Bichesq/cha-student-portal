import { getCourses, getSiteSettings } from '@/lib/payload'
import { CourseCard } from '@/components/course/CourseCard'

export default async function CoursesPage() {
  const [courses, settings] = await Promise.all([
    getCourses(),
    getSiteSettings()
  ])

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {settings.siteName} Catalog
          </h1>
          {settings.siteTagline && (
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {settings.siteTagline}
            </p>
          )}
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No courses published yet.</h3>
            <p className="mt-1 text-sm text-gray-500">Please check back later or contact an administrator.</p>
          </div>
        )}
      </div>
    </main>
  )
}
