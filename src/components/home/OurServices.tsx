"use client";
import React from "react";
import SchemaServiceSection from "./SchemaServiceSection";
import EndPointServiceSection from "./EndPointServiceSection";
import APIDocServiceSection from "./APIDocServiceSection";

export default function OurServices() {
  return (
    <section className="pt-16 sm:pt-20 pb-8 sm:pb-12 bg-white dark:bg-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent sm:text-4xl md:text-5xl mb-4">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive cloud solutions to power your applications
          </p>
        </div>
        <SchemaServiceSection />
        <EndPointServiceSection />
        <APIDocServiceSection />
      </div>
    </section>
  );
}
