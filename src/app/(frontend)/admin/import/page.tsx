'use client'

import { useState } from 'react'
import { Upload, FileJson, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { importCoursesAction } from './actions'

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [importCount, setImportCount] = useState(0)

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
        setImportCount(result.count || 0)
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Failed to parse JSON file.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-8 py-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Course Creator</h1>
                <p className="text-slate-500 font-medium">Create courses using a JSON configuration</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Upload Zone */}
              <div 
                className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${
                  file ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300 bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${file ? 'text-blue-500' : 'text-slate-400'}`} />
                  {file ? (
                    <div>
                      <p className="text-xl font-bold text-slate-900 mb-1">{file.name}</p>
                      <p className="text-sm text-slate-500 font-medium">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-bold text-slate-900 mb-1">Select JSON Configuration</p>
                      <p className="text-sm text-slate-500 font-medium">Drag and drop or click to browse</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleImport}
                disabled={!file || status === 'parsing' || status === 'uploading'}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {status === 'parsing' || status === 'uploading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {status === 'parsing' ? 'Validating...' : 'Creating...'}
                  </>
                ) : (
                  'Start Creation'
                )}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-start gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-900">Success!</p>
                    <p className="text-emerald-700 leading-relaxed font-medium">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start gap-4 p-6 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-bold text-rose-900">Import Failed</p>
                    <p className="text-rose-700 leading-relaxed font-medium">{message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center">
              Requires administrative privileges
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
