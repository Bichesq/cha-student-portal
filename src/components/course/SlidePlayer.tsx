'use client'

import React from 'react'
import Image from 'next/image'
import { CourseSlide } from '@/types/course'
import { RichTextRenderer } from '../RichTextRenderer'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

interface SlidePlayerProps {
  slides: CourseSlide[]
  audioEnabled: boolean
  isStandalone?: boolean
}

export const SlidePlayer: React.FC<SlidePlayerProps> = ({ slides }) => {
  // Since parent passes only one slide now, we just use the first item
  const currentSlide = slides[0]
  if (!currentSlide) return null

  const { slideTitle, content, objective, authorName, authorRole, image } = currentSlide

  return (
    <div className="flex flex-col md:flex-row gap-12 items-stretch min-h-[60vh] max-w-7xl mx-auto py-4">
      {/* Left Side: Large Image (approx 65%) */}
      <div className="w-full md:w-[65%] relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex-shrink-0">
        <Image
          src={image?.url ? (image.url.startsWith('http') ? image.url : `${PAYLOAD_URL}${image.url}`) : '/placeholder-slide.jpg'}
          alt={slideTitle}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side: Content Column (approx 35%) */}
      <div className="w-full md:w-[35%] flex flex-col justify-start space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">
            {slideTitle}
          </h2>
          <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
        </div>

        {objective && (
          <div className="space-y-1">
            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Objective:</p>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {objective}
            </p>
          </div>
        )}

        <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed">
          {content && <RichTextRenderer content={content} />}
        </div>

        {(authorName || authorRole) && (
          <div className="mt-auto pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-400">
              {authorRole || 'Author and Designer'}: <span className="text-slate-900 ml-1">{authorName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
