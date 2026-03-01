import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'CHA Courses',
    },
    {
      name: 'siteTagline',
      type: 'text',
    },
    {
      name: 'logoImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryColor',
      type: 'text',
      defaultValue: '#0066CC',
    },
    {
      name: 'footerText',
      type: 'text',
    },
  ],
}
