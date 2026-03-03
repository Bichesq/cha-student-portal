import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tags } from './collections/Tags'
import { Courses } from './collections/Courses'
import { SiteSettings } from './globals/SiteSettings'

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
  db: postgresAdapter({
    pool: {
      connectionString: (() => {
        let url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
        
        if (process.env.NODE_ENV === 'production') {
          const envKeys = Object.keys(process.env).filter(key => 
            key.includes('POSTGRES') || key.includes('DATABASE')
          )
          console.log('🔍 [Build Debug] Available Env Vars:', envKeys.join(', ') || 'NONE FOUND')
          
          if (!url) {
            console.error('\n❌ DATABASE ERROR: No connection string found! Link your Vercel Postgres storage to this project.\n')
          } else if (!url.includes('sslmode=')) {
            // Append sslmode=no-verify if not present to force bypass at the connection string level
            url += url.includes('?') ? '&sslmode=no-verify' : '?sslmode=no-verify'
          }
        }
        return url
      })(),
      ssl: process.env.NODE_ENV === 'production' || !!(process.env.POSTGRES_URL || process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
    },
  }),
  sharp,
  plugins: [],
})
