import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document', // Singleton
  fields: [
    defineField({ name: 'name', title: 'Hero Name', type: 'string' }),
    defineField({
      name: 'portraitImage',
      title: 'Portrait Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background SVG/Image',
      type: 'image',
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({ name: 'copyrightText', title: 'Copyright Text', type: 'string', initialValue: '©2026' }),
  ]
})
