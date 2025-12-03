import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { ExternalLink, Github } from "lucide-react";

export const HoverEffect = ({
  className,
  projects,
}: {
  className?: string;
  projects: {
    title: string;
    description: string;
    image?: string;
    tags?: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
  }[];
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {projects.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 z-0 h-full w-full bg-neutral-200 dark:bg-slate-500/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="transform transition-all hover:scale-105"
          >
            <div className="relative overflow-hidden bg-secondary shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300 min-h-[500px] flex flex-col z-10">
              <div className="h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/0 opacity-80 transition-opacity duration-300 group" />
                <div className="relative h-56 overflow-hidden rounded-t-lg">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={"project image"}
                    fill
                    className="object-cover object-top scale-105 md:scale-100 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow ">
                  <h3 className="text-2xl font-semibold  mb-3">{item.title}</h3>
                  <p className="text-gray-500 mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-white/20 text-primary dark:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 absolute w-full bottom-0 flex justify-between">
                  <Link
                    href={item.githubUrl || "#"}
                    className={`flex items-center ${
                      item.githubUrl == "#" && "pointer-events-none opacity-40"
                    }`}
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={item.githubUrl == "#"}
                      className="rounded-full border-primary  hover:bg-primary/10 transition-all"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Button>
                  </Link>
                  <Link
                    href={item.liveUrl || "#"}
                    className={`flex items-center ${
                      item.liveUrl == "#" && "pointer-events-none opacity-40"
                    }`}
                    target="_blank"
                  >
                    <Button
                      size="sm"
                      disabled={item.liveUrl == "#"}
                      className="rounded-full bg-primary hover:bg-primary/80 transition-all"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};
