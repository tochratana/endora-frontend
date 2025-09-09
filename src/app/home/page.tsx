// import HeroSection from "@/components/about/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import OurServices from "@/components/home/OurServices";
import FrameworkSection from "@/components/home/FramworkSpp";
import TestimonialSection from "@/components/home/TestimonialSection";
import React from "react";
import HeroSection from "@/components/home/HeroSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <OurServices />
      <FrameworkSection />
      <TestimonialSection />
    </main>
  );
}
