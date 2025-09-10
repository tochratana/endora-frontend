import Link from "next/link";
import { ShinyText } from "../ui/shiny-text";
import Button from "../ui/button";

export default function HeroSection() {
  return (
    <section className=" pt-[100px] pb-[20px] max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4 gap-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-purple-50/40 dark:from-teal-950/20 dark:via-purple-950/10 dark:to-teal-950/20"></div> */}
        <div className="absolute inset-0 dark:bg-slate-900"></div>

        {/* Floating Orbs - Enhanced for light mode */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-teal-400/40 to-purple-400/40 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-2/4 right-3/4 w-24 h-24 bg-gradient-to-r from-purple-400/40 to-teal-400/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-purple-400/35 to-teal-400/35 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Additional subtle orbs for more visibility */}
        <div className="absolute top-1/3 right-1/5 w-20 h-20 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute bottom-1/3 left-1/5 w-28 h-28 bg-gradient-to-r from-purple-400/35 to-teal-400/35 rounded-full blur-xl animate-pulse delay-300"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8 flex flex-col items-center">
        {/* Title with ShinyText */}
        <div className="w-full space-y-4 flex flex-col items-center">
          <ShinyText className="md:text-7xl text-6xl font-semibold text-[var(--color-secondary-500)] text-center">
            Welcome to Endora
          </ShinyText>

          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-12"></div>
            <span className="font-medium">Simplify Your Backend</span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-12"></div>
          </div>
        </div>

        {/* Description */}
        <div className="w-full flex justify-center">
          <p className="max-w-2xl md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            Endora is a lightweight Backend-as-a-Service (BaaS) platform that
            simplifies backend development by generating REST APIs from schemas
            or data sources.
          </p>
        </div>

        {/* CTA Section */}
        <Button
          // variant="secondaryTeal"
          className="flex justify-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center px-6 py-2 text-white text-[18px]  font-bold hover:opacity-90 transition-all duration-300   hover:scale-105 active:scale-95"
            // variants="secondary"
          >
            Start your project
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </Button>
      </div>

      {/* Bottom Fade */}
      {/* <div className="absolute bottom-[-70] left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none opacity-60"></div> */}
      {/* <div className=" absolute bottom-[-70] left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none opacity-30"></div> */}
    </section>
  );
}
