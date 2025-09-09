"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ContactForm() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
      mirror: true,
      easing: "ease-out",
      offset: 50,
    });
  }, []);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  console.log("Form submitted");
};


  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-8 grid-cols-4 gap-8">
        {/* Left side: Contact info */}
        <div
          data-aos="fade-right"
          data-aos-delay="120"
          data-aos-offset="50"
          className="md:col-span-4 col-span-8 flex flex-col gap-6 justify-center"
        >
          <h1 className="text-[var(--color-primary)] md:text-4xl text-3xl font-semibold mb-2">
            Lets talk with us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 md:text-lg">
            Questions, comments, or suggestions? Simply fill in the form and we
            will be in touch shortly.
          </p>

          {/* Contact Info */}
          <ul className="flex flex-col gap-3 text-[var(--color-primary)] font-semibold">
            <li className="flex items-center gap-2 group">
              <MapPin className="transition-all duration-300 group-hover:text-teal-500 group-hover:animate-pulse" />
              ISTAD, Phnom Penh, Cambodia
            </li>
            <li className="flex items-center gap-2 group">
              <Phone className="transition-all duration-300 group-hover:text-teal-500 group-hover:animate-bounce" />
              <a
                href="tel:+85597531357"
                className="hover:text-teal-500 transition-colors"
              >
                +855 97 531 3579
              </a>
            </li>
            <li className="flex items-center gap-2 group">
              <Mail className="transition-all duration-300 group-hover:text-teal-500 group-hover:animate-pulse" />
              <a
                href="mailto:endora@gmail.com"
                className="hover:text-teal-500 transition-colors"
              >
                endora@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Right side: Form */}
        <div className="md:col-span-4 col-span-8 md:justify-self-end">
          <div
            data-aos="fade-left"
            data-aos-delay="120"
            data-aos-offset="50"
            className="border border-gray-400 dark:border-gray-600 md:p-8 p-4 grid grid-cols-4 gap-4 rounded-2xl bg-gray-100 dark:bg-gray-900"
          >
            <input
              type="text"
              placeholder="First name"
              required
              className="col-span-2 border border-gray-400 dark:border-gray-600 p-3 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <input
              type="text"
              placeholder="Last name"
              required
              className="col-span-2 border border-gray-400 dark:border-gray-600 p-3 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <input
              type="email"
              placeholder="Email address"
              required
              className="col-span-4 border border-gray-400 dark:border-gray-600 p-3 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <input
              type="tel"
              placeholder="Phone number"
              required
              className="col-span-4 border border-gray-400 dark:border-gray-600 p-3 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <textarea
              placeholder="Tell us about your project, needs, or questions..."
              required
              className="col-span-4 border border-gray-400 dark:border-gray-600 p-3 rounded-md md:min-h-[150px] h-[100px] text-gray-400 dark:text-gray-200 bg-white dark:bg-gray-800 focus:border-teal-500 focus:outline-none transition-colors resize-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="col-span-4 bg-[var(--color-primary)] text-white py-3 rounded-md font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
