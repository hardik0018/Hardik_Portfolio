"use client";

import { useRef, useState, useEffect } from "react";
import { HelpCircle, Search } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { FAQData } from "@/lib/sanity.loader";
import { SectionHeader } from "../ui/SectionHeader";

interface FAQProps {
  initialData?: FAQData;
}

const defaultFAQ: FAQData = {
  title: "Frequently Asked Questions",
  subtitle: "Quick facts and detailed answers about my background, technology stack, and availability.",
  items: [
    {
      question: "Who is Hardik Vatukiya?",
      answer: "Hardik Vatukiya is a dedicated MERN Stack and Full-Stack Software Engineer from Rajkot, Gujarat, India. He specializes in designing and implementing robust, responsive, and fully accessible web applications at the intersection of design, performance, and engineering."
    },
    {
      question: "What technologies does Hardik Vatukiya work with?",
      answer: "Hardik specializes in the MERN Stack. His core programming toolkit includes React, Next.js, TypeScript, Node.js, Express, MongoDB, Tailwind CSS, GSAP (for premium high-performance animations), Framer Motion, and headless architectures utilizing Sanity CMS."
    },
    {
      question: "Is Hardik Vatukiya available for freelance or contract work?",
      answer: "Yes, Hardik is available globally for freelance development, contract roles, and full-time remote opportunities. He specializes in building fast, accessible web solutions, performance upgrades, and modern interactive portfolios."
    },
    {
      question: "Where is Hardik Vatukiya located?",
      answer: "Hardik is based in Rajkot, Gujarat, India, and works remotely with clients worldwide. He is comfortable collaborating across multiple time zones including EST, PST, GMT, and IST."
    }
  ]
};

