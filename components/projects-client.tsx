"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import ThreeInteractiveScene from "@/components/three-interactive-scene";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/custom-cursor";
import { MagneticElement } from "@/components/magnetic-element";
import { AnimatedImage } from "@/components/image";
import Link from "next/link";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectsClient({ projects }: { projects: any[] }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    useGSAP(() => {
        gsap.fromTo(".projects-header", 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
        );
    }, { scope: container });

    return (
        <div ref={container} className="relative no-scrollbar overflow-x-hidden selection:bg-primary selection:text-white bg-bg-dark">
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-primary z-[100] origin-left" style={{ scaleX }} />
            
            <nav className="fixed top-0 left-0 w-full z-50 py-10 px-6">
                <Link href="/" className="group flex items-center gap-4 text-xs font-outfit font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                    <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-primary transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    Back to World
                </Link>
            </nav>

            <section className="relative pt-40 pb-20 overflow-hidden bg-bg-dark projects-header h-[80vh] flex flex-col justify-center">
                <ThreeInteractiveScene />
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center">
                    <h1 className="text-[12vw] md:text-[10vw] leading-none mb-10">
                        <span className="block font-display italic text-white/40">Studio</span>
                        <span className="block font-display font-black text-white text-gradient">Expeditions.</span>
                    </h1>
                    <p className="text-white/50 max-w-2xl mx-auto font-outfit text-xl leading-relaxed">
                        A definitive archive of digital artifacts and complex engineering systems.
                    </p>
                </div>
            </section>

            <section className="py-40 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {projects.map((project, i) => (
                            <motion.div
                                key={project._id || i}
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="group relative flex flex-col"
                            >
                                <div className="relative h-[500px] rounded-[60px] overflow-hidden shadow-2xl mb-10">
                                    <AnimatedImage
                                        animationType="pixelize-slide"
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                
                                <div className="px-10">
                                    <div className="flex gap-4 mb-6">
                                        {project.tags?.map((tag: string, i: number) => (
                                            <span key={i} className="text-[10px] font-outfit font-black uppercase tracking-[0.2em] text-primary">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="text-5xl font-display italic mb-6 text-bg-dark">{project.title}</h3>
                                    <p className="text-bg-dark/50 font-outfit text-lg mb-10 max-w-md">{project.description}</p>
                                    
                                    <div className="flex gap-8">
                                        <Link href={project.liveUrl} className="group/btn flex items-center gap-3 text-[10px] font-outfit font-black uppercase tracking-widest text-bg-dark border-b-2 border-primary/20 pb-2 hover:border-primary transition-all">
                                            Live Experience <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
