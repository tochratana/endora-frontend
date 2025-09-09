"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiDatabase } from "react-icons/fi";

export default function CloudStorageSection() {
  const storageFeatures = [
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: "Data sources",
    },
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: "API Endpoints",
    },
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: "Schema Database",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Title */}
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Cloud Storage
            </h2>

            {/* Main Heading */}
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Our Cloud Storage Delivers Cost effective, Scalable Storage
            </h3>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Cloud Storage enables organizations to store, access, and maintain
              data so that they do not need to plan and upgrade their storage
              infrastructure. Many businesses have a varied requirement for
              storage.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {storageFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center border border-primary-400/30">
                    <div className="text-primary-400">{feature.icon}</div>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium text-lg">
                    {feature.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Isometric Server Illustration */}
            <div className="relative">
              {/* Main Server Stack */}
              <div className="relative z-10">
                <svg
                  width="400"
                  height="300"
                  viewBox="0 0 400 300"
                  className="w-full max-w-md"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Server Stack 1 */}
                  <g transform="translate(50, 50)">
                    {/* Base */}
                    <path
                      d="M0 40 L60 20 L120 40 L60 60 Z"
                      fill="url(#serverGradient1)"
                    />
                    <path
                      d="M60 60 L120 40 L120 80 L60 100 Z"
                      fill="url(#serverGradient2)"
                    />
                    <path
                      d="M0 40 L60 60 L60 100 L0 80 Z"
                      fill="url(#serverGradient3)"
                    />

                    {/* Layer 2 */}
                    <path
                      d="M0 20 L60 0 L120 20 L60 40 Z"
                      fill="url(#serverGradient1)"
                    />
                    <path
                      d="M60 40 L120 20 L120 60 L60 80 Z"
                      fill="url(#serverGradient2)"
                    />
                    <path
                      d="M0 20 L60 40 L60 80 L0 60 Z"
                      fill="url(#serverGradient3)"
                    />

                    {/* Top Layer */}
                    <path
                      d="M0 0 L60 -20 L120 0 L60 20 Z"
                      fill="url(#serverGradient1)"
                    />
                    <path
                      d="M60 20 L120 0 L120 40 L60 60 Z"
                      fill="url(#serverGradient2)"
                    />
                    <path
                      d="M0 0 L60 20 L60 60 L0 40 Z"
                      fill="url(#serverGradient3)"
                    />
                  </g>

                  {/* Server Stack 2 */}
                  <g transform="translate(200, 80)">
                    {/* Base */}
                    <path
                      d="M0 30 L40 15 L80 30 L40 45 Z"
                      fill="url(#serverGradient4)"
                    />
                    <path
                      d="M40 45 L80 30 L80 60 L40 75 Z"
                      fill="url(#serverGradient5)"
                    />
                    <path
                      d="M0 30 L40 45 L40 75 L0 60 Z"
                      fill="url(#serverGradient6)"
                    />

                    {/* Top Layer */}
                    <path
                      d="M0 0 L40 -15 L80 0 L40 15 Z"
                      fill="url(#serverGradient4)"
                    />
                    <path
                      d="M40 15 L80 0 L80 30 L40 45 Z"
                      fill="url(#serverGradient5)"
                    />
                    <path
                      d="M0 0 L40 15 L40 45 L0 30 Z"
                      fill="url(#serverGradient6)"
                    />
                  </g>

                  {/* Server Stack 3 */}
                  <g transform="translate(300, 120)">
                    <path
                      d="M0 20 L30 10 L60 20 L30 30 Z"
                      fill="url(#serverGradient7)"
                    />
                    <path
                      d="M30 30 L60 20 L60 40 L30 50 Z"
                      fill="url(#serverGradient8)"
                    />
                    <path
                      d="M0 20 L30 30 L30 50 L0 40 Z"
                      fill="url(#serverGradient9)"
                    />
                  </g>

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient
                      id="serverGradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1E40AF" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#1E40AF" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient4"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient5"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#6D28D9" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient6"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient7"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient8"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#0891B2" />
                      <stop offset="100%" stopColor="#0E7490" />
                    </linearGradient>
                    <linearGradient
                      id="serverGradient9"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#0891B2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg opacity-10 dark:opacity-20"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-lg opacity-10 dark:opacity-20"
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
