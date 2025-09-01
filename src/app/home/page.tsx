"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "../../components/home/HeroSection";

const FeaturesSection = dynamic(
  () => import("../../components/home/FeaturesSection"),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const OurServices = dynamic(() => import("../../components/home/OurServices"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const FrameworkSection = dynamic(
  () => import("../../components/home/FramworkSpp"),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const APIDesign = dynamic(() => import("../../components/home/APIDesign"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

export default function HomePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <FeaturesSection />
        <OurServices />
        <FrameworkSection />
        <APIDesign />
      </Suspense>
    </div>
  );
}
