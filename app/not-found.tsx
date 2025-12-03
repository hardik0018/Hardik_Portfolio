"use client";

import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <AnimatedGradient className="min-h-screen flex items-center justify-center">
      <div className="container max-w-2xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-[6rem] sm:text-[8rem] font-extrabold text-primary"
          >
            404
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Page Not Found
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto mb-8"
          >
            Looks like the page you were looking for doesn’t exist or has been
            moved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-primary/30"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedGradient>
  );
}
