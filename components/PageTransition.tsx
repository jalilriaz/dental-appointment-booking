"use client";

import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Smooth page entrance animation — entire content slides up from bottom with a fade.
 * Uses GPU-accelerated transforms for optimal performance.
 * Wrap the outermost page container with this component.
 */
export default function PageTransition({ children, className = "" }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1], // custom ease-out curve for buttery smoothness
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
