"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Home,
  Info,
  LayoutDashboard,
  ArrowLeft,
  BookOpen,
  Wrench,
} from "lucide-react";

export default function NotFound() {
  const { data: session } = useSession();

  const handleGoBack = () => {
    window.history.back();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <AlertTriangle className="w-32 h-32 mx-auto text-primary-500 dark:text-secondary-400 drop-shadow-lg" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
          }}
          className="text-8xl font-extrabold text-primary-600 dark:text-primary-400 mb-4 tracking-tight"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6"
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed"
        >
          The page you&apos;re looking for seems to have wandered off.
          Don&apos;t worry, let&apos;s get you back on track with these helpful
          links.
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Link
              href="/home"
              className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <Home className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Go Home
              </span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/service"
              className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <Wrench className="w-8 h-8 text-secondary-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Services
              </span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <a
              href="https://endora-docs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <BookOpen className="w-8 h-8 text-gray-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Documents
              </span>
            </a>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/about"
              className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
            >
              <Info className="w-8 h-8 text-gray-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                About
              </span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              onClick={handleGoBack}
              className="group flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700 w-full"
            >
              <ArrowLeft className="w-8 h-8 text-gray-500 mb-3 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Go Back
              </span>
            </button>
          </motion.div>

          {session && (
            <motion.div variants={itemVariants}>
              <Link
                href="/dashboard"
                className="group flex flex-col items-center p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <LayoutDashboard className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Dashboard</span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          If you believe this is an error, please contact our support team.
        </motion.div>
      </motion.div>
    </div>
  );
}
