import { groq } from "next-sanity";

export const heroQuery = groq`*[_type == "hero"][0]{
  name,
  portraitImage,
  backgroundImage,
  copyrightText
}`;

export const aboutQuery = groq`*[_type == "about"][0]{
  tagline,
  name,
  bio,
  philosophy,
  experience[]{
    title,
    role,
    mark
  }
}`;

export const projectsQuery = groq`*[_type == "project"] | order(year desc) {
  _id,
  title,
  description,
  year,
  tags,
  src,
  github,
  url,
  color
}`;

export const skillsQuery = groq`*[_type == "skill"] | order(order asc) {
  _id,
  name,
  category,
  percentage,
  icon,
  customIcon,
  accentColor,
  tintColor,
  size,
  colSpan,
  rowSpan,
  order,
  special
}`;

export const journeyQuery = groq`*[_type == "journeyStage"] | order(date asc) {
  _id,
  date,
  title,
  subtitle,
  description,
  icon
}`;

export const contactQuery = groq`*[_type == "contact"][0]{
  heading,
  subHeading,
  email,
  availabilityStatus,
  timing,
  location,
  projectTypes,
  services[]{
    _key,
    title,
    description,
    icon
  }
}`;

export const navigationQuery = groq`*[_type == "navigation"][0]{
  title,
  menuItems[]{
    title,
    url
  },
  actionButton{
    title,
    url
  }
}`;
