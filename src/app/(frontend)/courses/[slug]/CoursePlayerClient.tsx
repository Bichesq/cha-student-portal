'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Course } from '@/types/course'
import { SlidePlayer } from '@/components/course/SlidePlayer'
import { QuizPlayer } from '@/components/course/QuizPlayer'

export default function CoursePlayerClient({ course }: { course: Course }) {
  const [activeTab, setActiveTab] = useState<'material' | 'quiz'>('material')
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href="/courses" 
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            aria-label="Back to courses"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
          <h1 className="text-base md:text-lg font-black text-gray-900 truncate max-w-[200px] md:max-w-md">
            {course.title}
          </h1>
        </div>

        <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('material')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'material' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Learning Material
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'quiz' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Knowledge Check
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden flex flex-col">
        {activeTab === 'material' ? (
          <SlidePlayer 
            slides={course.slides} 
            audioEnabled={course.audioEnabled} 
          />
        ) : (
          <div className="flex-grow overflow-y-auto w-full px-4">
            <QuizPlayer knowledgeCheck={course.knowledgeCheck} />
          </div>
        )}
      </main>
    </div>
  )
}
