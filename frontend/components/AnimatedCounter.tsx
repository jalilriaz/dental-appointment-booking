"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

export default function AnimatedCounter({
    value,
    duration = 2,
    suffix = "",
    prefix = ""
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!inView) return;

        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            // Calculate current value based on progress and duration
            // Using easeOutExpo for a nice slowing down effect at the end
            const percent = Math.min(progress / (duration * 1000), 1);
            const easeOut = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent);

            const currentCount = Math.floor(easeOut * value);
            setCount(currentCount);

            if (progress < duration * 1000) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(value); // Ensure it ends exactly on the target value
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [value, duration, inView]);

    return (
        <span ref={ref}>
            {prefix}
            {count.toLocaleString('en-US')}
            {suffix}
        </span>
    );
}
