"use client";
import React, { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  path: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({
  path,
  className = "w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] max-w-full",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationInstance: AnimationItem | null = null;

    const loadLottie = async () => {
      try {
        // Dynamically import lottie-web to avoid SSR issues
        const lottie = (await import("lottie-web")).default;

        if (containerRef.current) {
          animationInstance = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop,
            autoplay,
            path,
          });
        }
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      }
    };

    loadLottie();

    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, [path, loop, autoplay]);

  return <div ref={containerRef} className={className} />;
}
