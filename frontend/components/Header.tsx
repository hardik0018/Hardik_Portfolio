"use client";

import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import Logo from "./ui/Logo";
import Magnetic from "./ui/Magnetic";

import { useState, useEffect } from "react";

interface LenisScrollable {
  scrollTo: (target: string | number | Element | HTMLElement, options?: Record<string, unknown>) => void;
}

const NavLink = ({ href, children, isActive, hasDot, onClick }: { href: string, children: React.ReactNode, isActive?: boolean, hasDot?: boolean, onClick?: () => void }) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();

    if (href.startsWith("/#")) {
      if (pathname === "/") {
        e.preventDefault();
        const hash = href.substring(1); // Gets "#about"

        let scrollTarget: string | number | Element = hash;
        const targetElement = document.querySelector(hash);

        if (hash === "#contact") {
          // Contact is revealed from behind, so we must scroll to the very bottom
          scrollTarget = document.body.scrollHeight;
        } else if (targetElement) {
          // If the element is pinned by GSAP, its .pin-spacer holds the true document position
          const pinSpacer = targetElement.closest('.pin-spacer');
          if (pinSpacer) {
            scrollTarget = pinSpacer;
          } else {
            scrollTarget = targetElement;
          }
        }

        const globalLenis = window.lenis as unknown as LenisScrollable | undefined;
        if (globalLenis) {
          globalLenis.scrollTo(scrollTarget);
        } else if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <TransitionLink
      href={href}
      onClick={handleClick}
      className={cn(
        "relative px-4 py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-500 flex items-center gap-2 group/link",
        isActive
          ? "bg-foreground text-background rounded-full px-6 shadow-lg shadow-foreground/10"
          : "text-text-muted hover:text-foreground"
      )}
    >
      {children}
      {hasDot && <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_8px] shadow-accent-primary/60" />}
      {!isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-foreground transition-all duration-300 group-hover/link:w-1/3" />
      )}
    </TransitionLink>
  );
};

export interface NavigationData {
  title: string;
  menuItems: {
    title: string;
    url: string;
  }[];
  actionButton: {
    title: string;
    url: string;
  };
}

const DEFAULT_MENU = [
  { title: "Home", url: "/" },
  { title: "About", url: "/#about" },
  { title: "Journey", url: "/#journey" },
  { title: "Projects", url: "/projects" },
  { title: "Contact", url: "/#contact" },
];

const HeroHeader = ({ initialData }: { initialData?: NavigationData }) => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState<string>("");

  const menuItems = initialData?.menuItems || DEFAULT_MENU;
  const actionButton = initialData?.actionButton || { title: "Let's Connect", url: "/#contact" };

  useEffect(() => {
    const handleHash = () => {
      if (pathname !== "/") {
        setActiveHash("");
      } else {
        if (typeof window !== "undefined" && window.location.hash) {
          setActiveHash(window.location.hash);
        } else {
          setActiveHash("");
        }
      }
    };
    const id = requestAnimationFrame(handleHash);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const handleActionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const url = actionButton.url;
    if (url.startsWith("/#")) {
      const hash = url.substring(1);
      setActiveHash(hash);
      if (pathname === "/") {
        e.preventDefault();
        const globalLenis = window.lenis as unknown as LenisScrollable | undefined;
        if (globalLenis) {
          if (hash === "#contact") {
            globalLenis.scrollTo(document.body.scrollHeight);
          } else {
            const target = document.querySelector(hash);
            if (target) globalLenis.scrollTo(target);
          }
        } else {
          const target = document.querySelector(hash);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <header className="fixed top-2 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-100 animate-in fade-in slide-in-from-top-4 duration-1000">
      <nav className="flex items-center justify-between bg-background backdrop-blur-sm border border-foreground/30 rounded-full shadow-[0_20px_50px] shadow-foreground/5 ring-1 ring-foreground/5">
        {/* Logo Section */}
        <div className="flex items-center pl-4 pr-6">
          <Magnetic range={40} strength={0.3}>
            <TransitionLink href="/" className="transition-all duration-300 hover:scale-110 active:scale-95 group">
              <Logo text={initialData?.title || "HV"} />
            </TransitionLink>
          </Magnetic>
        </div>
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-1.5 px-4 min-h-[40px]">
          {menuItems.map((item, index) => {
            const url = item.url;
            let isActive = false;
            let hasDot = false;

            if (url === "/") {
              isActive = pathname === "/" && activeHash === "";
            } else if (url.startsWith("/#")) {
              const hash = url.substring(1);
              isActive = activeHash === hash;
            } else {
              isActive = pathname === url;
              hasDot = pathname === url;
            }

            return (
              <Magnetic key={index} range={45} strength={0.35}>
                <NavLink
                  href={url}
                  isActive={isActive}
                  hasDot={hasDot}
                  onClick={() => {
                    if (url.startsWith("/#")) {
                      setActiveHash(url.substring(1));
                    } else if (url === "/") {
                      setActiveHash("");
                    }
                  }}
                >
                  {item.title}
                </NavLink>
              </Magnetic>
            );
          })}
        </div>
        {/* Action Button */}
        <div className="pr-2">
          <Magnetic range={50} strength={0.35}>
            <TransitionLink href={actionButton.url} onClick={handleActionClick}>
              <Button className="flex items-center gap-3 px-4 py-1 rounded-full bg-accent-primary text-background text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-500 hover:opacity-90 hover:shadow-[0_12px_24px] hover:shadow-accent-primary/30 hover:-translate-y-0.5 active:scale-95 group/btn">
                {actionButton.title}
                <div className="relative flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </div>
              </Button>
            </TransitionLink>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
};

export default HeroHeader;
