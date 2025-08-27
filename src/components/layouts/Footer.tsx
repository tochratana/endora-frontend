"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

export default function Footer() {
  return (
    <footer
      className="bg-gray-50 text-gray-900 py-12
                 dark:bg-[#060317] dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top: Logo + Columns + Org */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 items-start">
          {/* Left: Brand + Socials */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Image
              src="/EndoraTransparent.png"
              alt="Endora Logo"
              width={110}
              height={110}
              className="rounded-full"
              priority
            />
            <div className="flex items-center gap-4 text-xl opacity-90">
              <Link
                href="https://twitter.com"
                target="_blank"
                aria-label="X / Twitter"
              >
                <FaXTwitter className="hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                aria-label="YouTube"
              >
                <FaYoutube className="hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Middle: 4 columns */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-bold mb-4">Feature</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">Instant RESTful API</Link>
                </li>
                <li>
                  <Link href="#">Data Import</Link>
                </li>
                <li>
                  <Link href="#">Testing Interface (Swagger)</Link>
                </li>
                <li>
                  <Link href="#">Data Panel</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Project</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">Workspace</Link>
                </li>
                <li>
                  <Link href="#">Dashboard</Link>
                </li>
                <li>
                  <Link href="#">Schemas</Link>
                </li>
                <li>
                  <Link href="#">Public API</Link>
                </li>
                <li>
                  <Link href="#">Data Source</Link>
                </li>
                <li>
                  <Link href="#">API Docs</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">Homepage</Link>
                </li>
                <li>
                  <Link href="#">Service</Link>
                </li>
                <li>
                  <Link href="#">About</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
                <li>
                  <Link href="#">Documentation</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Solution</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">For Developer</Link>
                </li>
                <li>
                  <Link href="#">For Startups</Link>
                </li>
                <li>
                  <Link href="#">Beginners</Link>
                </li>
                <li>
                  <Link href="#">For Enterprises</Link>
                </li>
                <li>
                  <Link href="#">No Code Users</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Organization */}
          <div className="text-center md:text-right">
            <h3 className="font-bold mb-4">Our Organization</h3>
            <div className="flex md:justify-end justify-center">
              {/* <Image
                src="/istadlogo-v2.png"
                alt="iSTAD Logo"
                width={150}
                height={150}
              /> */}
              <Link
                href="https://www.cstad.edu.kh/"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/istadlogo-v2.png"
                  alt="iSTAD Logo"
                  width={150}
                  height={150}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 dark:border-gray-700/70 mt-10" />

        {/* Bottom bar */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm opacity-90">© Endora istad</p>

          {/* Theme toggle (animated) */}
          <AnimatedThemeToggler />
        </div>
      </div>
    </footer>
  );
}
