"use client";

import React, { useState } from "react";
import { AnimatedGridPattern } from "../magicui/animated-grid-pattern";
import "devicon/devicon.min.css";

const frameworks = [
  { name: "Next.js", iconClass: "devicon-nextjs-plain colored" },
  { name: "React", iconClass: "devicon-react-original colored" },
  { name: "Vue.js", iconClass: "devicon-vuejs-plain colored" },
  { name: "Angular", iconClass: "devicon-angularjs-plain colored" },
  { name: "Svelte", iconClass: "devicon-svelte-plain colored" },
  { name: "SolidJS", iconClass: "devicon-solidjs-plain colored" },
  { name: "Nuxt", iconClass: "devicon-nuxtjs-plain colored" },
  { name: "jQuery", iconClass: "devicon-jquery-plain colored" },
  { name: "Flutter", iconClass: "devicon-flutter-plain colored" },
  { name: "Android", iconClass: "devicon-android-plain colored" },
];

export default function FrameworkSection() {
  const [hoveredFramework, setHoveredFramework] = useState<string | null>(null);

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
      <div className="relative z-20 p-8">
        <div className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold sm:text-5xl mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Front-End Frameworks Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Endora supports a wide range of front-end frameworks, allowing you
              to build your projects with the tools you love. Whether
              you&apos;re a fan of
              {hoveredFramework && (
                <span className="text-primary-600 dark:text-primary-400 ml-2 transition-opacity duration-300">
                  {hoveredFramework}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-5 gap-px bg-gray-200/50 dark:bg-gray-800/50">
            {frameworks.map(({ name, iconClass }) => (
              <div
                key={name}
                className="aspect-square bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 flex items-center justify-center group relative transition-all duration-300"
                onMouseEnter={() => setHoveredFramework(name)}
                onMouseLeave={() => setHoveredFramework(null)}
              >
                <div className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-all duration-300">
                  <i className={`${iconClass} text-5xl`}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
