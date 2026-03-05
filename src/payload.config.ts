import dns from 'dns'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Courses } from './collections/Courses'
import { SiteSettings } from './globals/SiteSettings'

dns.setDefaultResultOrder('ipv4first');
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Tags, Courses],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'].filter(Boolean),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  db: postgresAdapter({
    push: false,
    pool: {
      connectionString: (() => {
        let url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
        
        if (url && (process.env.NODE_ENV === 'production' || !url.includes('localhost'))) {
          // Only append sslmode if not already present
          if (!url.includes('sslmode=')) {
            if (!url.includes('?')) {
              url += '?sslmode=no-verify'
            } else {
              url += '&sslmode=no-verify'
            }
          }
          
          console.log('🔍 [Build Debug] Database URL in use');
          
          if (!url) {
            console.error('\n❌ DATABASE ERROR: No connection string found!\n')
          }
        }
        return url
      })(),
      ssl: process.env.NODE_ENV === 'production' || !!(process.env.POSTGRES_URL || process.env.DATABASE_URL) 
        ? { rejectUnauthorized: false } 
        : false,
    },
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_DEFAULT_FROM || 'onboarding@resend.dev',
    defaultFromName: 'CHA Student Portal',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
