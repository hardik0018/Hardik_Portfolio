"use client";

import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { motion } from "framer-motion";
import {
  Construction,
  Wrench,
  Github,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import Link from "next/link";

export default function UnderDevelopment() {
  return (
    <AnimatedGradient
      className="min-h-screen flex items-center justify-center"
      colors={["#5EEAD4", "#A855F7", "#3B82F6"]}
      blur={150}
    >
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-background/20 border-2 border-primary flex flex-col gap-2 justify-center items-center backdrop-blur-sm p-4 sm:rounded-full rounded-2xl">
            <span className="w-20 h-20 bg-red-100 rounded-full grid place-items-center">
              <Construction className="h-16 w-16 text-primary" />
            </span>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 dark:text-white">
              Under Development
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="my-8 text-muted-foreground font-semibold text-lg max-w-md mx-auto"
          >
            This portfolio is currently being built. We’ll be live soon with
            something awesome!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-12 flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Wrench className="h-5 w-5 text-primary" />
            <span className="font-semibold">Expected launch: Coming Soon™</span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-10 flex justify-center gap-6 text-muted-foreground"
          >
            <Link
              href="https://github.com/hardikvatukiya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
            </Link>
            <span className="text-muted-foreground hover:text-primary transition-colors cursor-not-allowed">
              <Twitter className="h-6 w-6" />
            </span>

            <Link
              href="https://instagram.com/hardik_vatukiya_07"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>

            <Link
              href="https://linkedin.com/in/hardik-vatukiya"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedGradient>
  );
}
