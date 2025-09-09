"use client";

import React from "react";
import { WordRotateDemo } from "../ui/TextReves";
import { OrbitingCirclesDemo } from "../magicui/OrbitingCirclesDemo";
import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";
import Button from "../ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-white dark:bg-gray-900 min-h-screen overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black opacity-90" />

      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="absolute inset-0 h-full w-full fill-gray-200/30 stroke-gray-200/30 dark:fill-white/10 dark:stroke-white/10 z-0"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.05)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:50px_50px]" />
      {/* Content */}
      <div className="relative mx-auto z-20 px-4 sm:px-6 lg:px-8 max-w-7xl py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Block */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-baseline text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              <span>
                Say Goodbye To <WordRotateDemo />{" "}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8 max-w-2xl mx-auto lg:mx-0">
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-4">
                Endura is the Backend-as-a-Service development platform.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                The all-in-one Backend-as-a-Service platform with
                authentication, APIs, databases, and more.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button>Start your project</Button>
              <Button variant="secondary">Get App</Button>
            </div>
          </div>

          {/* Right Visual Block */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <OrbitingCirclesDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
