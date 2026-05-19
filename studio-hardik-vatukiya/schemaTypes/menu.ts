import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Header Navigation',
  type: 'document', // Configure as a singleton in desk structure
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'url', title: 'URL (Route or Hash)', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'actionButton',
      title: 'Action Button',
      type: 'object',
      fields: [
        {name: 'title', title: 'Button Text', type: 'string', initialValue: "Let's Connect"},
        {name: 'url', title: 'Button URL', type: 'string', initialValue: '/#contact'},
      ],
    }),
  ],
})
