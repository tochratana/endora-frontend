"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "../button/Button";
import { InstallPWA } from "../ui/InstallPWA";
import { signIn } from "next-auth/react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full
                 bg-white/90 text-gray-900 shadow-md backdrop-blur
                 supports-[backdrop-filter]:bg-white/80
                 dark:bg-slate-900/95 dark:text-white
                 dark:supports-[backdrop-filter]:bg-slate-900/80"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full"
              priority
            />
          </Link>

          <nav className="hidden md:flex space-x-8 font-medium mx-5">
            <Link
              href="/service"
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              Service
            </Link>
            <a
              href="https://endora-docs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              Document
            </a>
            <Link
              href="/about"
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <AnimatedThemeToggler className="hover:cursor-pointer" />
          <Button
            onClick={() => signIn("keycloak", { callbackUrl: "/dashboard" })}
            aria-label="Sign in"
            className="bg-primary-500 px-4 py-2 rounded-lg font-semibold text-white hover:bg-primary-600 transition focus:outline-none"
          >
            Sign Up
          </Button>
          <InstallPWA />
        </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
        >
          ☰
        </Button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden px-6 py-4 space-y-4
                     bg-gray-50 text-gray-900
                     dark:bg-[#0a0814] dark:text-white"
        >
          <Link
            href="/about"
            className="block hover:text-primary-600 dark:hover:text-primary-400"
          >
            About
          </Link>
          <a
            href="https://endora-docs.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Document
          </a>
          <Link
            href="/service"
            className="block hover:text-primary-600 dark:hover:text-primary-400"
          >
            Service
          </Link>
          <Link
            href="/signup"
            className="block bg-primary-600 px-4 py-2 rounded-lg text-center font-semibold text-white hover:bg-primary-500"
          >
            Sign Up
          </Link>
          <Link
            href="/download"
            className="block border border-primary-400 px-4 py-2 rounded-lg text-center font-semibold hover:bg-primary-600 hover:text-white"
          >
            Get App
          </Link>
        </div>
      )}
    </header>
  );
}
