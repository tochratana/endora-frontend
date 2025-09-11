"use client";


import Image from "next/image";
import { teamMembers } from "./TeamData";
import SocialLinks from "./SocialLinks";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function OurTeam() {
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
    <section className="w-full pt-32">
      <div className="max-w-6xl m-auto text-center">
        <div className="mb-10">
          <h1
          data-aos="zoom-in"
          data-aos-delay="120"
          data-aos-offset="50"
          className="text-[var(--color-primary)] text-center md:text-5xl text-4xl font-semibold mb-6">
            Our team members
          </h1>
          <p
          data-aos="zoom-in"
          data-aos-delay="120"
          data-aos-offset="50"
          className="text-gray-600 dark:text-gray-300 text-center mb-12 md:text-xl text-lg max-w-3xl mx-auto">
            A passionate group of innovators, builders, and dreamers working
            together to make APIs effortless.
          </p>
        </div>
        <div 
        //  data-aos="zoom-out-up"
        //   data-aos-delay="120"
        //   data-aos-offset="50"
        className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-2 w-full gap-y-9 gap-1">
          {teamMembers
            .filter(
              (tm) =>
                tm.position === "Team Leader" || tm.position === "Team member"
            )
            .map((tm) => (
              <div
                key={tm.id}
                className="col-span-2 flex flex-col items-center h-full bg-no-repeat bg-top bg-contain"
                style={{ backgroundImage: `url(${tm.background})` }}>
                <div className="relative w-full h-full">
                  <Image
                    src={tm.image}
                    alt={tm.name}
                    width={0}
                    height={0}
                    unoptimized
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <h1 className="font-semibold md:text-lg text-[var(--color-primary)]">{tm.name}</h1>
                  <p className="text-[var(--color-secondary)]">{tm.position}</p>
                  <SocialLinks
                    portfolio={tm.socials.portfolio}
                    github={tm.socials.github}
                    linkedin={tm.socials.linkedin}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}