'use client'

import { useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { createManualCourseAction } from './actions'

interface Slide {
  slideType: string
  slideTitle: string
  content?: string
  objective?: string
  authorName?: string
  authorRole?: string
  bulletPoints?: { point: string }[]
  topicsList?: { topic: string }[]
  subheadings?: { label: string; body?: string; items?: { point: string }[] }[]
  imageFile?: File | null
}

interface Question {
  questionType: 'mcq' | 'completion'
  question?: string
  answers?: { ansId: string; ans: string; isCorrect: boolean }[]
  completionMessage?: string
  completionSubtext?: string
}

export default function ManualEntryForm({ 
  onSuccess, 
  onError 
}: { 
  onSuccess: (msg: string) => void
  onError: (msg: string) => void 
}) {
  const [loading, setLoading] = useState(false)
  const [courseData, setCourseData] = useState({
    courseId: '',
    title: '',
    authorName: '',
    authorRole: 'Author and Designer',
    description: '',
    objective: '',
    difficulty: 'beginner',
    status: 'published',
    slides: [] as Slide[],
    knowledgeCheck: {
      passingScore: 100,
      questions: [] as Question[]
    }
  })

  const [expandedSlides, setExpandedSlides] = useState<number[]>([])

  const addSlide = () => {
    const newSlide: Slide = {
      slideType: 'content',
      slideTitle: '',
    }
    setCourseData({ ...courseData, slides: [...courseData.slides, newSlide] })
    setExpandedSlides([...expandedSlides, courseData.slides.length])
  }

  const removeSlide = (index: number) => {
    const newSlides = [...courseData.slides]
    newSlides.splice(index, 1)
    setCourseData({ ...courseData, slides: newSlides })
  }

  const toggleSlide = (index: number) => {
    if (expandedSlides.includes(index)) {
      setExpandedSlides(expandedSlides.filter(i => i !== index))
    } else {
      setExpandedSlides([...expandedSlides, index])
    }
  }

  const updateSlide = (index: number, updates: Partial<Slide>) => {
    const newSlides = [...courseData.slides]
    newSlides[index] = { ...newSlides[index], ...updates }
    setCourseData({ ...courseData, slides: newSlides })
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      questionType: 'mcq',
      question: '',
      answers: [
        { ansId: 'a', ans: '', isCorrect: true },
        { ansId: 'b', ans: '', isCorrect: false },
        { ansId: 'c', ans: '', isCorrect: false },
        { ansId: 'd', ans: '', isCorrect: false },
      ]
    }
    setCourseData({ 
      ...courseData, 
      knowledgeCheck: { 
        ...courseData.knowledgeCheck, 
        questions: [...courseData.knowledgeCheck.questions, newQuestion] 
      } 
    })
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...courseData.knowledgeCheck.questions]
    newQuestions.splice(index, 1)
    setCourseData({ 
      ...courseData, 
      knowledgeCheck: { ...courseData.knowledgeCheck, questions: newQuestions } 
    })
  }

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...courseData.knowledgeCheck.questions]
    newQuestions[index] = { ...newQuestions[index], ...updates }
    setCourseData({ 
      ...courseData, 
      knowledgeCheck: { ...courseData.knowledgeCheck, questions: newQuestions } 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      
      // Separate files from JSON
      const { slides, ...rest } = courseData
      const cleanSlides = slides.map((s, i) => {
        const { imageFile, ...slideRest } = s
        if (imageFile) {
          formData.append(`slideImage_${i}`, imageFile)
        }
        return slideRest
      })

      const finalData = { ...rest, slides: cleanSlides }
      formData.append('courseData', JSON.stringify(finalData))

      const result = await createManualCourseAction(formData)
      if (result.success) {
        onSuccess(result.message)
      } else {
        onError(result.message)
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Basic Info */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</div>
          Basic Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Course ID (e.g. CP-VN01)</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={courseData.courseId}
              onChange={e => setCourseData({ ...courseData, courseId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Course Title</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={courseData.title}
              onChange={e => setCourseData({ ...courseData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Author Name</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={courseData.authorName}
              onChange={e => setCourseData({ ...courseData, authorName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Author Role</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={courseData.authorRole}
              onChange={e => setCourseData({ ...courseData, authorRole: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Objective</label>
          <textarea 
            required
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={courseData.objective}
            onChange={e => setCourseData({ ...courseData, objective: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea 
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={courseData.description}
            onChange={e => setCourseData({ ...courseData, description: e.target.value })}
          />
        </div>
      </div>

      {/* Slides */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">2</div>
            Slides ({courseData.slides.length})
          </h2>
          <button 
            type="button"
            onClick={addSlide}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        <div className="space-y-4">
          {courseData.slides.map((slide, index) => (
            <div key={index} className="border border-slate-100 rounded-2xl bg-slate-50/50 overflow-hidden">
              <div 
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => toggleSlide(index)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-400">#{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="font-bold text-slate-900">{slide.slideTitle || 'Untitled Slide'}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-[10px] font-bold uppercase rounded text-slate-600">{slide.slideType}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeSlide(index); }}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedSlides.includes(index) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {expandedSlides.includes(index) && (
                <div className="p-6 bg-white border-t border-slate-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-full">
                      <label className="text-sm font-bold text-slate-700">Slide Title</label>
                      <input 
                        required
                        placeholder="e.g. Introduction to Computer Hardware"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={slide.slideTitle}
                        onChange={e => updateSlide(index, { slideTitle: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Slide Objective</label>
                    <input 
                      placeholder="e.g. Learn the components of a computer..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={slide.objective || ''}
                      onChange={e => updateSlide(index, { objective: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Content / Body Text</label>
                    <textarea 
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Welcome to the world of computers!..."
                      value={slide.content || ''}
                      onChange={e => updateSlide(index, { content: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Slide Image (Large Primary Image)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative group w-full">
                        <input 
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={e => {
                            if (e.target.files?.[0]) {
                              updateSlide(index, { imageFile: e.target.files[0] })
                            }
                          }}
                        />
                        <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-blue-300 transition-all">
                          {slide.imageFile ? (
                            <div className="text-center p-2 flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-blue-500" />
                              <p className="text-xs font-bold text-blue-600 truncate max-w-[200px]">{slide.imageFile.name}</p>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                              <span className="text-xs font-bold text-slate-400">Click or Drag to Upload Large Slide Image</span>
                            </>
                          )}
                        </div>
                      </div>
                      {slide.imageFile && (
                        <button 
                          type="button"
                          onClick={() => updateSlide(index, { imageFile: null })}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {courseData.slides.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-slate-400 font-medium">No slides added yet. Click &quot;Add Slide&quot; to begin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Knowledge Check */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">3</div>
            Knowledge Check ({courseData.knowledgeCheck.questions.length})
          </h2>
          <button 
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            <HelpCircle className="w-4 h-4" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {courseData.knowledgeCheck.questions.map((q, index) => (
            <div key={index} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-4">
               <div className="flex items-center justify-between">
                 <h3 className="font-bold text-slate-900">Question #{index + 1}</h3>
                 <button 
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Question Text</label>
                    <input 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={q.question || ''}
                      onChange={e => updateQuestion(index, { question: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700">Answers (Exactly 4)</label>
                    <div className="grid grid-cols-1 gap-3">
                      {q.answers?.map((ans, ansIdx) => (
                        <div key={ansIdx} className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name={`correct_${index}`}
                            checked={ans.isCorrect}
                            onChange={() => {
                              const newAns = q.answers?.map((a, i) => ({ ...a, isCorrect: i === ansIdx }))
                              updateQuestion(index, { answers: newAns })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <input 
                            required
                            placeholder={`Answer ${ans.ansId.toUpperCase()}`}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            value={ans.ans}
                            onChange={e => {
                              const newAns = [...(q.answers || [])]
                              newAns[ansIdx] = { ...newAns[ansIdx], ans: e.target.value }
                              updateQuestion(index, { answers: newAns })
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Course...
            </>
          ) : (
            'Finalize and Create Course'
          )}
        </button>
      </div>
    </form>
  )
}
