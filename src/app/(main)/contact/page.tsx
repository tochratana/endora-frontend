import ContactForm from "@/components/contact/ContactForm";
import HeroSection from "@/components/contact/HeroSection";
import StartProject from "@/components/contact/StartProject";

export default function page() {
  return (
    <section>
      <HeroSection/>
      <ContactForm/>
      <StartProject/>
    </section>
  )
}