"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { DatabaseZapIcon, FolderOpenIcon, Settings } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function WhyUs() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
      mirror: true,
      easing: "ease-out",
      offset: 50,
    });
  }, []);
  const features = [
    {
      icon: (
        <DatabaseZapIcon className="text-[var(--color-secondary)] w-8 h-8" />
      ),
      title: "Schema Builder",
      description:
        "Create and manage database schemas with an intuitive visual editor and relationships without needing complex SQL.",
      colSpan: "col-span-4",
    },
    {
      icon: <Settings className="text-[var(--color-secondary)] w-8 h-8" />,
      title: "API Generator",
      description:
        "Generate RESTful API endpoints from your schema in seconds. Just design your schema and get production-ready APIs instantly.",
      colSpan: "col-span-4",
    },
    {
      icon: (
        <FolderOpenIcon className="text-[var(--color-secondary)] w-8 h-8" />
      ),
      title: "Download JSON",
      description:
        "Download ready-to-use JSON collections for Postman. Save time by testing your endpoints immediately with structured requests and sample payloads.",
      colSpan: "col-span-8",
    },
  ];

  return (
    <section className="w-full pt-32 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-9 grid-cols-4 gap-6 md:gap-8 items-center">
        {/* Left side: Title + Image */}
        <div
          data-aos="fade-right"
          data-aos-delay="120"
          data-aos-offset="50"
          className="md:col-span-3 col-span-4 flex flex-col items-center justify-center gap-6 mx-auto -mt-8 md:mt-0"
        >
          <h1 className="md:text-5xl text-4xl font-semibold text-center text-[var(--color-secondary)] ml-12 md:ml-0">
            Why Us?
          </h1>
          <Image
            src="/whyus.svg"
            alt="Illustration"
            width={500}
            height={500}
            className="w-5/6 md:w-11/12 h-auto object-contain rounded ml-10 md:mx-auto"
          />
        </div>

        {/* Right side: Features */}
        <div
          data-aos="fade-left"
          data-aos-delay="120"
          data-aos-offset="50"
          className="col-span-6 grid grid-cols-8 gap-6 text-center md:ml-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.colSpan} group relative bg-gray-50 dark:bg-gray-800/50 rounded-xl md:p-6 p-4 border border-[var(--color-primary)] hover:border-cyan-400/50 dark:hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/10 flex flex-col items-center`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-emerald-400/5 dark:from-cyan-400/10 dark:to-emerald-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-gray-800 dark:text-gray-300 font-semibold mt-2 mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-900 dark:text-gray-300 md:text-base text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
