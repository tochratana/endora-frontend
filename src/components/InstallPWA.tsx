"use client";

import { useState, useEffect } from "react";

// Log function for debugging
const log = (message: string, data?: Record<string, unknown>) => {
  console.log(`[PWA Debug] ${message}`, data || "");
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    console.log("PWA Component Mounted");

    // Check if running in a PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is running in standalone mode (already installed)");
      setIsInstalled(true);
      return;
    }

    // Check if the browser supports service workers and register it
    if ("serviceWorker" in navigator) {
      console.log("Service Workers are supported");
      navigator.serviceWorker
        .register("/sw.js")
        .then(registration => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch(error => {
          console.error("Service Worker registration failed:", error);
        });
    } else {
      console.log("Service Workers are NOT supported");
    }

    const handler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event triggered");
      setPromptInstall(e as BeforeInstallPromptEvent);
      setSupportsPWA(true);
    };

    console.log("Adding beforeinstallprompt event listener");
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = async () => {
    if (!promptInstall) {
      return;
    }
    // Show the install prompt
    promptInstall.prompt();
    // Wait for the user to respond to the prompt
    await promptInstall.userChoice;
    // Reset the prompt variable
    setPromptInstall(null);
  };

  // For debugging - always show something
  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 p-2 rounded-lg">
        App is installed
      </div>
    );
  }

  // TODO PWA not support
  if (!supportsPWA) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 p-2 rounded-lg">
        {/* PWA not supported yet - waiting for browser criteria */}
      </div>
    );
  }

  return (
    <button
      className="border border-indigo-400 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition"
      onClick={onClick}
    >
      <span>Get App</span>
    </button>
  );
};
