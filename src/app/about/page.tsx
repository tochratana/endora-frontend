import ContactForm from "@/components/about/ContactForm";
import HeroSection from "@/components/about/HeroSection";
import OurHistory from "@/components/about/OurHistory";
import OurMentor from "@/components/about/OurMentor";
import OurMission from "@/components/about/OurMission";
import OurTeam from "@/components/about/OurTeam";
import WhyUs from "@/components/about/WhyUs";

export default function page() {
  return (
    <section>
      <HeroSection />
      <OurHistory />
      <OurMission />
      <OurMentor />
      <OurTeam />
      <WhyUs />
      {/* <ContactForm/> */}
      <ContactForm/>
    </section>
  );
}
