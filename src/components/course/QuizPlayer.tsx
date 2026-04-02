'use client'

import React, { useState } from 'react'
import { KnowledgeCheck, CourseAnswer } from '@/types/course'

interface QuizPlayerProps {
  knowledgeCheck: KnowledgeCheck
  isStandalone?: boolean
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ knowledgeCheck }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnsId, setSelectedAnsId] = useState<string | null>(null)
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, { ansId: string, isCorrect: boolean }>>({})

  const questions = knowledgeCheck.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  const isMcq = currentQuestion.questionType === 'mcq'
  
  const handleSubmit = () => {
    if (!selectedAnsId || !isMcq) return
    const answer = currentQuestion.answers?.find(a => a.ansId === selectedAnsId)
    const isCorrect = !!answer?.isCorrect
    setSubmittedAnswers(prev => ({ ...prev, [currentQuestionIndex]: { ansId: selectedAnsId, isCorrect } }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnsId(null)
    }
  }

  const submission = submittedAnswers[currentQuestionIndex]

  return (
    <div className="w-full max-w-5xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-10">
        {/* Question Text */}
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {currentQuestionIndex + 1}) {currentQuestion.question}
        </h3>

        {/* MCQ Options */}
        <div className="space-y-4">
          {currentQuestion.answers?.map((answer: CourseAnswer) => {
            const isSelected = selectedAnsId === answer.ansId
            const isSubmitted = !!submission
            
            let stateClasses = 'border-slate-100 bg-white hover:bg-slate-50'
            if (isSubmitted) {
              if (answer.isCorrect) stateClasses = 'border-emerald-200 bg-emerald-50 text-emerald-900'
              else if (isSelected) stateClasses = 'border-rose-200 bg-rose-50 text-rose-900'
              else stateClasses = 'border-slate-100 bg-slate-50 opacity-60'
            } else if (isSelected) {
              stateClasses = 'border-blue-200 bg-blue-50 ring-2 ring-blue-500 ring-inset'
            }

            return (
              <label 
                key={answer.id} 
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${stateClasses}`}
              >
                <input
                  type="radio"
                  name="quiz-answer"
                  value={answer.ansId}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => setSelectedAnsId(answer.ansId)}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">{answer.ansId})</span>
                  <span className="text-lg font-medium text-slate-700">{answer.ans}</span>
                </div>
              </label>
            )
          })}
        </div>

        {/* Internal Navigation (Submit/Next) */}
        {!submission ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnsId}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-all"
          >
            Submit Answer
          </button>
        ) : (
          <div className="flex items-center gap-4">
             <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-900 transition-all disabled:opacity-50"
            >
              {currentQuestionIndex === questions.length - 1 ? 'End of Check' : 'Continue'}
            </button>
            {submission.isCorrect ? (
              <span className="text-emerald-600 font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                Correct! Well done.
              </span>
            ) : (
              <span className="text-rose-600 font-bold">Incorrect. Please review the material.</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
