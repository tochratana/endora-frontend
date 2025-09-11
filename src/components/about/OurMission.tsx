"use client";

import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function OurMission() {
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
    <section>
      <div className="mx-auto max-w-6xl grid grid-cols-4 md:grid-cols-8 items-center gap-6 min-h-[200px]">
        {/* Image: 3/8 on md, 4/8 on lg+ with max-width constraint */}
        <div className="col-span-4 md:col-span-3 lg:col-span-4 md:mt-0 mt-5 px-5 flex justify-center md:order-1 order-2">
          <div
            data-aos="fade-right"
            data-aos-delay="120"
            data-aos-offset="50"
            className="w-full max-w-sm md:max-w-xs lg:max-w-lg"
          >
            <Image
              src="/mission-impossible-animate.svg"
              alt="mission image"
              width={200}
              height={200}
              className="w-full h-auto object-contain rounded"
              sizes="(min-width: 1024px) 500px, (min-width: 768px) 300px, 100vw"
            />
          </div>
        </div>

        {/* Text: 5/8 on md, 4/8 on lg+ */}
        <div
          data-aos="fade-left"
          data-aos-delay="120"
          data-aos-offset="50"
          className="col-span-4 md:col-span-5 lg:col-span-4 px-4 md:order-2 order-1"
        >
          <h1 className="md:text-5xl text-4xl text-(--color-secondary) font-semibold mb-5">
            Our Mission
          </h1>
          <ul className=" marker:text-(--color-secondary)">
            <li>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                <span className="text-(--color-secondary) text-lg font-semibold">
                  Our mission
                </span>{" "}
                is to empower developers, students, and teams to build reliable
                APIs faster and easier than ever before. We believe creating an
                API should not be limited by technical barriers or
                time-consuming backend setup.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
