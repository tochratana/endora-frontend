"use client";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export function ShinyText({ children, className, delay = 0 }: ShinyTextProps) {
  const letters = children.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 200 },
    },
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block relative"
          whileHover={{
            scale: 1.2,
            color: "var(--color-secondary-500)",
            textShadow: `
             0 0 10px var(--color-primary-100), 
             // 0 0 20px var(--color-secondary-200), 
             // 0 0 30px var(--color-secondary-300), 
             0 0 40px var(--color-primary-400)
            `,
            transition: { duration: 0.2 },
          }}
          style={{
            background: `
              linear-gradient(
                45deg,
                var(--color-primary-700),
                var(--color-primary-500),
                var(--color-primary-300),
                var(--color-primary-100),
                var(--color-primary-500),
                var(--color-primary-700)
              )
            `,
            backgroundSize: "300% 300%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent", // ✅ keeps gradient visible
            animation: `shimmer 3s ease-in-out infinite ${index * 0.1}s`,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}
