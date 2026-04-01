'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Course } from '@/types/course'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-red-100 text-red-800',
  }
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px] animate-pulse">
        <div className="aspect-video bg-gray-100" />
      </div>
    )
  }

  const thumbnailUrl = course.thumbnail?.url 
    ? (course.thumbnail.url.startsWith('http') ? course.thumbnail.url : `${PAYLOAD_URL}${course.thumbnail.url}`)
    : '/placeholder-course.jpg'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative aspect-video">
        <Image
          src={thumbnailUrl}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{course.authorName}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags?.map((tag) => (
            <span key={typeof tag === 'object' ? tag.id : tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
              {typeof tag === 'object' ? tag.name : tag}
            </span>
          ))}
        </div>

        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="text-[10px] text-red-600 font-medium mb-4">
            Requires: {course.prerequisites.map(p => typeof p === 'object' ? p.courseId : p).join(', ')}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          {course.estimatedDuration && (
            <span className="text-xs text-gray-400">~{course.estimatedDuration} min</span>
          )}
          <Link 
            href={`/courses/${course.slug}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Course
          </Link>
        </div>
      </div>
    </div>
  )
}
