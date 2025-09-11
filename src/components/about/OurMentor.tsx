"use client";

import Image from "next/image";
import SocialLinks from "./SocialLinks";
import { teamMembers } from "./TeamData";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
export default function OurMentor() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: false,
      mirror: true,
      easing: "ease-out",
      offset: 50,
    });
  }, []);
  return (
    <section className="w-full pt-12 px-2">
      <div className="max-w-6xl m-auto">
        <h1
          data-aos="zoom-in"
          data-aos-delay="120"
          data-aos-offset="50"
          className="text-[var(--color-primary)] text-center md:text-5xl text-4xl font-semibold mb-6"
        >
          Our Mentor
        </h1>
        <p
          data-aos="zoom-in"
          data-aos-delay="120"
          data-aos-offset="50"
          className="text-gray-600 dark:text-gray-300 text-center mb-12 md:text-xl text-lg max-w-3xl mx-auto"
        >
          Behind every great achievement is great guidance — ours comes from an
          exceptional mentor.
        </p>
        <div className="flex md:flex-row flex-col gap-8 text-center">
          {teamMembers
            .filter(tm => tm.position === "Mentor")
            .map((tm, index) => (
              <div
                key={tm.id}
                className={`flex md:flex-row flex-col md:text-left items-center md:gap-0 gap-2 max-w-4xl mx-auto ${index % 2 === 1 ? "md:flex-row-reverse flex-col md:text-right" : ""}`}
              >
                <div
                  data-aos="zoom-in"
                  data-aos-delay="120"
                  data-aos-offset="50"
                  className="flex-shrink-0"
                >
                  <Image
                    src={tm.image}
                    alt={tm.name}
                    width={350}
                    height={350}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-[var(--color-primary)] md:text-2xl text-xl font-semibold mb-2">
                    {tm.name}
                  </h2>
                  <p className="text-[var(--color-secondary)] text-lg font-medium mb-4">
                    {tm.position}
                  </p>
                  <div
                    className={`md:flex justify-${index % 2 === 1 ? "end" : "start"}`}
                  >
                    <SocialLinks
                      portfolio={tm.socials.portfolio}
                      github={tm.socials.github}
                      linkedin={tm.socials.linkedin}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
