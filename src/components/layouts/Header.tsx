// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <header className="w-full bg-[#060317] text-white shadow-md">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1">
//         <div className="flex items-center justify-content-between ">
//           <Link href="/" className="flex items-center space-x-2">
//             <Image
//               src="/EndoraTransparent.png"
//               alt="Logo"
//               width={58}
//               height={58}
//               className="rounded-full"
//             />
//           </Link>

//           <nav className="hidden md:flex space-x-8 font-medium mx-5">
//             <Link href="#about" className="hover:text-indigo-400">
//               About
//             </Link>
//             <Link href="#document" className="hover:text-indigo-400">
//               Document
//             </Link>
//             <Link href="#service" className="hover:text-indigo-400">
//               Service
//             </Link>
//             <Link href="#contact" className="hover:text-indigo-400">
//               Contact
//             </Link>
//           </nav>
//         </div>

//         <div className="hidden md:flex space-x-4">
//           <Link
//             href="/auth/signin"
//             className="bg-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition"
//           >
//             Sign In
//           </Link>
          
//           <Link
//             href="/download"
//             className="border border-indigo-400 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
//           >
//             Get App
//           </Link>
//         </div>

//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="md:hidden text-gray-300 focus:outline-none"
//         >
//           ☰
//         </button>
//       </div>

//       {isOpen && (
//         <div className="md:hidden bg-[#0a0814] px-6 py-4 space-y-4">
//           <Link href="#about" className="block hover:text-indigo-400">
//             About
//           </Link>
//           <Link href="#document" className="block hover:text-indigo-400">
//             Document
//           </Link>
//           <Link href="#service" className="block hover:text-indigo-400">
//             Service
//           </Link>
//           <Link href="#contact" className="block hover:text-indigo-400">
//             Contact
//           </Link>
//           <Link
//             href="/auth/signin"
//             className="block border border-indigo-400 px-4 py-2 rounded-lg text-center font-semibold hover:bg-indigo-600"
//           >
//             Sign In
//           </Link>
//           <Link
//             href="/auth/signup"
//             className="block bg-indigo-600 px-4 py-2 rounded-lg text-center font-semibold hover:bg-indigo-500"
//           >
//             Sign Up
//           </Link>
//           <Link
//             href="/download"
//             className="block border border-indigo-400 px-4 py-2 rounded-lg text-center font-semibold hover:bg-indigo-600"
//           >
//             Get App
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }


"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "../button/Button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full
                 bg-white/90 text-gray-900 shadow-md backdrop-blur
                 supports-[backdrop-filter]:bg-white/80
                 dark:bg-[#060317]/95 dark:text-white
                 dark:supports-[backdrop-filter]:bg-[#060317]/80"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-1">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 m-2">
            <Image
              src="/Logo-v3.png"
              alt="Logo"
              width={58}
              height={58}
              className="rounded-full"
              priority
            />
          </Link>

          <nav className="hidden md:flex space-x-8 font-medium mx-5">
            <Link href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400">About</Link>
            <Link href="#document" className="hover:text-indigo-600 dark:hover:text-indigo-400">Document</Link>
            <Link href="#service" className="hover:text-indigo-600 dark:hover:text-indigo-400">Service</Link>
            <Link href="#contact" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link>
          </nav>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link
            href="/auth/signin"
            className="bg-indigo-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-indigo-500 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/download"
            className="border border-indigo-400 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition"
          >
            Get App
          </Link>
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
          <Link href="#about" className="block hover:text-indigo-600 dark:hover:text-indigo-400">About</Link>
          <Link href="#document" className="block hover:text-indigo-600 dark:hover:text-indigo-400">Document</Link>
          <Link href="#service" className="block hover:text-indigo-600 dark:hover:text-indigo-400">Service</Link>
          <Link href="#contact" className="block hover:text-indigo-600 dark:hover:text-indigo-400">Contact</Link>
          <Link
            href="/signup"
            className="block bg-indigo-600 px-4 py-2 rounded-lg text-center font-semibold text-white hover:bg-indigo-500"
          >
            Sign Up
          </Link>
          <Link
            href="/download"
            className="block border border-indigo-400 px-4 py-2 rounded-lg text-center font-semibold hover:bg-indigo-600 hover:text-white"
          >
            Get App
          </Link>
        </div>
      )}
    </header>
  );
}