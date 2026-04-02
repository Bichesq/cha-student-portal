'use client'

import { useState } from 'react'
import { Upload, FileJson, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Edit3 } from 'lucide-react'
import Link from 'next/link'
import { importCoursesAction } from './actions'
import ManualEntryForm from './ManualEntryForm'

type Tab = 'import' | 'manual'

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<Tab>('import')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus('idle')
      setMessage('')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setStatus('parsing')
    try {
      const text = await file.text()
      const json = JSON.parse(text)

      if (!Array.isArray(json)) {
        throw new Error('JSON must be an array of courses.')
      }

      setStatus('uploading')
      const result = await importCoursesAction(json)

      if (result.success) {
        setStatus('success')
        setMessage(result.message)
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Failed to parse JSON file.')
    }
  }

  const handleSuccess = (msg: string) => {
    setStatus('success')
    setMessage(msg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleError = (msg: string) => {
    setStatus('error')
    setMessage(msg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Global Status Messages */}
        <div className="mb-8 space-y-4">
          {status === 'success' && (
            <div className="flex items-start gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900">Success!</p>
                <p className="text-emerald-700 leading-relaxed font-medium">{message}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-4 p-6 bg-rose-50 border border-rose-100 rounded-3xl animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold text-rose-900">Action Failed</p>
                <p className="text-rose-700 leading-relaxed font-medium">{message}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 border-b border-slate-50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <FileJson className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Course Creator</h1>
                  <p className="text-slate-500 font-medium">Build your curriculum manually or via JSON</p>
                </div>
              </div>

              {/* Tabs Control */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
                <button
                  onClick={() => { setActiveTab('import'); setStatus('idle'); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'import' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Import JSON
                </button>
                <button
                  onClick={() => { setActiveTab('manual'); setStatus('idle'); }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === 'manual' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  Manual Entry
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 py-10">
            {activeTab === 'import' ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900">Upload Configuration</h2>
                  <p className="text-slate-500 text-sm">Select a .json file containing course data</p>
                </div>

                {/* Upload Zone */}
                <div 
                  className={`relative border-2 border-dashed rounded-[2rem] p-16 transition-all ${
                    file ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
                  }`}
                >
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="text-center">
                    <Upload className={`w-14 h-14 mx-auto mb-6 transition-colors ${file ? 'text-blue-500' : 'text-slate-400'}`} />
                    {file ? (
                      <div>
                        <p className="text-2xl font-bold text-slate-900 mb-2">{file.name}</p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl font-bold text-slate-900 mb-2">Select JSON File</p>
                        <p className="text-sm text-slate-500 font-medium">Drag and drop or click to browse</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={!file || status === 'parsing' || status === 'uploading'}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  {status === 'parsing' || status === 'uploading' ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      {status === 'parsing' ? 'Validating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6" />
                      Start Import
                    </>
                  )}
                </button>

                <div className="pt-8 text-center">
                  <p className="text-sm text-slate-400 font-medium">
                    The JSON must follow the standard course schema.
                  </p>
                </div>
              </div>
            ) : (
              <ManualEntryForm onSuccess={handleSuccess} onError={handleError} />
            )}
          </div>
          
          <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] text-center">
              Cloud Heroes Africa &bull; Course Administration Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
