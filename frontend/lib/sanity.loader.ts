import { sanityFetch } from './sanity.live'
import { client } from './sanity.client'
import * as queries from './sanity.queries'
import type { NavigationData } from '@/components/Header'
import type { HeroData } from '@/components/sections/Hero'
import type { AboutData } from '@/components/sections/About'
import type { SanityProject } from '@/components/sections/Projects'
import type { GalleryData } from '@/components/sections/Gallery'
import type { SkillItem } from '@/components/sections/Skill'
import type { JourneyStage } from '@/components/sections/Journey'
import type { ContactData } from '@/components/sections/Contact'


export async function getHero(): Promise<HeroData | undefined> {
  const { data } = await sanityFetch({ query: queries.heroQuery })
  return data as HeroData | undefined
}

export async function getAbout(): Promise<AboutData | undefined> {
  const { data } = await sanityFetch({ query: queries.aboutQuery })
  return data as AboutData | undefined
}

export async function getProjects(): Promise<SanityProject[] | undefined> {
  const { data } = await sanityFetch({ query: queries.projectsQuery })
  return data as SanityProject[] | undefined
}

export async function getGallery(): Promise<GalleryData | undefined> {
  const { data } = await sanityFetch({ query: queries.galleryQuery })
  return data as GalleryData | undefined
}

export async function getSkills(): Promise<SkillItem[] | undefined> {
  const { data } = await sanityFetch({ query: queries.skillsQuery })
  return data as SkillItem[] | undefined
}

export async function getJourney(): Promise<JourneyStage[] | undefined> {
  const { data } = await sanityFetch({ query: queries.journeyQuery })
  return data as JourneyStage[] | undefined
}

export async function getContact(): Promise<ContactData | undefined> {
  const { data } = await sanityFetch({ query: queries.contactQuery })
  return data as ContactData | undefined
}

export async function getNavigation(): Promise<NavigationData | undefined> {
  const { data } = await sanityFetch({ query: queries.navigationQuery })
  return data as NavigationData | undefined
}

export interface DetailedSanityProject extends SanityProject {
  _updatedAt: string;
  slug: string;
}

export async function getProjectBySlug(slug: string): Promise<DetailedSanityProject | undefined> {
  const { data } = await sanityFetch({
    query: queries.projectBySlugQuery,
    params: { slug },
  })
  return data as DetailedSanityProject | undefined
}

export async function getProjectSlugs(): Promise<{ slug: string }[] | undefined> {
  return await client.fetch(queries.projectSlugsQuery)
}


