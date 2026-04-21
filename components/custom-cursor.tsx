"use client"

import React, { useState, useEffect } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

const useMousePosition = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return { mouseX, mouseY };
};

export const CustomCursor = () => {
    const { mouseX, mouseY } = useMousePosition();
    const [isHovering, setIsHovering] = useState(false);
    const [cursorText, setCursorText] = useState("");

    const springConfig = { damping: 25, stiffness: 250 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleHover = (e: any) => {
            const target = e.target as HTMLElement;
            const hoverData = target.closest("[data-cursor]");
            if (hoverData) {
                setIsHovering(true);
                setCursorText(hoverData.getAttribute("data-cursor") || "");
            } else {
                setIsHovering(false);
                setCursorText("");
            }
        };

        window.addEventListener("mouseover", handleHover);
        return () => window.removeEventListener("mouseover", handleHover);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-12 h-12 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center overflow-hidden border border-white/20 hidden md:flex"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
            }}
            animate={{
                scale: isHovering ? 2.5 : 1,
            }}
        >
            <div className={`w-2 h-2 bg-primary rounded-full transition-all duration-300 ${isHovering ? "scale-0" : "scale-100"}`} />
            {isHovering && cursorText && (
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[4px] font-outfit font-black uppercase tracking-tighter text-bg-dark text-center px-1"
                >
                    {cursorText}
                </motion.span>
            )}
        </motion.div>
    );
};
