import type { CollectionConfig } from 'payload'
import { slugify } from '../utilities/slugify'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'courseId', 'difficulty', 'status'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = slugify(data.title)
        }

        if (data && data.courseId) {
          if (data.courseId.startsWith('B-')) {
            data.difficulty = 'beginner'
          } else if (data.courseId.startsWith('CP-')) {
            data.difficulty = 'intermediate'
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'courseId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Platform course code e.g. "CP-VN01"',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Maps to <h1> in original index.htm',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'objective',
      type: 'richText',
      required: true,
      admin: {
        description: 'Maps to Objective: text on the intro slide.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: {
        description: 'The body paragraph following the objective.',
      },
    },
    {
      name: 'topics',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'topic',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorRole',
      type: 'text',
      required: true,
      defaultValue: 'Author and Designer',
    },
    {
      name: 'contentModel',
      type: 'select',
      required: true,
      defaultValue: 'slides',
      options: [{ label: 'Slides', value: 'slides' }],
    },
    {
      name: 'audioEnabled',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      label: 'Duration (minutes)',
      admin: {
        position: 'sidebar',
      },
      min: 1,
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slides',
      type: 'array',
      required: true,
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value && Array.isArray(value)) {
              return value.map((slide, index) => ({
                ...slide,
                order: index + 1,
              }))
            }
            return value
          },
        ],
      },
      fields: [
        {
          name: 'order',
          type: 'number',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'slideType',
          type: 'select',
          required: true,
          options: [
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Intro', value: 'intro' },
            { label: 'Topics', value: 'topics' },
            { label: 'Content', value: 'content' },
            { label: 'Content Subheadings', value: 'content-subheadings' },
            { label: 'Content List', value: 'content-list' },
            { label: 'Outro', value: 'outro' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Slide Image',
          required: true,
        },
        {
          name: 'audio',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'slideTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          admin: {
            condition: (data, siblingData) =>
              [
                'content',
                'content-subheadings',
                'content-list',
                'topics',
                'tutorial',
                'outro',
              ].includes(siblingData?.slideType),
          },
        },
        {
          name: 'objective',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.slideType === 'intro',
          },
        },
        {
          name: 'authorName',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.slideType === 'intro',
          },
        },
        {
          name: 'authorRole',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.slideType === 'intro',
          },
        },
        {
          name: 'topicsList',
          type: 'array',
          admin: {
            condition: (data, siblingData) => siblingData?.slideType === 'topics',
          },
          fields: [{ name: 'topic', type: 'text', required: true }],
        },
        {
          name: 'subheadings',
          type: 'array',
          admin: {
            condition: (data, siblingData) =>
              ['content-subheadings', 'content-list'].includes(
                siblingData?.slideType,
              ),
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'body', type: 'richText' },
            {
              name: 'items',
              type: 'array',
              fields: [{ name: 'point', type: 'text', required: true }],
            },
          ],
        },
        {
          name: 'bulletPoints',
          type: 'array',
          admin: {
            condition: (data, siblingData) =>
              ['tutorial', 'outro', 'content-list'].includes(
                siblingData?.slideType,
              ),
          },
          fields: [{ name: 'point', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'knowledgeCheck',
      type: 'group',
      fields: [
        {
          name: 'allowPerQuestionSubmit',
          type: 'checkbox',
          required: true,
          defaultValue: true,
        },
        {
          name: 'playOnNextDefault',
          type: 'checkbox',
          required: true,
          defaultValue: false,
        },
        {
          name: 'showProgress',
          type: 'checkbox',
          required: true,
          defaultValue: true,
        },
        {
          name: 'passingScore',
          type: 'number',
          required: true,
          defaultValue: 100,
          min: 0,
          max: 100,
        },
        {
          name: 'questions',
          type: 'array',
          hooks: {
            beforeChange: [
              ({ value }) => {
                if (value && Array.isArray(value)) {
                  return value.map((q: any, index) => ({ ...q, order: index + 1 }))
                }
                return value
              },
            ],
          },
          validate: (value) => {
            if (!value) return true
            for (const q of value as any[]) {
              if (q.questionType === 'mcq' && q.answers) {
                const correctCount = q.answers.filter(
                  (a: any) => a.isCorrect,
                ).length
                if (correctCount > 1) {
                  return 'Only one answer can be correct.'
                }
              }
            }
            return true
          },
          fields: [
            {
              name: 'order',
              type: 'number',
              required: true,
              admin: {
                readOnly: true,
              },
            },
            {
              name: 'questionType',
              type: 'select',
              required: true,
              options: [
                { label: 'Multiple Choice', value: 'mcq' },
                { label: 'Completion', value: 'completion' },
              ],
            },
            {
              name: 'question',
              type: 'text',
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.questionType === 'mcq',
              },
            },
            {
              name: 'answers',
              type: 'array',
              minRows: 4,
              maxRows: 4,
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.questionType === 'mcq',
              },
              fields: [
                {
                  name: 'ansId',
                  type: 'text',
                  label: 'Answer ID (a/b/c/d)',
                  required: true,
                },
                {
                  name: 'ans',
                  type: 'text',
                  label: 'Answer Text',
                  required: true,
                },
                {
                  name: 'isCorrect',
                  type: 'checkbox',
                  label: 'Is Correct Answer?',
                  required: true,
                },
              ],
            },
            {
              name: 'completionMessage',
              type: 'text',
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.questionType === 'completion',
              },
            },
            {
              name: 'completionSubtext',
              type: 'richText',
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.questionType === 'completion',
              },
            },
          ],
        },
      ],
    },
  ],
}
