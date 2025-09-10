import ContactForm from "@/components/about/ContactForm";
import HeroSection from "@/components/about/HeroSection";
import OurHistory from "@/components/about/OurHistory";
import OurMentor from "@/components/about/OurMentor";
import OurMission from "@/components/about/OurMission";
import OurTeam from "@/components/about/OurTeam";
import WhyUs from "@/components/about/WhyUs";

export default function page() {
  return (
    <main className="w-full  overflow-x-hidden">
      <HeroSection />
      <div className="w-full dark:bg-slate-900 overflow-x-hidden">
        <OurHistory />
        <OurMission />
        <OurMentor />
        <OurTeam />
        <WhyUs />
        <ContactForm />
      </div>
    </main>
  );
}
