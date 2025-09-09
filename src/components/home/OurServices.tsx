"use client";
import React from "react";
import SchemaServiceSection from "./SchemaServiceSection";
import EndPointServiceSection from "./EndPointServiceSection";
import APIDocServiceSection from "./APIDocServiceSection";

export default function OurServices() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent sm:text-5xl mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
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
