'use client'

import React, { useState, useEffect } from 'react'
import { KnowledgeCheck, CourseAnswer } from '@/types/course'
import { RichTextRenderer } from '../RichTextRenderer'

interface QuizPlayerProps {
  knowledgeCheck: KnowledgeCheck
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ knowledgeCheck }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnsId, setSelectedAnsId] = useState<string | null>(null)
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, { ansId: string, isCorrect: boolean }>>({})
  const [playOnNext, setPlayOnNext] = useState(knowledgeCheck.playOnNextDefault)
  const [quizComplete, setQuizComplete] = useState(false)

  const questions = knowledgeCheck.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const isMcq = currentQuestion?.questionType === 'mcq'
  
  const mcqCount = questions.filter(q => q.questionType === 'mcq').length
  const correctCount = Object.values(submittedAnswers).filter(a => a.isCorrect).length
  const progressPercent = mcqCount > 0 ? Math.round((correctCount / mcqCount) * 100) : 0

  useEffect(() => {
    if (currentQuestion?.questionType === 'completion') {
      setQuizComplete(true)
    }
  }, [currentQuestion])

  const handleSubmit = () => {
    if (!selectedAnsId || !isMcq) return

    const answer = currentQuestion.answers?.find(a => a.ansId === selectedAnsId)
    const isCorrect = !!answer?.isCorrect

    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: { ansId: selectedAnsId, isCorrect }
    }))

    if (isCorrect && playOnNext) {
      setTimeout(() => {
        nextQuestion()
      }, 1000)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnsId(null)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevAns = submittedAnswers[currentQuestionIndex - 1]
      setSelectedAnsId(prevAns?.ansId || null)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnsId(null)
    setSubmittedAnswers({})
    setQuizComplete(false)
  }

  if (questions.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">No quiz questions available for this course.</h3>
      </div>
    )
  }

  const submission = submittedAnswers[currentQuestionIndex]

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full items-center justify-center py-8">
      {/* Quiz Header */}
      <div className="w-full mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={playOnNext}
              onChange={(e) => setPlayOnNext(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            Play On Next
          </label>
          <div className="text-sm font-bold text-gray-500">
            Question <span className="text-blue-600">{currentQuestionIndex + 1}</span> of {questions.length}
          </div>
        </div>

        {knowledgeCheck.showProgress && (
          <div className="relative w-full h-8 bg-gray-100 rounded-full border border-gray-200 overflow-hidden shadow-inner">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out flex items-center justify-end px-4 ${progressPercent >= knowledgeCheck.passingScore ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent > 10 && (
                <span className="text-white text-xs font-black drop-shadow-sm">{progressPercent}%</span>
              )}
            </div>
            {progressPercent <= 10 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">{progressPercent}%</span>
            )}
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 p-8 md:p-12">
        {!quizComplete && isMcq ? (
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-gray-900 leading-tight">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.answers?.map((answer: CourseAnswer) => {
                const isSelected = selectedAnsId === answer.ansId
                const isSubmitted = !!submission
                
                let borderColor = 'border-gray-200'
                let bgColor = 'bg-white'
                let textColor = 'text-gray-700'

                if (isSubmitted) {
                  if (answer.isCorrect) {
                    borderColor = 'border-green-500'
                    bgColor = 'bg-green-50'
                    textColor = 'text-green-800'
                  } else if (isSelected && !answer.isCorrect) {
                    borderColor = 'border-red-500'
                    bgColor = 'bg-red-50'
                    textColor = 'text-red-800'
                  }
                } else if (isSelected) {
                  borderColor = 'border-blue-600 ring-2 ring-blue-600 ring-inset'
                  bgColor = 'bg-blue-50'
                  textColor = 'text-blue-900'
                }

                return (
                  <label 
                    key={answer.id} 
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${borderColor} ${bgColor} ${textColor} ${!isSubmitted && 'hover:border-blue-300'}`}
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
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-lg font-medium">{answer.ans}</span>
                    
                    {isSubmitted && answer.isCorrect && (
                      <span className="ml-auto text-green-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </label>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="text-sm font-bold">
                {submission && (
                  submission.isCorrect 
                    ? <span className="text-green-600 flex items-center gap-1">✓ Correct!</span>
                    : <span className="text-red-600 flex items-center gap-1">✗ Try again</span>
                )}
              </div>
              
              <div className="flex gap-4">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={prevQuestion}
                    className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Back
                  </button>
                )}

                {!submission ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAnsId}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${selectedAnsId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-gray-300 cursor-not-allowed'}`}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full mb-4">
              <span className="text-5xl">🏆</span>
            </div>
            
            <h3 className="text-3xl font-black text-gray-900">
              {currentQuestion?.completionMessage || "Congratulations!"}
            </h3>
            
            <div className="text-gray-600 text-lg max-w-md mx-auto">
              {currentQuestion?.completionSubtext ? (
                <RichTextRenderer content={currentQuestion.completionSubtext} />
              ) : (
                <p>You have completed the Knowledge Check.</p>
              )}
            </div>

            <div className="pt-8">
               <button
                  onClick={resetQuiz}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
                >
                  Retake Quiz
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
