import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { AnimatedImage } from '@/components/image';
import Link from 'next/link';

interface ProjectProps {
  project: {
    title: string;
    cat?: string;
    category?: { title: string } | string;
    img?: string;
    image?: any;
    link?: string;
    slug?: { current: string };
  };
  index?: number;
  className?: string;
  delay?: number;
}

export default function ProjectCard({ project, index = 0, className = '', delay = 0 }: ProjectProps) {
  // Handle different variations of project object properties
  const title = project.title || 'Untitled Project';
  const category = project.cat || (typeof project.category === 'string' ? project.category : project.category?.title) || 'Project';
  
  // Extract image securely
  let imageSrc = project.img || '';
  if (project.image && typeof project.image === 'object' && project.image.asset?.url) {
    imageSrc = project.image.asset.url;
  } else if (typeof project.image === 'string') {
    imageSrc = project.image;
  }
  
  // Extract link
  const href = project.link || (project.slug?.current ? `/projects/${project.slug.current}` : '#');

  return (
    <div className={`project-card ${className}`}>
      <Link href={href} className="group block w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay || index * 0.1 }}
          className="relative h-[400px] md:h-[500px] rounded-[32px] md:rounded-[40px] overflow-hidden cursor-pointer group-hover:shadow-2xl transition-all duration-500"
          data-cursor="View Case"
        >
          {imageSrc ? (
            <AnimatedImage
              src={imageSrc}
              alt={title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1A1A18] flex items-center justify-center text-white/50">
              No Image
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-[var(--bg)]/20 to-transparent p-8 md:p-10 flex flex-col justify-end text-[var(--text-primary)]">
            <span className="text-[10px] md:text-xs font-outfit font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-3 md:mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              {category}
            </span>
            <h3 className="text-4xl md:text-5xl font-display font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-700 text-white">
              {title}
            </h3>
          </div>
          
          <div className="absolute top-8 right-8 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
