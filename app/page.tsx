"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/experience-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import UnderDevelopment from "@/components/under-development";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const adminParam = searchParams.get("admin");
    // setIsAdmin(adminParam === "hardik@91");
  }, []);

  const underDevelop = !isAdmin;

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <ThemeProvider attribute="class">
      {underDevelop ? (
        <UnderDevelopment />
      ) : (
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="font-bold text-xl">
                <a href="/" className="flex items-center gap-2">
                  <span className="text-primary dark:text-white">
                    Hardik Vatukiya
                  </span>
                </a>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex gap-6">
                {["About", "Projects", "Skills", "Experience", "Contact"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  )
                )}
              </nav>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-4 md:hidden">
                <button
                  onClick={toggleMenu}
                  aria-label="Toggle Menu"
                  className="p-2 rounded-md hover:bg-accent"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {/* Theme Toggle + Hire Button */}
              <div className="hidden md:flex items-center gap-4">
                <ModeToggle />
                <Button asChild>
                  <a href="#contact">Hire Me</a>
                </Button>
              </div>
            </div>

            {/* Mobile Nav Panel */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute px-6 py-4 z-40 w-full border-b bg-background/80">
                <nav className="flex flex-col gap-3">
                  {["About", "Projects", "Skills", "Experience", "Contact"].map(
                    (item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {item}
                      </a>
                    )
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <ModeToggle />
                    <Button size="sm" variant="outline">
                      <a href="#contact">Hire Me</a>
                    </Button>
                  </div>
                </nav>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main>
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <SkillsSection />
            <ExperienceSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      )}
    </ThemeProvider>
  );
}
