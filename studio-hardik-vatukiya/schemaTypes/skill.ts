import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Skill Name', type: 'string' }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'percentage', title: 'Proficiency Percentage', type: 'number', validation: Rule => Rule.min(0).max(100) }),
    
    defineField({ name: 'icon', title: 'Preset Icon Name', type: 'string', description: 'e.g. figma, framer, react, nextjs, gsap, three, tailwind, ui, js, motion, ts' }),
    defineField({ name: 'customIcon', title: 'Custom Skill Icon (Image)', type: 'image' }), 
    
    // Colors (using @sanity/color-input)
    defineField({ name: 'accentColor', title: 'Accent Color', type: 'color' }),
    defineField({ name: 'tintColor', title: 'Tint Color', type: 'color' }),
    
    // Layout Modifiers corresponding to UI classes
    defineField({
      name: 'size',
      title: 'Card Size',
      type: 'string',
      options: { list: ['wide', 'tall', 'mini', 'xl', 'default'] }
    }),
    defineField({
      name: 'special',
      title: 'Special Effect',
      type: 'string',
      options: { list: [{ title: 'None', value: '' }, { title: 'Curve', value: 'curve' }, { title: 'Highlight', value: 'highlight' }] }
    }),
  ]
})
