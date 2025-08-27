import React from "react";
import HeroSection from "../../components/home/HeroSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import OurServices from "../../components/home/OurServices";
import FrameworkSection from "../../components/home/FramworkSpp";
import APIDesign from "../../components/home/APIDesign";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <OurServices />
      <FrameworkSection />
      <APIDesign />
      {/* <BenefitsSection/> */}
    </div>
  );
}
