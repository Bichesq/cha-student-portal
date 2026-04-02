'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home, Play, Square, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Course } from '@/types/course'
import { SlidePlayer } from '@/components/course/SlidePlayer'
import { QuizPlayer } from '@/components/course/QuizPlayer'

export default function CoursePlayerClient({ course }: { course: Course }) {
  const [activeTab, setActiveTab] = useState<'material' | 'quiz'>('material')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playOnNext, setPlayOnNext] = useState(false)
  const [ttsVoice, setTtsVoice] = useState('')
  const [ttsSpeed, setTtsSpeed] = useState('1x')
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [hasMounted, setHasMounted] = useState(false)
  
  const synthesisRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    setHasMounted(true)
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)
        if (voices.length > 0 && !ttsVoice) {
          setTtsVoice(voices[0].name)
        }
      }
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [ttsVoice])

  if (!hasMounted) return null

  const totalSteps = course.slides.length + (course.knowledgeCheck?.questions?.length || 0)
  const currentStep = activeTab === 'material' 
    ? currentSlideIndex + 1 
    : course.slides.length + 1 // Simplified for now
  
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  const handlePlay = () => {
    if (!synthesisRef.current) return
    synthesisRef.current.cancel()
    
    const textToRead = activeTab === 'material' 
      ? `${course.slides[currentSlideIndex].slideTitle}. ${course.slides[currentSlideIndex].objective || ''}.`
      : 'Knowledge Check' // Add quiz logic later
      
    const utterance = new SpeechSynthesisUtterance(textToRead)
    const selectedVoice = availableVoices.find(v => v.name === ttsVoice)
    if (selectedVoice) utterance.voice = selectedVoice
    utterance.rate = parseFloat(ttsSpeed.replace('x', ''))
    
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    
    synthesisRef.current.speak(utterance)
  }

  const handleStop = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsPlaying(false)
    }
  }

  const nextSlide = () => {
    if (activeTab === 'material') {
      if (currentSlideIndex < course.slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1)
      } else {
        setActiveTab('quiz')
      }
    }
  }

  const prevSlide = () => {
    if (activeTab === 'quiz') {
      setActiveTab('material')
      setCurrentSlideIndex(course.slides.length - 1)
    } else if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white overflow-hidden font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link 
            href="/courses" 
            className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
          >
            <Home className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {course.title}
          </h1>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('material')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'material' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Learning Material
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'quiz' 
                ? 'bg-[#5EEAD4] text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Knowledge Check
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden flex flex-col px-6">
        {activeTab === 'material' ? (
          <SlidePlayer 
            slides={[course.slides[currentSlideIndex]]} // Pass only current to simplify
            audioEnabled={course.audioEnabled}
            isStandalone={true}
          />
        ) : (
          <div className="flex-grow overflow-y-auto w-full max-w-6xl mx-auto pt-8">
            <QuizPlayer knowledgeCheck={course.knowledgeCheck} isStandalone={true} />
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="px-6 py-6 mt-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Controls Group */}
          <div className="flex items-center gap-2">
            <button 
              onClick={isPlaying ? handleStop : handlePlay}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isPlaying ? 'bg-slate-800 text-white' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
            >
              {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button 
              onClick={prevSlide}
              disabled={activeTab === 'material' && currentSlideIndex === 0}
              className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* TTS Settings */}
            <div className="flex items-center gap-1 ml-2">
              <select 
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                value={ttsVoice}
                onChange={(e) => setTtsVoice(e.target.value)}
              >
                {availableVoices.map(voice => (
                  <option key={voice.name} value={voice.name}>{voice.name}</option>
                ))}
              </select>
              <select 
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(e.target.value)}
              >
                <option value="0.5x">0.5x</option>
                <option value="1x">1x</option>
                <option value="1.5x">1.5x</option>
                <option value="2x">2x</option>
              </select>
            </div>

            <button 
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all ml-2"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Right Group */}
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={playOnNext}
                onChange={(e) => setPlayOnNext(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Play On Next
            </label>

            {/* Progress Bar */}
            <div className="flex items-center gap-0 w-64 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-[#5EEAD4] flex items-center px-3 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              >
                <span className="text-xs font-black text-slate-800">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
