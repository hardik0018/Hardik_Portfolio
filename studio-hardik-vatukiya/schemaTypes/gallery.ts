import {defineField, defineType} from 'sanity'

const placementOptions = [
  {title: 'After About', value: 'afterAbout'},
  {title: 'After Projects', value: 'afterProjects'},
  {title: 'After Journey', value: 'afterJourney'},
  {title: 'Before Contact', value: 'beforeContact'},
]


export default defineType({
  name: 'gallery',
  title: 'Gallery Section',
  type: 'document',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show gallery on landing page',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'placement',
      title: 'Landing page position',
      type: 'string',
      initialValue: 'afterAbout',
      options: {
        list: placementOptions,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Gallery',
      validation: (Rule) => Rule.max(32),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'In Focus',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      initialValue: 'A glimpse into my world of ideas, craft, and meaningful details.',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'items',
      title: 'Gallery images',
      type: 'array',
      validation: (Rule) => Rule.min(3).max(12),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (Rule) => Rule.max(80),
            }),
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Gallery image',
                media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'placement',
    },
    prepare({title, subtitle}) {
      const placement = placementOptions.find((option) => option.value === subtitle)?.title

      return {
        title: title || 'Gallery Section',
        subtitle: placement ? `Landing position: ${placement}` : 'Gallery Section',
      }
    },
  },
})
