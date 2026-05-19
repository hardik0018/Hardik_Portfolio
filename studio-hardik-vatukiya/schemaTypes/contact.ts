import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact Section',
  type: 'document', // Singleton
  fields: [
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      initialValue: 'Interested in working together?',
    }),
    defineField({
      name: 'subHeading',
      title: 'Sub Heading',
      type: 'string',
      initialValue: "let's build something great !",
    }),
    defineField({name: 'email', title: 'Contact Email', type: 'string'}),
    defineField({
      name: 'availabilityStatus',
      title: 'Availability Status',
      type: 'string',
      initialValue: 'Available for freelance work',
    }),
    defineField({
      name: 'timing',
      title: 'Timing',
      type: 'string',
      initialValue: 'Mon - Fri, 9AM - 6PM IST',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Remote Worldwide',
    }),
    defineField({
      name: 'projectTypes',
      title: 'Dropdown Project Types',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'services',
      title: 'How I can help (Services)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Service Name', type: 'string'},
            {name: 'description', title: 'Description', type: 'string'},
            {name: 'icon', title: 'Lucide Icon Name', type: 'string'},
          ],
        },
      ],
    }),
  ],
})
