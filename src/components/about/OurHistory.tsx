"use client";

import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function OurHistory() {
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
    <section className="w-full py-10">
      <div className="mx-auto max-w-6xl grid grid-cols-4 md:grid-cols-8 items-center gap-6 min-h-[400px]">
        {/* Text: 5/8 on md, 4/8 on lg+ */}
        <div
          data-aos="fade-right"
          data-aos-delay="120"
          data-aos-offset="50"
          className="col-span-4 md:col-span-5 lg:col-span-4 px-4"
        >
          <h1 className="md:text-5xl text-4xl text-(--color-secondary) font-semibold mb-5">
            Our History
          </h1>
          <p className="text-gray-600 dark:text-white text-lg">
            Teams spend weeks wiring backends—CRUD, databases, and auth—before
            they can ship features. We set out to remove that friction.
          </p>
          <br />
          <p className="text-gray-600 dark:text-white text-lg">
            What began as a simple tool to generate APIs from a schema has grown
            into a full platform with a visual schema builder, data
            import/export, authentication, and Swagger-based testing.
          </p>
        </div>

        {/* Image: 3/8 on md, 4/8 on lg+ with max-width constraint */}
        <div className="col-span-4 md:col-span-3 lg:col-span-4 md:mt-0 mt-5 px-5 flex justify-center">
          <div
            className="w-full max-w-sm md:max-w-xs lg:max-w-lg"
            data-aos="fade-left"
            data-aos-delay="120"
            data-aos-offset="50"
          >
            <Image
              src="/group.png"
              alt="history image"
              width={700}
              height={520}
              className="w-full h-auto object-contain rounded"
              sizes="(min-width: 1024px) 500px, (min-width: 768px) 300px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
