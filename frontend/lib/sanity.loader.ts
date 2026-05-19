import { sanityFetch } from './sanity.live'
import * as queries from './sanity.queries'
import { NavigationData } from '@/components/Header'
import { HeroData } from '@/components/sections/Hero'
import { AboutData } from '@/components/sections/About'
import { SanityProject } from '@/components/sections/Projects'
import { SkillItem } from '@/components/sections/Skill'
import { JourneyStage } from '@/components/sections/Journey'
import { ContactData } from '@/components/sections/Contact'

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
