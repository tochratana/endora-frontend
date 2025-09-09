"use client";
import React from "react";
import LottieAnimation from "../ui/LottieAnimation";

export default function APIDocServiceSection() {
  return (
    <section className="">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="order-2 md:order-1">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent sm:text-4xl lg:text-5xl">
                API Documentation
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Simplify your API integration with our comprehensive API
                Documentation Service. Generate clear, concise, and interactive
                documentation to enhance developer experience and streamline
                onboarding.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <LottieAnimation path="/home/cd.json" />
          </div>
        </div>
      </div>
    </section>
  );
}
