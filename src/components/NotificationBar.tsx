"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  message: string;
  href: string;
}

const NotificationBar: React.FC = () => {
  const notifications: Notification[] = useMemo(
    () => [
      {
        id: 1,
        message:
          "🔥 អាហារូបករណ៍ ១០០% ថ្នាក់បំប៉នពិសេស ផែនទីបង្ហាញផ្លូវដើម្បីឈានទៅចាប់ជំនាញ IT",
        href: "https://t.me/+1lzWu7rdmRszYTk1",
      },
      {
        id: 2,
        message: "🚀 អាហារូបករណ៍ ៥០% ផ្នែកព័ត៌មានវិទ្យា Foundation ជំនាន់ទី ៥",
        href: "https://t.me/+lGjy2_FsUrE2NGE1",
      },
      {
        id: 3,
        message:
          "😲 អាហារូបករណ៍រហូតដល់ ១០០% ថ្នាកបរិញ្ញាបត្រ បរិញ្ញាបត្ររងផ្នែកព័ត៌មានវិទ្យា",
        href: "https://cstad.edu.kh/register",
      },
    ],
    []
  );

  const [current, setCurrent] = useState<Notification | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start with the first notification
    setCurrent(notifications[0]);
    setCurrentIndex(0);
  }, [notifications]);

  const handleClose = () => {
    // Move to the next notification in the array
    const nextIndex = (currentIndex + 1) % notifications.length;
    setCurrentIndex(nextIndex);
    setCurrent(notifications[nextIndex]);
  };

  const handleLinkClick = () => {
    // Hide the notification bar when user clicks the link
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && current && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 left-0 right-0 z-50"
        >
          <div className="bg-gradient-to-r from-secondary-500 to-primary-600 text-white p-2 shadow-lg">
            <div className="container mx-auto flex justify-center items-center space-x-4">
              <Link
                href={current.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="text-center group transition-all duration-500 ease-out will-change-transform hover:scale-105"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-medium inline-block"
                  >
                    {current.message}
                  </motion.span>
                </AnimatePresence>
              </Link>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-all duration-500 ease-out will-change-transform hover:scale-110"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBar;
