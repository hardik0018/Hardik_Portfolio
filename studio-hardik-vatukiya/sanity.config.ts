import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Hardik Vatukiya',

  projectId: '1wlu6dtl',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Header Navigation')
              .id('navigation')
              .child(S.document().schemaType('navigation').documentId('navigation')),
            S.listItem()
              .title("Gallery")
              .id("gallery")
              .child(S.document().schemaType("gallery").documentId("gallery")),
            S.listItem()
              .title('Hero Section')
              .id('hero')
              .child(S.document().schemaType('hero').documentId('hero')),
            S.listItem()
              .title('About Section')
              .id('about')
              .child(S.document().schemaType('about').documentId('about')),
            S.listItem()
              .title('Contact Section')
              .id('contact')
              .child(S.document().schemaType('contact').documentId('contact')),
            S.divider(),
            // Collections
            S.documentTypeListItem('skill').title('Skills'),
            S.documentTypeListItem('journeyStage').title('Journey Stages'),
            S.documentTypeListItem('project').title('Projects'),
          ]),
    }),
    visionTool(),
    colorInput(),
  ],

  document: {
    // For singleton types, filter out actions that are not relevant
    actions: (prev, {schemaType}) => {
      if (['navigation', 'hero', 'about', 'contact'].includes(schemaType)) {
        return prev.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
      }
      return prev
    },
  },

  schema: {
    types: schemaTypes,
  },
})
