import { defineField, defineType, defineArrayMember } from 'sanity';

export default defineType({
  name: 'awards',
  title: 'Awards Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'The heading for the awards section (e.g. "Awards & Recognition")',
      initialValue: 'Awards & Recognition',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'awardsList',
      title: 'Awards List',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'award',
          title: 'Award',
          fields: [
            defineField({
              name: 'awardName',
              title: 'Award Name',
              type: 'string',
              description: 'The name of the award won (e.g. "Astonishing Awards 2026")',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'awardCategory',
              title: 'Award Category or Title',
              type: 'string',
              description: 'E.g. "Project Of The Day"'
            }),
            defineField({
              name: 'projectName',
              title: 'Project Name',
              type: 'string',
              description: 'The project that won the award (e.g. "Personal Portfolio")',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'awardUrl',
              title: 'Award URL',
              type: 'url',
              description: 'Link to the award page'
            }),
            defineField({
              name: 'awardImage',
              title: 'Award Image / Certificate',
              type: 'image',
              description: 'Upload the award badge or certificate image',
              options: {
                hotspot: true
              }
            })
          ]
        })
      ]
    })
  ]
});
