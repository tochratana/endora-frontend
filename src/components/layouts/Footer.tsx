"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer
      className="bg-gray-50 text-gray-600 py-12
                 dark:bg-slate-900 dark:text-gray-400"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Top: Logo + Columns + Org */}
        <div className="grid grid-cols-1 md:grid-cols-6 items-start">
          {/* Left: Brand + Socials */}
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/logo-v4.png"
              alt="Endora Logo"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
            <div className="flex items-center gap-4 text-xl opacity-90">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
              >
                <FaXTwitter className="hover:opacity-100 transition-opacity text-indigo-500" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:opacity-100 transition-opacity text-indigo-500" />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube className="hover:opacity-100 transition-opacity text-indigo-500" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="hover:opacity-100 transition-opacity text-indigo-500" />
              </Link>
            </div>
          </div>

          {/* Middle: 4 columns */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div>
              <h3 className="font-bold mb-4 text-xl text-indigo-500">Feature</h3>
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
              <h3 className="font-bold mb-4 text-xl text-indigo-500">Project</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">Workspace</Link>
                </li>
                <li>
                  <Link href="#">Schemas</Link>
                </li>
                <li>
                  <Link href="#">Public API</Link>
                </li>
                <li>
                  <Link href="#">API Docs</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-xl text-indigo-500">Resources</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">Service</Link>
                </li>
                <li>
                  <Link href="#">About</Link>
                </li>
                <li>
                  <Link href="#">Documentation</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-xl text-indigo-500">Solution</h3>
              <ul className="space-y-2 opacity-90">
                <li>
                  <Link href="#">For Developer</Link>
                </li>
                <li>
                  <Link href="#">No Code Users</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Organization */}
          <div className="text-start">
            <h3 className="font-bold mb-4 text-xl text-indigo-500">
              Organized and sponsor by
            </h3>
            <div className="flex justify-start">
              <Link
                href="https://www.cstad.edu.kh/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Image
                  src="/istad-logo.png"
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="mb-4 sm:mb-0">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} Endora. Built with ❤️ by{" "}
              <Link
                href="https://www.cstad.edu.kh/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                ISTAD{" "}
              </Link>
              Students.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="hover:text-primary-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary-500 transition-colors"
            >
              Terms of Service
            </Link>
            <a
              href="https://www.cstad.edu.kh/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors"
            >
              ISTAD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
