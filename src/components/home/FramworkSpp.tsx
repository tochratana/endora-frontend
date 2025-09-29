"use client";

import React, { useState } from "react";
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
    <section className="relative bg-white dark:bg-gray-900 overflow-hidden pt-8 pb-16">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

      {/* Floating Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

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
                <span className="text-primary-600 dark:text-secondary-400 ml-2 transition-all duration-300 text-2xl font-bold">
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
                className="aspect-square bg-gray-50/80 hover:bg-gray-100/80 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 flex items-center justify-center group relative transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
                onMouseEnter={() => setHoveredFramework(name)}
                onMouseLeave={() => setHoveredFramework(null)}
              >
                <div className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-all duration-300">
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
