"use client";
import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

interface Testimonial {
  id: number;
  rating: number;
  date: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export default function TestimonialSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 2 },
        "(min-width: 1024px)": { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // Optional: Add any event listeners here
    }
  }, [emblaApi]);
  const testimonials: Testimonial[] = [
    {
      id: 1,
      rating: 5,
      date: "2024-11-28",
      content:
        "This platform completely transformed how our team builds APIs. Before discovering this tool, we were stuck in endless cycles of manual documentation, schema inconsistencies, and deployment headaches. ",
      author: {
        name: "Kea Darom",
        role: "Flutter Developer",
        avatar: "/images/kea-daron.png",
      },
    },
    {
      id: 2,
      rating: 4,
      date: "2024-12-05",
      content:
        "The database schema visualization is incredibly intuitive. I can model complex relationships with just a few clicks, and the real-time preview helps catch design issues early. Perfect for rapid prototyping. Perfect for rapid prototyping.",
      author: {
        name: "Heng Liza",
        role: "DevOps Engineer",
        avatar: "/images/heng-liza.png",
      },
    },
    {
      id: 3,
      rating: 5,
      date: "2024-11-15",
      content:
        "The automated API generation is a game-changer. From schema to fully functional endpoints in minutes, not days. The generated code is clean and follows best practices. Our deployment cycle went from weeks to hours.",
      author: {
        name: "Lim Ansoleaphea",
        role: "Blockchain Developer",
        avatar: "/images/lim-ansoleaphea.png",
      },
    },
    {
      id: 4,
      rating: 5,
      date: "2024-12-10",
      content:
        "The design-first workflow keeps my team aligned from day one. We can share interactive prototypes with stakeholders and gather feedback before writing any code. It's eliminated so many revision cycles.",
      author: {
        name: "Korm TaingAn",
        role: "Data Analyst",
        avatar: "/images/korm-taingan.png",
      },
    },
    {
      id: 5,
      rating: 4,
      date: "2024-12-02",
      content:
        "Finally, an API platform that actually understands developer workflow. The authentication handling and error management are built-in, so I can focus on business logic instead of boilerplate code. business logic instead of boilerplate code.",
      author: {
        name: "Korm Taiyi",
        role: "AI Engineer",
        avatar: "/images/korm-taiyi.png",
      },
    },
    {
      id: 6,
      rating: 5,
      date: "2024-12-08",
      content:
        "Bro, this platform is insane. I just dropped my schema and—boom—instant API. No backend, no crying, no begging ChatGPT to fix my spaghetti code 🍝🤖. As a frontend dev, I basically went from copy-pasting mock data to feeling like a fullstack sorcerer 🧙‍♂️✨. Backend engineers are sweating rn 😂.",
      author: {
        name: "Rin Sanom",
        role: "Vibe Coder",
        avatar: "/images/rin-sanom.png",
      },
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="pt-16 pb-16 bg-white dark:bg-slate-800/80 overflow-hidden border-b border-gray-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
              200K+
            </h2>
            <p className="text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-6">
              Reviews from Users
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-8">
              Discover what developers around the world are saying about our API
              platform
            </p>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20"
              onClick={scrollPrev}
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20"
              onClick={scrollNext}
            >
              <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="embla mb-16" ref={emblaRef}>
          <div className="embla__container flex">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="embla__slide flex-[0_0_100%] min-w-0 px-3 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group h-full flex flex-col relative overflow-hidden">
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Rating and Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {testimonial.date}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 flex-grow">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-700 dark:to-secondary-700 flex-shrink-0 p-[2px] group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <Image
                            src={testimonial.author.avatar}
                            alt={testimonial.author.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                          {testimonial.author.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.author.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-2xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-medium mb-6">
            Join 100+ developers already building with our platform
          </p>
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2">
            Get Started Now
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* CSS for Embla */}
      <style jsx global>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          transform: translate3d(0, 0, 0);
        }
      `}</style>
    </section>
  );
}
