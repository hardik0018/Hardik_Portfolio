"use client";

import { useRef, useState, useEffect } from "react";
import { HelpCircle, Search, Sparkles, ChevronLeft, ChevronRight, Send, MessageSquareCode, Compass, Info } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { FAQData } from "@/lib/sanity.loader";
import { SectionHeader } from "../ui/SectionHeader";
import { motion, AnimatePresence } from "motion/react";

interface FAQProps {
  initialData?: FAQData;
}

const defaultFAQ: FAQData = {
  title: "Frequently Asked Questions",
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

/* ───────────────────────────────── Floating 3D Cube ─────────────────────────────── */

function FloatingCube({
  className,
  size = 50,
  delay = 0,
  speed = 20,
}: {
  className?: string;
  size?: number;
  delay?: number;
  speed?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute opacity-2 sm:opacity-[0.04] ${className}`}
      style={{ width: size, height: size, perspective: 800 }}
    >
      <div
        className="w-full h-full relative preserve-3d"
        style={{
          animation: `spin3d ${speed}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        <div
          className="absolute inset-0 border border-accent-primary/20 bg-accent-primary/1"
          style={{ transform: `translateZ(${size / 2}px)` }}
        />
        <div
          className="absolute inset-0 border border-accent-primary/20 bg-accent-primary/1"
          style={{ transform: `rotateY(180deg) translateZ(${size / 2}px)` }}
        />
        <div
          className="absolute inset-0 border border-accent-primary/20 bg-accent-primary/1"
          style={{ transform: `rotateY(-90deg) translateZ(${size / 2}px)` }}
        />
        <div
          className="absolute inset-0 border border-accent-primary/20 bg-accent-primary/1"
          style={{ transform: `rotateY(90deg) translateZ(${size / 2}px)` }}
        />
        <div
          className="absolute inset-0 border border-accent-primary/20 bg-accent-primary/1"
          style={{ transform: `rotateX(90deg) translateZ(${size / 2}px)` }}
        />
        <div
          className="absolute inset-0 border border-accent-primary/20 bg-accent-primary/1"
          style={{ transform: `rotateX(-90deg) translateZ(${size / 2}px)` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────── Interactive 3D Stack ───────────────────────────── */

function ThreeDStack({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const stackCategories = categories.filter((c) => c !== "All");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[320px] flex items-center justify-center perspective-1000 cursor-pointer select-none"
    >
      <div
        className="relative w-[230px] h-[280px] preserve-3d transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(-3deg)`,
        }}
      >
        {stackCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat;
          const isAll = selectedCategory === "All";
          const isActive = isSelected || isAll;

          let translateZ = idx * -25;
          let translateY = idx * -12;
          let rotateX = -10;
          let scale = 1 - (stackCategories.length - 1 - idx) * 0.04;

          if (isSelected) {
            translateZ = 35;
            translateY = -22;
            rotateX = -5;
            scale = 1.06;
          } else if (!isAll) {
            translateZ -= 50;
            scale = 0.82;
            translateY += 8;
          }

          const colors = {
            General: {
              border: "rgba(0, 143, 81, 0.15)",
              borderActive: "rgba(0, 143, 81, 0.5)",
              glow: "rgba(0, 143, 81, 0.05)",
              bg: "linear-gradient(135deg, rgba(0, 143, 81, 0.03) 0%, var(--card-bg) 100%)",
              text: "text-accent-primary",
              badge: "bg-accent-primary/10 text-accent-primary border-accent-primary/20",
            },
            Skills: {
              border: "rgba(193, 255, 74, 0.25)",
              borderActive: "rgba(193, 255, 74, 0.65)",
              glow: "rgba(193, 255, 74, 0.06)",
              bg: "linear-gradient(135deg, rgba(193, 255, 74, 0.04) 0%, var(--card-bg) 100%)",
              text: "text-accent-primary",
              badge: "bg-accent-lime/15 text-foreground border-accent-lime/35",
            },
            Availability: {
              border: "rgba(0, 0, 221, 0.15)",
              borderActive: "rgba(0, 0, 221, 0.5)",
              glow: "rgba(0, 0, 221, 0.05)",
              bg: "linear-gradient(135deg, rgba(0, 0, 221, 0.03) 0%, var(--card-bg) 100%)",
              text: "text-accent-secondary",
              badge: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
            },
          }[cat as "General" | "Skills" | "Availability"] || {
            border: "rgba(255, 255, 255, 0.15)",
            borderActive: "rgba(255, 255, 255, 0.6)",
            glow: "rgba(255, 255, 255, 0.05)",
            bg: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, var(--card-bg) 100%)",
            text: "text-foreground",
            badge: "bg-white/5 text-foreground border-white/10",
          };

          return (
            <motion.div
              key={cat}
              onClick={() => setSelectedCategory(isSelected ? "All" : cat)}
              className={`absolute inset-0 rounded-[24px] border backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-500 cursor-pointer ${isActive ? "opacity-100" : "opacity-35"
                }`}
              style={{
                background: colors.bg,
                borderColor: isSelected ? colors.borderActive : colors.border,
                boxShadow: isSelected
                  ? `0 15px 30px -8px rgba(0, 0, 0, 0.06), 0 0 20px ${colors.glow}`
                  : `0 6px 12px -6px rgba(0, 0, 0, 0.04)`,
                transform: `translate3d(0px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="absolute inset-0 rounded-[22px] pointer-events-none border border-white/40" />

              <div className="flex justify-between items-start">
                <span className={`font-sans text-[0.58rem] tracking-[0.18em] font-bold uppercase shrink-0 border rounded-full px-3 py-0.5 ${colors.badge}`}>
                  {cat}
                </span>
                <div
                  className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border border-border/80 bg-foreground/1 transition-all duration-300 ${isSelected ? "scale-110 border-accent-primary/30 bg-accent-primary/5" : ""
                    }`}
                  style={{ transform: "translateZ(8px)" }}
                >
                  <Sparkles className={`w-3 h-3 ${isSelected ? colors.text : "text-text-muted"}`} />
                </div>
              </div>

              <div className="space-y-2 transform-gpu" style={{ transform: "translateZ(20px)" }}>
                <h4 className="font-display text-lg font-bold text-foreground leading-tight">
                  {cat === "General" && "Who is Hardik?"}
                  {cat === "Skills" && "Toolkits & Tech"}
                  {cat === "Availability" && "Hiring & Work"}
                </h4>
                <p className="font-sans text-[0.78rem] text-text-muted/90 leading-relaxed">
                  {cat === "General" && "Basic profile details, origins, locations, and personal background facts."}
                  {cat === "Skills" && "Development stack, framework details, databases, and library expertise."}
                  {cat === "Availability" && "Information on freelance contracts, full-time availability, and timezones."}
                </p>
              </div>

              <div
                className="absolute bottom-5 right-6 font-mono text-4xl font-black text-foreground/3 select-none"
                style={{ transform: "translateZ(10px)" }}
              >
                0{idx + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────── Main FAQ Component ────────────────────────────── */

export default function FAQ({ initialData }: FAQProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<"matrix" | "convo">("matrix");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [gridRotate, setGridRotate] = useState({ x: 8, y: -8 });

  // 3D Coverflow Carousel States
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Conversational Chat States
  const [chatHistory, setChatHistory] = useState<
    Array<{ id: string; sender: "user" | "bot"; text: string; isTyping?: boolean }>
  >([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I'm Hardik's virtual assistant. Ask me anything about my skillset, available hours, background, or locations! Click one of the quick options below or type your query in the terminal.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic layout calculations for 3D Coverflow
  const [dimensions, setDimensions] = useState({
    width: 240,
    height: 300,
    translateZ: 250,
    spacing: 115,
    offset: 60,
    maxVisible: 2
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDimensions({
          width: 190,
          height: 240,
          translateZ: 140,
          spacing: 75,
          offset: 25,
          maxVisible: 1
        });
      } else if (window.innerWidth < 1024) {
        setDimensions({
          width: 215,
          height: 270,
          translateZ: 190,
          spacing: 95,
          offset: 45,
          maxVisible: 2
        });
      } else {
        setDimensions({
          width: 240,
          height: 300,
          translateZ: 250,
          spacing: 115,
          offset: 60,
          maxVisible: 2
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const title = initialData?.title || defaultFAQ.title || "FAQ";
  const subtitle = initialData?.subtitle || defaultFAQ.subtitle;
  const items = initialData?.items || defaultFAQ.items || [];

  // Categorize items dynamically
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

  const getCategoryCount = (cat: string) => {
    if (cat === "All") return categorizedItems.length;
    return categorizedItems.filter((item) => item.category === cat).length;
  };

  // Section Mouse Tilt
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setGridRotate({
      x: 8 - (y / rect.height) * 12,
      y: -8 + (x / rect.width) * 12,
    });
  };

  /* ─────────────────────────────── Coverflow 3D Math ───────────────────────────── */

  const count = filteredItems.length;

  const getCardStyle = (idx: number) => {
    const diff = idx - activeIndex;
    let translateXVal = 0;
    let rotateYVal = 0;
    let translateZVal = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10 - Math.abs(diff);

    if (diff === 0) {
      // Focused Center Card
      translateXVal = 0;
      rotateYVal = 0;
      translateZVal = 40;
      scale = 1.05;
    } else {
      // Left or Right Side Cards (Angled facing inward)
      translateXVal = diff * dimensions.spacing + (diff > 0 ? dimensions.offset : -dimensions.offset);
      rotateYVal = diff > 0 ? -28 : 28;
      translateZVal = -50;
      scale = 0.85;
      opacity = 0.45;

      if (Math.abs(diff) > dimensions.maxVisible) {
        opacity = 0;
      }
    }

    return {
      transform: `translateX(${translateXVal}px) rotateY(${rotateYVal}deg) translateZ(${translateZVal}px) scale(${scale})`,
      opacity,
      zIndex,
      transformStyle: "preserve-3d" as const,
      pointerEvents: opacity === 0 ? "none" as const : "auto" as const,
      transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
    };
  };

  // Drag / Swipe listeners to switch indices
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startX.current = clientX;
    isDragging.current = true;
  };

  useEffect(() => {
    const handleUp = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      let clientX = 0;
      if ("changedTouches" in e) {
        clientX = e.changedTouches[0].clientX;
      } else if (e instanceof MouseEvent) {
        clientX = e.clientX;
      } else {
        return;
      }

      const deltaX = clientX - startX.current;

      // Swipe threshold triggers active index increment/decrement
      if (deltaX > 45) {
        if (activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
          setFlippedCardIndex(null);
        }
      } else if (deltaX < -45) {
        if (activeIndex < count - 1) {
          setActiveIndex((prev) => prev + 1);
          setFlippedCardIndex(null);
        }
      }
    };

    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, [activeIndex, count]);

  const handleCardClick = (idx: number) => {
    if (idx !== activeIndex) {
      setActiveIndex(idx);
      setFlippedCardIndex(null);
    } else {
      setFlippedCardIndex(flippedCardIndex === idx ? null : idx);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      setFlippedCardIndex(null);
    }
  };

  const handleNext = () => {
    if (activeIndex < count - 1) {
      setActiveIndex((prev) => prev + 1);
      setFlippedCardIndex(null);
    }
  };

  // Reset index when filters change to prevent index-out-of-bounds bugs
  useEffect(() => {
    setActiveIndex(0);
    setFlippedCardIndex(null);
  }, [selectedCategory, searchQuery]);

  /* ────────────────────────────── Chatbot Simulator ────────────────────────────── */

  const handleSendChat = (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, sender: "user" as const, text: messageText };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");

    const botMsgId = (Date.now() + 1).toString();
    const typingMsg = { id: botMsgId, sender: "bot" as const, text: "", isTyping: true };
    setChatHistory((prev) => [...prev, typingMsg]);

    const query = messageText.toLowerCase();

    let matchedItem = categorizedItems.find((item) => {
      const q = item.question.toLowerCase();
      if (query.includes("who") && q.includes("who")) return true;
      if ((query.includes("skill") || query.includes("stack") || query.includes("techno") || query.includes("work with") || query.includes("tool")) && (q.includes("work with") || q.includes("techno") || q.includes("tool"))) return true;
      if ((query.includes("freelance") || query.includes("available") || query.includes("hire") || query.includes("contract")) && (q.includes("freelance") || q.includes("available") || q.includes("contract"))) return true;
      if ((query.includes("where") || query.includes("located") || query.includes("live") || query.includes("india") || query.includes("rajkot")) && (q.includes("located") || q.includes("where"))) return true;
      return false;
    });

    if (!matchedItem) {
      if (query.includes("hardik") || query.includes("vatukiya") || query.includes("background") || query.includes("developer")) {
        matchedItem = categorizedItems[0];
      } else if (query.includes("react") || query.includes("next") || query.includes("node") || query.includes("mongodb") || query.includes("gsap")) {
        matchedItem = categorizedItems[1];
      } else if (query.includes("remote") || query.includes("work") || query.includes("job") || query.includes("project")) {
        matchedItem = categorizedItems[2];
      } else if (query.includes("gujarat") || query.includes("city") || query.includes("timezone")) {
        matchedItem = categorizedItems[3];
      }
    }

    const replyText = matchedItem
      ? matchedItem.answer
      : "I'm not fully sure about that query, but here is a quick fact: Hardik is a Full-Stack MERN Stack Developer based in Gujarat, India, working globally with clients. Try asking about his 'skills', 'freelance availability', or 'origins'!";

    setTimeout(() => {
      setChatHistory((prev) =>
        prev.map((msg) => {
          if (msg.id === botMsgId) {
            return { id: botMsgId, sender: "bot", text: replyText };
          }
          return msg;
        })
      );
    }, 1100);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Entrance staggered animations
  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.to(blobRef.current, {
          x: -60,
          y: 40,
          scale: 1.25,
          duration: 16,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        gsap.fromTo(
          ".faq-hub-header",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }, sectionRef);
      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      id="faq"
      className="relative z-30 bg-background text-foreground px-6 py-10 sm:py-12 border-t border-border overflow-hidden min-h-[60vh] flex flex-col justify-center faq-container font-sans"
    >
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
      <SectionHeader title={title} subtitle={subtitle} />

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl flex flex-col items-center">
        {/* Toggle Hub Console */}
        <div className="faq-hub-header flex flex-col sm:flex-row items-center justify-between gap-6 w-full mb-6 bg-foreground/[0.003] border border-border/50 backdrop-blur-xl p-3.5 rounded-[24px] shadow-[0_10px_25px_rgba(0,0,0,0.01)]">
          {/* Controls toggle */}
          <div className="flex gap-1.5 bg-foreground/2 border border-border/60 p-1 rounded-full select-none">
            <button
              onClick={() => setViewMode("matrix")}
              className="relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 cursor-pointer flex items-center gap-1.5 focus:outline-none"
            >
              {viewMode === "matrix" && (
                <motion.div
                  layoutId="modeIndicator"
                  className="absolute inset-0 bg-accent-primary/10 border border-accent-primary/25 rounded-full shadow-[0_2px_8px_rgba(0,143,81,0.04)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Compass className={`relative z-10 w-3.5 h-3.5 ${viewMode === "matrix" ? "text-accent-primary" : "text-text-muted"}`} />
              <span className={`relative z-10 ${viewMode === "matrix" ? "text-accent-primary font-bold" : "text-text-muted"}`}>
                3D Matrix Ring
              </span>
            </button>
            <button
              onClick={() => setViewMode("convo")}
              className="relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 cursor-pointer flex items-center gap-1.5 focus:outline-none"
            >
              {viewMode === "convo" && (
                <motion.div
                  layoutId="modeIndicator"
                  className="absolute inset-0 bg-accent-primary/10 border border-accent-primary/25 rounded-full shadow-[0_2px_8px_rgba(0,143,81,0.04)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <MessageSquareCode className={`relative z-10 w-3.5 h-3.5 ${viewMode === "convo" ? "text-accent-primary" : "text-text-muted"}`} />
              <span className={`relative z-10 ${viewMode === "convo" ? "text-accent-primary font-bold" : "text-text-muted"}`}>
                Developer Chat
              </span>
            </button>
          </div>

          {/* Search bar & filter pills: visible in Matrix mode only */}
          <AnimatePresence mode="wait">
            {viewMode === "matrix" ? (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col md:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
              >
                {/* Search */}
                <div className="relative group min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted transition-colors duration-300 group-focus-within:text-accent-primary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search query..."
                    className="w-full pl-9 pr-3.5 py-1.5 bg-foreground/1.5 hover:bg-foreground/2.5 border border-border/80 rounded-lg text-xs text-foreground outline-none transition-all placeholder:text-text-muted/50 focus:border-accent-primary/70 focus:bg-background focus:shadow-[0_0_0_3px_rgba(0,143,81,0.04)]"
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                  {categories.map((cat) => {
                    const count = getCategoryCount(cat);
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-[0.68rem] font-bold transition-all duration-300 cursor-pointer shrink-0 border ${isActive
                          ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary shadow-[0_2px_6px_rgba(0,143,81,0.03)]"
                          : "bg-transparent border-border/60 hover:bg-foreground/2 text-text-muted"
                          }`}
                      >
                        {cat} <span className="opacity-60 text-[0.58rem] font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex items-center gap-1.5 text-xs text-text-muted"
              >
                <Info className="w-3.5 h-3.5 text-accent-primary" />
                <span>Simulated terminal dialogue with H.AI developer avatar model.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Switcher Panels */}
        <div className="w-full min-h-[380px] overflow-visible">
          {viewMode === "matrix" ? (
            /* ───────────────────────── MATRIX MODE: 3D COVERFLOW ───────────────────────── */
            <div className="relative w-full flex flex-col items-center justify-center py-4 select-none overflow-visible">
              {filteredItems.length > 0 ? (
                <>
                  <div
                    className="relative flex items-center justify-center overflow-visible"
                    style={{
                      width: dimensions.width,
                      height: dimensions.height,
                      perspective: 1200,
                    }}
                  >
                    <div
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                      className="relative w-full h-full preserve-3d cursor-grab active:cursor-grabbing transform-gpu"
                    >
                      {filteredItems.map((item, idx) => {
                        const style = getCardStyle(idx);
                        const isFlipped = flippedCardIndex === idx;
                        const isInteractive = idx === activeIndex;

                        return (
                          <div
                            key={item.question}
                            onClick={() => handleCardClick(idx)}
                            className="absolute inset-0 rounded-[24px] transform-gpu"
                            style={style}
                          >
                            <div
                              className="w-full h-full relative preserve-3d transition-transform duration-700 transform-gpu"
                              style={{
                                transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
                              }}
                            >
                              {/* CARD FRONT FACE */}
                              <div
                                className="absolute inset-0 rounded-[24px] border p-6 flex flex-col justify-between backface-hidden backdrop-blur-xl"
                                style={{
                                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, var(--card-bg) 100%)",
                                  borderColor: isInteractive
                                    ? "rgba(0, 143, 81, 0.45)"
                                    : "var(--border)",
                                  boxShadow: isInteractive
                                    ? "0 15px 30px -10px rgba(0, 0, 0, 0.06), 0 0 20px rgba(0, 143, 81, 0.05)"
                                    : "0 6px 12px -8px rgba(0, 0, 0, 0.03)",
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-mono text-[0.58rem] tracking-wider text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-0.5 rounded-full">
                                    {item.category}
                                  </span>
                                  <span className="font-mono text-xs text-text-muted opacity-30 select-none">0{idx + 1}</span>
                                </div>

                                <h3 className="font-display text-base sm:text-lg font-bold text-foreground leading-snug tracking-tight">
                                  {item.question}
                                </h3>

                                <div className="flex items-center gap-1.5 text-xs text-text-muted/80">
                                  <Sparkles className="w-3 h-3 text-accent-primary animate-pulse" />
                                  <span className="font-sans text-[0.7rem]">
                                    {isInteractive ? "Click to read answer" : "Click to rotate"}
                                  </span>
                                </div>
                              </div>

                              {/* CARD BACK FACE */}
                              <div
                                className="absolute inset-0 rounded-[24px] border p-6 flex flex-col justify-between backface-hidden backdrop-blur-xl"
                                style={{
                                  background: "linear-gradient(135deg, var(--card-bg) 0%, rgba(0, 143, 81, 0.03) 100%)",
                                  borderColor: "rgba(0, 143, 81, 0.45)",
                                  transform: "rotateY(180deg)",
                                  boxShadow: "0 18px 36px -12px rgba(0, 0, 0, 0.06), 0 0 20px rgba(0, 143, 81, 0.05)",
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-mono text-[0.58rem] tracking-wider text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-0.5 rounded-full">
                                    Answer
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFlippedCardIndex(null);
                                    }}
                                    className="font-mono text-[0.65rem] text-text-muted hover:text-foreground cursor-pointer px-1.5 py-0.5 rounded border border-border hover:border-text-muted transition-all focus:outline-none bg-background/50"
                                  >
                                    Close
                                  </button>
                                </div>

                                <div className="flex-1 flex items-center overflow-y-auto no-scrollbar my-2.5">
                                  <p className="font-sans text-[0.8rem] leading-relaxed text-text-muted">
                                    {item.answer}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between text-[0.58rem] text-text-muted/50 font-mono">
                                  <span>HARDIK VATUKIYA</span>
                                  <span>0{idx + 1}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation mechanical arrows */}
                  <div className="flex items-center gap-5 mt-6">
                    <button
                      onClick={handlePrev}
                      disabled={activeIndex === 0}
                      className="w-9 h-9 rounded-full border border-border/80 bg-foreground/1 hover:bg-foreground/4 disabled:opacity-30 disabled:pointer-events-none text-text-muted hover:text-foreground flex items-center justify-center transition-all cursor-pointer shadow focus:outline-none"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="font-mono text-[0.68rem] text-text-dim tracking-widest select-none">
                      <span className="text-foreground font-bold">{activeIndex + 1}</span> / {count}
                    </div>
                    <button
                      onClick={handleNext}
                      disabled={activeIndex === count - 1}
                      className="w-9 h-9 rounded-full border border-border/80 bg-foreground/1 hover:bg-foreground/4 disabled:opacity-30 disabled:pointer-events-none text-text-muted hover:text-foreground flex items-center justify-center transition-all cursor-pointer shadow focus:outline-none"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2.5 text-[0.62rem] text-text-dim/50 font-sans tracking-wide">
                    Drag/Swipe cards horizontally or click background cards to rotate the carousel.
                  </div>
                </>
              ) : (
                /* EMPTY RESULTS STATE */
                <div className="text-center py-12 px-6 border border-dashed border-border/80 rounded-[20px] bg-foreground/[0.002] flex flex-col items-center gap-2.5 w-full max-w-sm">
                  <HelpCircle className="w-8 h-8 text-text-dim opacity-50" />
                  <h3 className="font-bold text-sm text-foreground mt-1">No matches</h3>
                  <p className="text-[0.68rem] text-text-muted leading-relaxed">
                    No results for &ldquo;{searchQuery}&rdquo; inside this category. Try redefining your query.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="mt-1 text-[0.68rem] font-bold text-accent-primary hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ─────────────────────── CONVO MODE: TERMINAL CHATBOT ──────────────────────── */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl mx-auto border border-border bg-card-bg/60 backdrop-blur-md rounded-[24px] overflow-hidden flex flex-col h-[400px] shadow-[0_15px_35px_rgba(0,0,0,0.03)]"
            >
              {/* Terminal Titlebar (Compact) */}
              <div className="bg-foreground/1.5 border-b border-border px-5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="font-mono text-[0.65rem] text-text-muted ml-3 tracking-wider">
                    hardik-bot-console v1.0.0
                  </span>
                </div>
                {/* Status Indicator */}
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                  <span className="font-mono text-[0.58rem] text-accent-primary font-bold">ONLINE</span>
                </div>
              </div>

              {/* Chat Interface Main */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Holographic Avatar Panel (Compact p-4) */}
                <div className="w-full md:w-1/3 bg-foreground/[0.001] border-b md:border-b-0 md:border-r border-border/80 p-4 flex flex-col items-center justify-center gap-3.5 select-none">
                  {/* Concentric pulse rings */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-accent-primary/20 animate-ping opacity-20" style={{ animationDuration: "2.5s" }} />
                    <div className="absolute -inset-2 rounded-full border border-accent-primary/10 animate-ping opacity-10" style={{ animationDuration: "3.5s" }} />

                    <div className="relative w-14 h-14 rounded-full border border-accent-primary/50 overflow-hidden bg-background flex items-center justify-center shadow-[0_0_15px_rgba(0,143,81,0.08)]">
                      <span className="font-mono text-xs font-black text-accent-primary animate-pulse tracking-wider">
                        H.AI
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-display font-bold text-xs text-foreground tracking-wide">
                      Hardik Virtual Model
                    </h4>
                    <p className="text-[0.62rem] text-text-muted mt-1 leading-snug">
                      MERN Engine Replica
                    </p>
                  </div>

                  {/* Wave Visual */}
                  <div className="flex gap-0.5 items-end h-3 w-8 mt-1">
                    <motion.div
                      animate={{ height: ["25%", "80%", "25%"] }}
                      transition={{ repeat: Infinity, duration: 1.1, delay: 0.1 }}
                      className="w-0.5 bg-accent-primary rounded-full"
                    />
                    <motion.div
                      animate={{ height: ["20%", "95%", "20%"] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
                      className="w-0.5 bg-accent-primary rounded-full"
                    />
                    <motion.div
                      animate={{ height: ["30%", "75%", "30%"] }}
                      transition={{ repeat: Infinity, duration: 1.3, delay: 0.2 }}
                      className="w-0.5 bg-accent-primary rounded-full"
                    />
                    <motion.div
                      animate={{ height: ["15%", "90%", "15%"] }}
                      transition={{ repeat: Infinity, duration: 1.0, delay: 0.4 }}
                      className="w-0.5 bg-accent-primary rounded-full"
                    />
                  </div>
                </div>

                {/* Dialog Messages Window */}
                <div className="flex-1 flex flex-col min-h-0 bg-background/20">
                  {/* Messages list (Compact padding) */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                    {chatHistory.map((msg, index) => {
                      const isBot = msg.sender === "bot";
                      return (
                        <div
                          key={msg.id + index}
                          className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-[15px] px-3.5 py-2.5 font-sans text-[0.72rem] leading-relaxed ${isBot
                              ? "bg-foreground/2.5 text-foreground border border-border/60 rounded-tl-sm"
                              : "bg-accent-primary/10 border border-accent-primary/15 text-accent-primary rounded-tr-sm"
                              }`}
                          >
                            {msg.isTyping ? (
                              <div className="flex gap-1.5 py-0.5 px-1.5 items-center select-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Ask Suggestion pills (Compact) */}
                  <div className="px-4 py-2 bg-foreground/[0.002] border-t border-border/30 overflow-x-auto no-scrollbar flex gap-1.5">
                    <button
                      onClick={() => handleSendChat("Who is Hardik?")}
                      className="px-3 py-1 bg-background hover:bg-foreground/2 border border-border rounded-full font-sans text-[0.62rem] font-medium text-text-muted hover:text-foreground transition-all cursor-pointer whitespace-nowrap focus:outline-none"
                    >
                      Who is Hardik?
                    </button>
                    <button
                      onClick={() => handleSendChat("What are your core skills?")}
                      className="px-3 py-1 bg-background hover:bg-foreground/2 border border-border rounded-full font-sans text-[0.62rem] font-medium text-text-muted hover:text-foreground transition-all cursor-pointer whitespace-nowrap focus:outline-none"
                    >
                      Core skills?
                    </button>
                    <button
                      onClick={() => handleSendChat("Are you open to freelance projects?")}
                      className="px-3 py-1 bg-background hover:bg-foreground/2 border border-border rounded-full font-sans text-[0.62rem] font-medium text-text-muted hover:text-foreground transition-all cursor-pointer whitespace-nowrap focus:outline-none"
                    >
                      Freelance?
                    </button>
                    <button
                      onClick={() => handleSendChat("Where are you located?")}
                      className="px-3 py-1 bg-background hover:bg-foreground/2 border border-border rounded-full font-sans text-[0.62rem] font-medium text-text-muted hover:text-foreground transition-all cursor-pointer whitespace-nowrap focus:outline-none"
                    >
                      Location?
                    </button>
                  </div>

                  {/* Form input bar (Compact) */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChat(chatInput);
                    }}
                    className="p-2 border-t border-border/70 flex gap-1.5"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a question..."
                      className="flex-1 bg-foreground/1.5 border border-border/80 hover:border-border rounded-lg px-3 py-2 font-sans text-[0.72rem] text-foreground placeholder:text-text-muted/40 outline-none transition-all focus:border-accent-primary/60 focus:bg-background"
                    />
                    <button
                      type="submit"
                      className="w-8.5 h-8.5 rounded-lg bg-accent-primary/10 hover:bg-accent-primary text-accent-primary hover:text-background border border-accent-primary/20 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
