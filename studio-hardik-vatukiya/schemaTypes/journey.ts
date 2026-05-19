import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'journeyStage',
  title: 'Journey Stage',
  type: 'document',
  fields: [
    defineField({ name: 'date', title: 'Date / Duration', type: 'string' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ 
      name: 'icon', 
      title: 'Lucide Icon Name', 
      type: 'string',
      options: { list: ['Sparkles', 'GraduationCap', 'Briefcase', 'Rocket'] } // Maps to ICON_MAP
    }),
  ]
})
