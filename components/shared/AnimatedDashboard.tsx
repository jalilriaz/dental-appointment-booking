"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedDashboardProps {
    children: ReactNode;
    className?: string;
}

export default function AnimatedDashboard({ children, className = "" }: AnimatedDashboardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1], // cubic-bezier matching transition-premium
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
