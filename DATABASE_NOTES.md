# DATABASE_NOTES.md — Content Database & Schemas

The application uses **Sanity.io Headless CMS** as its data store. Content is fetched dynamically via GROQ queries over a production dataset, with caching revalidated via tags.

---

## 1. Database Connection & Configs

* **Database Type**: Sanity CMS (NoSQL JSON Documents)
* **Project ID**: `1wlu6dtl`
* **Dataset**: `production`
* **API Version**: `2024-03-16`
* **Client File**: [sanity.client.ts](file:///e:/Home/Hardik_Portfolio/frontend/lib/sanity.client.ts) (Instantiates createClient)
* **Live Query Hook**: [sanity.live.ts](file:///e:/Home/Hardik_Portfolio/frontend/lib/sanity.live.ts) (Configures sanityFetch for live/ISR data loading)

---

## 2. Content Schemas & Models

The following schemas are declared under the Sanity CMS Studio.

### Document Index

| Model | Collection | Field | Type | Required | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **navigation** | `navigation` | `title` | `string` | No | Header menu title |
| | | `menuItems` | `array` | No | Navigation link objects containing `{ title, url }` |
| | | `actionButton` | `object` | No | Target header action button config `{ title, url }` |
| **hero** | `hero` | `name` | `string` | No | Display name shown in landing page Hero banner |
| | | `portraitImage` | `image` | No | Main profile image (hotspot enabled, includes `alt` text) |
| | | `backgroundImage` | `image` | No | Background graphical overlay vector asset (includes `alt` text) |
| | | `copyrightText` | `string` | No | Text displayed in bottom-right anchor card (Default: `"©2026"`) |
| **about** | `about` | `tagline` | `string` | No | Greeting tagline (Default: `"Hey, I'm"`) |
| | | `name` | `string` | No | Developer full name string |
| | | `bio` | `text` | No | Paragraph text introducing expertise |
| | | `philosophy` | `text` | No | Philosophy quote snippet |
| | | `experience` | `array` | No | Experience timeline items `{ title (Company), role, mark (Icon or "spark") }` |
| **skill** | `skill` | `name` | `string` | No | Skill label (e.g. "React") |
| | | `category` | `string` | No | Group category classification |
| | | `percentage` | `number` | No | Proficiency level. Validated to be between `0` and `100` |
| | | `icon` | `string` | No | Preset Icon string identifier (e.g., 'figma', 'react', 'nextjs') |
| | | `customIcon` | `image` | No | Custom asset upload slot for new skill icons |
| | | `accentColor` | `color` | No | Grid cell base highlight color (using `@sanity/color-input`) |
| | | `tintColor` | `color` | No | Grid cell offset tint color (using `@sanity/color-input`) |
| | | `size` | `string` | No | Size options: `'wide'`, `'tall'`, `'mini'`, `'xl'`, `'default'` |
| | | `special` | `string` | No | Special styles: `''` (None), `'curve'`, `'highlight'` |
| **journeyStage**| `journeyStage`| `date` | `string` | No | Milestone time interval label (e.g., "2023 - Present") |
| | | `title` | `string` | No | Milestone headline |
| | | `subtitle` | `string` | No | Company, school, or location details |
| | | `description` | `text` | No | Narrative description of achievements |
| | | `icon` | `string` | No | Preset Lucide icons: `'Sparkles'`, `'GraduationCap'`, `'Briefcase'`, `'Rocket'` |
| **project** | `project` | `title` | `string` | No | Showcase project title |
| | | `slug` | `slug` | **Yes** | Unique URL routing path segment. Max 96 characters. |
| | | `description` | `string` | No | Short descriptive summary of the project details |
| | | `year` | `string` | No | Project completion year string |
| | | `tags` | `array` | No | Array of strings mapping tech stack tags used |
| | | `src` | `image` | No | Screenshot image file with hotspot support (**Alt text is required**) |
| | | `github` | `url` | No | Source repository link URL |
| | | `url` | `url` | No | Direct live site link URL |
| | | `color` | `color` | No | Shadow glow backdrop coloring (using `@sanity/color-input`) |
| **contact** | `contact` | `heading` | `string` | No | Action header text (Default: `"Interested in working together?"`) |
| | | `subHeading` | `string` | No | Call-to-action details (Default: `"let's build something great !"`) |
| | | `email` | `string` | No | Developer email address |
| | | `availabilityStatus`| `string` | No | Workplace availability badge info (Default: `"Available for freelance work"`) |
| | | `timing` | `string` | No | Standard working hours availability info |
| | | `location` | `string` | No | Geographic location availability info |
| | | `projectTypes` | `array` | No | Array of category options displayed in form select drops |
| | | `services` | `array` | No | Services rendered array `{ title, description, icon }` |
| **gallery** | `gallery` | `enabled` | `boolean` | No | Flag indicating if visual gallery is shown on home (Default: `true`) |
| | | `placement` | `string` | **Yes** | Radio placement position selection: `'afterAbout'`, `'afterProjects'`, `'afterJourney'`, `'beforeContact'` |
| | | `eyebrow` | `string` | No | Eyebrow title text (Max 32 characters, Default: `"Gallery"`) |
| | | `title` | `string` | **Yes** | Section header text (Max 60 characters, Default: `"In Focus"`) |
| | | `description` | `text` | No | Introductory text block (Max 180 characters) |
| | | `items` | `array` | No | Images array. Min `3`, Max `12` entries. Objects: `{ image (required, with alt text), caption (Max 80 chars) }` |
| **faq** | `faq` | `title` | `string` | No | Section heading text (Default: `"Frequently Asked Questions"`) |
| | | `subtitle` | `string` | No | Sub-heading narrative detail |
| | | `items` | `array` | No | Accordion questions array `{ question, answer (text) }` |

---

## 3. Singletons vs Collections

To prevent duplicate entries and maintain a clean editorial flow, several models are restricted to **Singletons** inside the desk structure of [sanity.config.ts](file:///e:/Home/Hardik_Portfolio/studio-hardik-vatukiya/sanity.config.ts).

* **Singletons** (Allows exactly one record to be published):
  * `navigation`
  * `gallery`
  * `hero`
  * `about`
  * `faq`
  * `contact`
* **Collections** (Allows multiple records to be created, ordered, and deleted):
  * `skill`
  * `journeyStage`
  * `project`

---

## 4. Key Relationships & References

* Currently, there are no strict **Reference-type** cross-document relationships within the schemas.
* The `icon` fields are verified via preset options rather than relation models:
  * `journeyStage` icons map to local component mapping keys: `'Sparkles'`, `'GraduationCap'`, `'Briefcase'`, `'Rocket'`.
  * `skill` icons accept lowercase string slugs (e.g. `'react'`, `'nextjs'`) which match local icons inside the frontend icon catalogue [SkillIcons.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/SkillIcons.tsx).
