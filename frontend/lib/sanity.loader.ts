import { cache } from 'react'
import { sanityFetch } from './sanity.live'
import { client } from './sanity.client'
import * as queries from './sanity.queries'
import type { NavigationData } from '@/components/Header'
import type { HeroData } from '@/components/sections/Hero'
import type { AboutData } from '@/components/sections/About'
import type { SanityProject } from '@/components/sections/Projects'
import type { SkillItem } from '@/components/sections/Skill'
import type { JourneyStage } from '@/components/sections/Journey'
import type { ContactData } from '@/components/sections/Contact'
import type { AwardsData } from '@/components/sections/Awards'

export interface GalleryData {
  enabled?: boolean;
  placement?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: Array<{
    _key: string;
    image: unknown;
    caption?: string;
    size?: string;
    order?: number;
  }>;
}

export const getHero = cache(async (): Promise<HeroData | undefined> => {
  const { data } = await sanityFetch({ query: queries.heroQuery, tags: ["sanity:hero"] })
  return data as HeroData | undefined
})

export const getAbout = cache(async (): Promise<AboutData | undefined> => {
  const { data } = await sanityFetch({ query: queries.aboutQuery, tags: ["sanity:about"] })
  return data as AboutData | undefined
})

export const getProjects = cache(async (): Promise<SanityProject[] | undefined> => {
  const { data } = await sanityFetch({ query: queries.projectsQuery, tags: ["sanity:projects"] })
  return data as SanityProject[] | undefined
})

export const getGallery = cache(async (): Promise<GalleryData | undefined> => {
  const { data } = await sanityFetch({ query: queries.galleryQuery, tags: ["sanity:gallery"] })
  return data as GalleryData | undefined
})

export const getSkills = cache(async (): Promise<SkillItem[] | undefined> => {
  const { data } = await sanityFetch({ query: queries.skillsQuery, tags: ["sanity:skills"] })
  return data as SkillItem[] | undefined
})

export const getJourney = cache(async (): Promise<JourneyStage[] | undefined> => {
  const { data } = await sanityFetch({ query: queries.journeyQuery, tags: ["sanity:journey"] })
  return data as JourneyStage[] | undefined
})

export const getContact = cache(async (): Promise<ContactData | undefined> => {
  const { data } = await sanityFetch({ query: queries.contactQuery, tags: ["sanity:contact"] })
  return data as ContactData | undefined
})

export interface FAQData {
  title?: string;
  subtitle?: string;
  items?: Array<{
    question: string;
    answer: string;
  }>;
}

export const getFAQ = cache(async (): Promise<FAQData | undefined> => {
  const { data } = await sanityFetch({ query: queries.faqQuery, tags: ["sanity:faq"] })
  return data as FAQData | undefined
})

export const getAwards = cache(async (): Promise<AwardsData | undefined> => {
  const { data } = await sanityFetch({ query: queries.awardsQuery, tags: ["sanity:awards"] })
  return data as AwardsData | undefined
})

export const getNavigation = cache(async (): Promise<NavigationData | undefined> => {
  const { data } = await sanityFetch({ query: queries.navigationQuery, tags: ["sanity:navigation"] })
  return data as NavigationData | undefined
})

export interface DetailedSanityProject extends SanityProject {
  _updatedAt: string;
  slug: string;
}

export const getProjectBySlug = cache(async (slug: string): Promise<DetailedSanityProject | undefined> => {
  const { data } = await sanityFetch({
    query: queries.projectBySlugQuery,
    params: { slug },
    tags: ["sanity:projects", `sanity:project:${slug}`]
  })
  return data as DetailedSanityProject | undefined
})

export async function getProjectSlugs(): Promise<{ slug: string; _updatedAt?: string }[] | undefined> {
  return await client.fetch(queries.projectSlugsQuery)
}
