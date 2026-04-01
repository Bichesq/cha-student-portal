'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CourseSlide, TopicItem, Subheading } from '@/types/course'
import { RichTextRenderer } from '../RichTextRenderer'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

interface SlidePlayerProps {
  slides: CourseSlide[]
  audioEnabled: boolean
}

export const SlidePlayer: React.FC<SlidePlayerProps> = ({ slides, audioEnabled }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Handle hydration
  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null // Return null or a skeleton, but don't render until mounted to avoid hydration mismatch
  }
  
  const currentSlide = slides[currentSlideIndex]

  // Cleanup audio/speech on slide change
  useEffect(() => {
    stopAudio()
    return () => {
      stopAudio()
    }
  }, [currentSlideIndex])

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const playAudio = () => {
    if (!audioEnabled) return

    if (currentSlide.audio?.url) {
      const url = currentSlide.audio.url.startsWith('http') 
        ? currentSlide.audio.url 
        : `${PAYLOAD_URL}${currentSlide.audio.url}`
      
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      audioRef.current = new Audio(url)
      audioRef.current.play()
      setIsPlaying(true)
      
      audioRef.current.onended = () => setIsPlaying(false)
    } else {
      // TTS Fallback
      window.speechSynthesis.cancel()
      
      // Extract text content for TTS
      let textToRead = `${currentSlide.slideTitle}. `
      if (currentSlide.objective) textToRead += `Objective: ${currentSlide.objective}. `
      if (currentSlide.content) {
        // Simple extraction from Lexical (hacky but works for basic text)
        const contentText = JSON.stringify(currentSlide.content).replace(/[^\w\s.,!]/g, ' ')
        textToRead += contentText
      }
      
      const utterance = new SpeechSynthesisUtterance(textToRead)
      utterance.onend = () => setIsPlaying(false)
      utterance.onstart = () => setIsPlaying(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  const renderSlideContent = () => {
    const { slideType, slideTitle, content, objective, authorName, authorRole, topicsList, subheadings, bulletPoints } = currentSlide

    return (
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <Image
            src={currentSlide.image?.url ? (currentSlide.image.url.startsWith('http') ? currentSlide.image.url : `${PAYLOAD_URL}${currentSlide.image.url}`) : '/placeholder-slide.jpg'}
            alt={slideTitle}
            fill
            className="object-cover"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 prose prose-slate max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{slideTitle}</h2>
          
          {slideType === 'tutorial' && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <ul className="list-none space-y-3 p-0">
                {bulletPoints?.map((bp, i) => (
                  <li key={i} className="flex items-center text-blue-800 font-medium">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs mr-3 shrink-0">{i+1}</span>
                    {bp.point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slideType === 'intro' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-blue-600">{authorRole || 'Author and Designer'}:</span> {authorName}
                </p>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                  <p className="m-0 italic text-gray-600">
                    <span className="font-bold uppercase text-[10px] tracking-wider block mb-1 font-sans">Objective</span>
                    {objective}
                  </p>
                </div>
              </div>
              {content && <RichTextRenderer content={content} />}
            </div>
          )}

          {slideType === 'topics' && (
            <div>
              <RichTextRenderer content={content} />
              <p className="font-bold text-gray-900 mt-6 mb-3 underline decoration-blue-500 decoration-2 underline-offset-4">Topics to cover:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 ml-0 list-none p-0">
                {topicsList?.map((item: TopicItem, i) => (
                  <li key={i} className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <span className="text-blue-500 mr-2">✦</span>
                    {item.topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {slideType === 'content' && <RichTextRenderer content={content} />}

          {(slideType === 'content-subheadings' || slideType === 'content-list') && (
            <div className="space-y-6">
              {content && <RichTextRenderer content={content} />}
              {subheadings?.map((sub: Subheading, i) => (
                <div key={i} className="border-l-2 border-gray-200 pl-4 py-1">
                  <h3 className="text-lg font-bold text-blue-600 mb-2">{sub.label}</h3>
                  <RichTextRenderer content={sub.body} />
                  {sub.items && sub.items.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {sub.items.map((item, idx) => (
                        <li key={idx} className="text-gray-600">{item.point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {slideType === 'outro' && (
            <div className="space-y-6">
              <RichTextRenderer content={content} />
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h3 className="text-green-800 font-bold mb-3">Next Steps:</h3>
                <ul className="list-none space-y-3 p-0">
                  {bulletPoints?.map((bp, i) => (
                    <li key={i} className="flex items-center text-green-700 font-medium">
                      <span className="w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded-full text-xs mr-3 shrink-0">{i+1}</span>
                      {bp.point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Main Slide Area */}
      <div className="flex-grow p-6 md:p-12 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        {renderSlideContent()}
      </div>

      {/* Footer Controls */}
      <div className="bg-slate-50 border-t border-gray-200 p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-gray-500 order-3 md:order-1">
            Slide <span className="text-gray-900 font-bold">{currentSlideIndex + 1}</span> of <span className="text-gray-900">{slides.length}</span>
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className={`p-2 rounded-full transition-colors ${currentSlideIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {audioEnabled && (
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-blue-100 shadow-sm">
                {!isPlaying ? (
                  <button
                    onClick={playAudio}
                    className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700"
                    aria-label="Play audio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Play</span>
                  </button>
                ) : (
                  <button
                    onClick={stopAudio}
                    className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700"
                    aria-label="Stop audio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <rect width="12" height="12" x="6" y="6" rx="1" />
                    </svg>
                    <span>Stop</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className={`p-2 rounded-full transition-colors ${currentSlideIndex === slides.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="hidden md:block w-32 order-3"></div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 w-full mt-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
