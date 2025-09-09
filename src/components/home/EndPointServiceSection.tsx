"use client";
import React from "react";
import LottieAnimation from "../ui/LottieAnimation";

export default function EndPointServiceSection() {
  return (
    <section className="">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="order-1 md:order-2">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent sm:text-4xl lg:text-5xl">
                Endpoint Generation
              </h2>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate and manage your API endpoints effortlessly with our
                advanced Endpoint Generation Service. Streamline your
                development workflow with automated endpoint creation and
                management.
              </p>
            </div>
          </div>
          <div className="order-2 md:order-1 flex justify-center">
            <LottieAnimation path="/home/cloud1.json" />
          </div>
        </div>
      </div>
    </section>
  );
}
