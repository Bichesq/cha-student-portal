import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSiteSettings } from '@/lib/payload'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings()
    return {
      title: settings.siteName,
      description: settings.siteTagline || 'Learning Platform',
    }
  } catch (_error) {
    return {
      title: 'CHA Courses',
      description: 'Learning Platform',
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let settings
  try {
    settings = await getSiteSettings()
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
  }

  const logoUrl = settings?.logoImage?.url 
    ? (settings.logoImage.url.startsWith('http') ? settings.logoImage.url : `${PAYLOAD_URL}${settings.logoImage.url}`)
    : null

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/courses" className="flex items-center gap-2 group">
                {logoUrl ? (
                  <div className="relative w-8 h-8">
                    <Image src={logoUrl} alt={settings?.siteName || 'Logo'} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black group-hover:bg-blue-700 transition-colors">
                    C
                  </div>
                )}
                <span className="font-black text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                  {settings?.siteName || 'CHA Courses'}
                </span>
              </Link>
              
              <nav className="flex items-center gap-6">
                <Link href="/courses" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                  Course Catalog
                </Link>
                <div className="h-6 w-[1px] bg-gray-200"></div>
                <button className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                  My Progress
                </button>
              </nav>
            </div>
          </div>
        </header>

        {children}

        {settings?.footerText && (
          <footer className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-gray-500 font-medium">{settings.footerText}</p>
            </div>
          </footer>
        )}
      </body>
    </html>
  )
}