export default function FAQ({ initialData }: FAQProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const title = initialData?.title || defaultFAQ.title || "FAQ";
  const subtitle = initialData?.subtitle || defaultFAQ.subtitle;
  const items = initialData?.items || defaultFAQ.items || [];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    setTimeout(() => {
      // refresh(true) recalculates heights without snapping scroll position
      ScrollTrigger.refresh(true);
    }, 400); // Wait for accordion height transitions to finish
  };

  // Categorize items dynamically for filters
  const categorizedItems = items.map((item) => {
    const q = item.question.toLowerCase();
    let category = "General";
    if (q.includes("tech") || q.includes("tool") || q.includes("skills") || q.includes("framework") || q.includes("work with")) {
      category = "Skills";
    } else if (q.includes("freelance") || q.includes("contract") || q.includes("available") || q.includes("work") || q.includes("hire")) {
      category = "Availability";
    }
    return { ...item, category };
  });

  const categories = ["All", "General", "Skills", "Availability"];

  const filteredItems = categorizedItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic tab counts
  const getCategoryCount = (cat: string) => {
    if (cat === "All") return categorizedItems.length;
    return categorizedItems.filter((item) => item.category === cat).length;
  };

  // Interactive mouse glow movement for cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  // GSAP floating elements and entrance staggered animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Slow float of background blob
        gsap.to(blobRef.current, {
          x: -50,
          y: 40,
          scale: 1.15,
          duration: 15,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // FAQ cards bounce entrance on scroll
        gsap.fromTo(
          ".faq-item-card",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power4.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );

        // Sidebar entrance slide
        gsap.fromTo(
          ".faq-sidebar-animate",
          { x: -35, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            }
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  // Auto refresh GSAP triggers when elements are filtered
  useEffect(() => {
    // refresh(true) recalculates trigger positions WITHOUT adjusting scroll position
    ScrollTrigger.refresh(true);
  }, [filteredItems.length]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative z-30 bg-background text-foreground px-6 py-10 sm:py-8 md:py-10 border-t border-border overflow-hidden min-h-screen flex flex-col justify-center faq-container"
    >
      {/* FAQPage JSON-LD Schema — enables Google rich results and AI answer extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": items.map((item) => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
              },
            })),
          }),
        }}
      />
      <SectionHeader
        title={title}
        subtitle={subtitle}
      />
      <div className="relative z-10 mx-auto w-full max-w-3xl mb-8 space-y-4">
        {/* Search Input bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-muted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-11 pr-4 py-3 bg-foreground/[0.005] hover:bg-foreground/[0.015] border border-border rounded-xl font-sans text-sm text-foreground outline-none transition-all placeholder:text-text-muted/60 focus:border-accent-primary/70 focus:shadow-[0_0_0_4px_rgba(0,143,81,0.09)]"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-accent-primary text-background shadow-[0_4px_14px_rgba(0,143,81,0.25)]"
                    : "bg-foreground/[0.02] hover:bg-foreground/[0.05] text-text-muted hover:text-foreground border border-border/60"
                }`}
              >
                {cat} <span className="ml-1 font-mono text-[0.68rem] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <div className="lg:col-span-7 space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const originalIndex = items.findIndex((orig) => orig.question === item.question);
              const isOpen = activeIndex === originalIndex;
              const displayIndex = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={item.question}
                  onMouseMove={handleCardMouseMove}
                  className={`faq-item-card group relative border transition-all duration-350 rounded-2xl overflow-hidden ${isOpen
                    ? "border-accent-primary/45 bg-foreground/[0.025] shadow-[0_12px_32px_rgba(0,0,0,0.03)]"
                    : "border-border bg-foreground/[0.005] hover:bg-foreground/[0.015] hover:border-border/80"
                    }`}
                  style={{
                    "--mx": "50%",
                    "--my": "50%",
                  } as React.CSSProperties}
                >
                  {/* Active vertical visual highlight line on left edge */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] bg-accent-primary transition-all duration-350 ${isOpen ? "h-full" : "h-0"
                      }`}
                  />

                  {/* Cursor Follow Glow Effect inside cards */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                    style={{
                      background: "radial-gradient(150px circle at var(--mx) var(--my), rgba(0, 143, 81, 0.055), transparent 80%)",
                    }}
                  />

                  <button
                    onClick={() => toggleAccordion(originalIndex)}
                    className="relative z-10 flex w-full items-center justify-between gap-4 py-5 px-6 text-left font-sans text-base font-bold transition-colors duration-300 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-[0.68rem] tracking-wider text-accent-primary/65 shrink-0 bg-accent-primary/5 px-2 py-0.5 rounded-sm">
                        {displayIndex}
                      </span>
                      <span className={`leading-snug transition-colors duration-300 ${isOpen ? "text-accent-primary" : "text-foreground"
                        }`}>
                        {item.question}
                      </span>
                    </div>

                    {/* Custom Morphing Cross-Minus Icon */}
                    <div className="relative w-4 h-4 flex items-center justify-center shrink-0 ml-2">
                      <div
                        className={`absolute w-full h-[1.8px] bg-text-dim transition-all duration-300 ${isOpen ? "rotate-90 bg-accent-primary" : ""
                          }`}
                      />
                      <div
                        className={`absolute w-[1.8px] h-full bg-text-dim transition-all duration-300 ${isOpen ? "scale-0 bg-accent-primary" : ""
                          }`}
                      />
                    </div>
                  </button>

                  {/* Accordion Expansion Panel */}
                  <div
                    className={`grid transition-all duration-350 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-0 font-sans text-[0.93rem] leading-relaxed text-text-muted border-t border-border/40 mt-0 relative z-10">
                        {/* Inner content staggered micro-translation */}
                        <div className={`transition-all duration-500 delay-75 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
                          }`}>
                          <p className="mt-4">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            /* EMPTY RESULTS STATE */
            <div className="text-center py-16 px-6 border border-dashed border-border rounded-2xl bg-foreground/[0.002] flex flex-col items-center gap-3">
              <HelpCircle className="w-10 h-10 text-text-dim opacity-50" />
              <h3 className="font-bold text-base text-foreground mt-2">No matching questions</h3>
              <p className="text-xs text-text-muted max-w-sm">
                We couldn&apos;t find any results for &ldquo;{searchQuery}&rdquo;. Try checking your spelling or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-2 text-xs font-bold text-accent-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
