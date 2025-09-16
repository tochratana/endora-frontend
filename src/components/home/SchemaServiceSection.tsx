"use client";
import React from "react";
import LottieAnimation from "../ui/LottieAnimation";

export default function SchemaServiceSection() {
  return (
    <section className="py-2 sm:py-0 sm:-mt-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-4 md:grid-cols-2 md:items-center md:gap-8">
          <div className="order-1">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
                Schema Generation
              </h2>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate and manage your database schemas effortlessly with our
                advanced Schema Generation Service. Streamline your development
                workflow with automated schema creation and management.
              </p>
            </div>
          </div>
          <div className="order-2 flex justify-center">
            <LottieAnimation
              path="/home/cloud.json"
              className="w-80 h-80 sm:w-96 sm:h-96 md:w-[32rem] md:h-[32rem] lg:w-[36rem] lg:h-[36rem] max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
