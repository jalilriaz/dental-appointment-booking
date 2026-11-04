"use client";

import { motion } from "framer-motion";
import { ReactNode, Children } from "react";

interface StaggerListProps {
    children: ReactNode;
    className?: string;
    /** Delay between each child animation in seconds */
    staggerDelay?: number;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const,
        },
    },
};

export default function StaggerList({ children, className = "", staggerDelay }: StaggerListProps) {
    const variants = staggerDelay
        ? {
            ...containerVariants,
            visible: {
                transition: { staggerChildren: staggerDelay },
            },
        }
        : containerVariants;

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {Children.map(children, (child) => (
                <motion.div variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
