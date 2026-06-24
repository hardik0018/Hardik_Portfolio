import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Section',
  type: 'document', // Singleton
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', initialValue: "Hey, I'm" }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'bio', title: 'Bio Text', type: 'text' }),
    defineField({ name: 'philosophy', title: 'Philosophy Quote', type: 'text' }),
    defineField({
      name: 'experience',
      title: 'Experience / Timeline',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Company / Title', type: 'string' },
          { name: 'role', title: 'Role / Duration', type: 'string' },
          { name: 'mark', title: 'Icon Mark (Text or "spark")', type: 'string' }
        ]
      }]
    })
  ]
})
