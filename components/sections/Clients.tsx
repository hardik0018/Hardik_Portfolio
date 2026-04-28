"use client";
 
import { Shuffle } from "../TextAnimation";
 
const TECH_STACK = [
  "MONGODB",
  "EXPRESS.JS",
  "REACT.JS",
  "NODE.JS",
  "NEXT.JS",
  "GSAP",
  "TAILWIND CSS",
];
 
export default function Clients() {
  return (
    <section className="border-y border-border/10 bg-background overflow-hidden py-10">
      <div className="container px-6 mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
          {TECH_STACK.map((tech) => (
            <div
              key={tech}
              className="font-display text-2xl md:text-4xl font-black text-muted-foreground/40 hover:text-foreground transition-all duration-300 cursor-default"
              style={{ fontVariant: "small-caps" }}
            >
              <Shuffle 
                text={tech} 
                duration={0.4}
                maxDelay={0.2}
                triggerOnView
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
