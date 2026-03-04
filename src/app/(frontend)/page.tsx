import Link from 'next/link'
import { ArrowRight, GraduationCap, Layout, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="w-3 h-3" />
              Welcome to the New Era of Learning
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Master Your Skills with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                CHA Student Portal
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed">
              Explore our comprehensive course catalog, track your progress, and achieve your learning goals with our premium educational platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courses"
                className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Browse Catalog
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/admin/import"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <Layout className="w-5 h-5 text-slate-400" />
                Course Importer
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Expert Content',
                  desc: 'Courses designed by industry veterans and top educators.',
                  icon: GraduationCap,
                  color: 'bg-blue-500'
                },
                {
                  title: 'Interactive Learning',
                  desc: 'Slide-based content with interactive knowledge checks.',
                  icon: Layout,
                  color: 'bg-sky-500'
                },
                {
                  title: 'Progress Tracking',
                  desc: 'Keep tabs on your achievements and learning milestones.',
                  icon: Sparkles,
                  color: 'bg-indigo-500'
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
