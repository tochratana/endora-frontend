"use client";

import React from "react";
import {
  FiGlobe,
  FiServer,
  FiHardDrive,
  FiCode,
  FiShield,
  FiSettings,
} from "react-icons/fi";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FiServer className="w-12 h-12" />,
      title: "Auto-Generated RESTful APIs",
      description:
        "Transform your database into production-ready APIs instantly with PostgreSQL reliability.",
      highlight: "PostgreSQL",
    },
    {
      icon: <FiHardDrive className="w-12 h-12" />,
      title: "Universal Data Import",
      description:
        "Import from SQL, JSON, Excel, CSV with intelligent parsing and validation.",
      highlight: "SQL, JSON, Excel, CSV",
    },
    {
      icon: <FiGlobe className="w-12 h-12" />,
      title: "Web Scraping",
      description:
        "Extract data from any website automatically with our intelligent web scraping engine.",
      highlight: "web scraping engine",
    },
    {
      icon: <FiCode className="w-12 h-12" />,
      title: "Interactive API Testing",
      description:
        "Test APIs instantly with built-in Swagger-style interface and endpoint validation.",
      highlight: "Swagger-style",
    },
    {
      icon: <FiSettings className="w-12 h-12" />,
      title: "Visual Data Management",
      description:
        "Manage data with intuitive dashboard. Perform CRUD operations with ease.",
      highlight: "CRUD operations",
    },
    {
      icon: <FiShield className="w-12 h-12" />,
      title: "One-Click Postman Export",
      description:
        "Generate complete Postman collections automatically for team collaboration.",
      highlight: "Postman collections",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold sm:text-5xl mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Everything you need to build APIs
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From data import to testing and deployment. Transform any data
            source into powerful APIs with zero coding required.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          {/* First Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Title */}
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>

                {/* Description with Image */}
                <div className="flex items-start justify-between">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1 pr-4">
                    {feature.description.split(feature.highlight)[0]}
                    <span className="text-secondary-600 dark:text-secondary-400 font-semibold">
                      {feature.highlight}
                    </span>
                    {feature.description.split(feature.highlight)[1]}
                  </p>

                  {/* Icon on the right of description */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-gray-600">
                      <div className="text-primary-600 dark:text-primary-400">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(3, 6).map((feature, index) => (
              <div
                key={index + 3}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Title */}
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>

                {/* Description with Image */}
                <div className="flex items-start justify-between">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1 pr-4">
                    {feature.description.split(feature.highlight)[0]}
                    <span className="text-secondary-600 dark:text-secondary-400 font-semibold">
                      {feature.highlight}
                    </span>
                    {feature.description.split(feature.highlight)[1]}
                  </p>

                  {/* Icon on the right of description */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-gray-600">
                      <div className="text-primary-600 dark:text-primary-400">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
