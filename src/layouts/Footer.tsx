// components/Footer.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#060317] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Logo + Socials */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo */}
            <div className="flex flex-col items-center md:items-start space-y-4">
                <Image
                    src="/EndoraTransparent.png"
                    alt="Logo"
                    width={130}
                    height={130}
                    className="rounded-full"
                />
                {/* Socials */}
                <div className="flex space-x-4 text-2xl">
                <Link href="https://twitter.com" target="_blank"><FaXTwitter /></Link>
                <Link href="https://instagram.com" target="_blank"><FaInstagram /></Link>
                <Link href="https://youtube.com" target="_blank"><FaYoutube /></Link>
                <Link href="https://linkedin.com" target="_blank"><FaLinkedin /></Link>
                </div>
            </div>

          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            {/* Feature */}
            <div>
              <h3 className="font-bold mb-4">Feature</h3>
              <ul className="space-y-2">
                <li><Link href="#">Instant RESTful API</Link></li>
                <li><Link href="#">Data Import</Link></li>
                <li><Link href="#">Testing Interface (Swagger)</Link></li>
                <li><Link href="#">Data Panel</Link></li>
              </ul>
            </div>

            {/* Project */}
            <div>
              <h3 className="font-bold mb-4">Project</h3>
              <ul className="space-y-2">
                <li><Link href="#">Workspace</Link></li>
                <li><Link href="#">Dashboard</Link></li>
                <li><Link href="#">Schemas</Link></li>
                <li><Link href="#">Public API</Link></li>
                <li><Link href="#">Data Source</Link></li>
                <li><Link href="#">API Docs</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#">Homepage</Link></li>
                <li><Link href="#">Service</Link></li>
                <li><Link href="#">About</Link></li>
                <li><Link href="#">Contact</Link></li>
                <li><Link href="#">Documentation</Link></li>
              </ul>
            </div>

            {/* Solution */}
            <div>
              <h3 className="font-bold mb-4">Solution</h3>
              <ul className="space-y-2">
                <li><Link href="#">For Developer</Link></li>
                <li><Link href="#">For Startups</Link></li>
                <li><Link href="#">Beginners</Link></li>
                <li><Link href="#">For Enterprises</Link></li>
                <li><Link href="#">No Code Users</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle: Organization */}
        <div className="text-center mt-12">
          <h3 className="font-bold mb-4">Our Organization</h3>
          <div className="flex justify-center">
            <Image
              src="/istadlogo-v2.png"
              alt="iSTAD Logo"
              width={240}
              height={240}
            />
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">© Endora istad</p>
          <Link href="https://t.me/yourlink" target="_blank" className="text-2xl mt-4 md:mt-0">
            <FaYoutube />
          </Link>
        </div>
      </div>
    </footer>
  );
}
