"use client";
import React from "react";
import {
  ServiceHeroSection,
  ServiceFeaturesSection,
  CloudStorageSection,
  APIBuildSection,
} from "@/components/service";

export default function ServicePage() {
  return (
    <div className="min-h-screen">
      <ServiceHeroSection />
      <ServiceFeaturesSection />
      <CloudStorageSection />
      <APIBuildSection />
    </div>
  );
}
