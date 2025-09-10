"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiDatabase,
  FiLock,
  FiEdit3,
  FiFileText,
  FiTool,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

export default function APIBuildSection() {
  const apiFeatures = [
    {
      icon: <FiEdit3 className="w-8 h-8" />,
      title: "API Design",
      description:
        "Simplify your API design workflow, design and test your APIs, while generating JSON/XML schemas with a simple click.",
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: "API Documentation",
      description:
        "Share your visually stunning API docs, coupled with 'try it out' option and example code. Customize domains, headers, and layouts to match your brand and enhance user experience.",
    },
    {
      icon: <FiTool className="w-8 h-8" />,
      title: "API Debugging",
      description:
        "Automatically validate response results and generate API documentation upon debugging completion.",
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Smart Mock",
      description:
        "Our smart mocking feature automatically generates data based on field names, while advanced mocking returns specified data tailored to requests.",
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: "Automated Testing",
      description:
        "Generate test cases directly by adding your API endpoints, visually define assertions, and create test scenarios with branch support.",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-6">
            Build APIs Faster With Endora
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Design. Debug. Test. Document. Mock.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* First Row - 3 cards */}
          {apiFeatures.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-emerald-400/5 dark:from-cyan-400/10 dark:to-emerald-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-teal-800/30 dark:to-cyan-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary-100 dark:border-teal-600/30">
                  <div className="text-primary-600 dark:text-teal-400">
                    {feature.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4 group-hover:text-primary-500 dark:group-hover:text-secondary-500 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Second Row - 2 cards centered */}
          <div className="xl:col-span-3 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              {apiFeatures.slice(3, 5).map((feature, index) => (
                <motion.div
                  key={index + 3}
                  className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700/50 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-emerald-400/5 dark:from-cyan-400/10 dark:to-emerald-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-teal-800/30 dark:to-cyan-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary-100 dark:border-teal-600/30">
                      <div className="text-primary-600 dark:text-teal-400">
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-4 group-hover:text-primary-500 dark:group-hover:text-secondary-500 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
