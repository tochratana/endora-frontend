"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiDatabase, FiShield, FiZap, FiCloud } from "react-icons/fi";

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ServiceFeaturesSection() {
  const serviceFeatures: ServiceCard[] = [
    {
      icon: <FiDatabase className="w-8 h-8" />,
      title: "Modern Database",
      description:
        "PostgreSQL database with instant APIs, real-time subscriptions, and automatic scaling.",
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Schema Generation",
      description:
        "Complete auth solution with social logins, multi-factor authentication, and user management.",
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Endpoint Generataion",
      description:
        "Customize your workspace with a personal dashboard that provides at-a-glance insights.",
    },
    {
      icon: <FiCloud className="w-8 h-8" />,
      title: "API Documentation",
      description:
        "Secure file storage with CDN delivery, image transformations, and automatic backups.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Endora
            </span>{" "}
            Provide You Necessary Services To You
          </h2>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceFeatures.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-primary-500">{service.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
