import HeroSection from "@/components/about/HeroSection";
import ContactForm from "@/components/contact/ContactForm";
import StartProject from "@/components/contact/StartProject";

export default function page() {
  return (
    <section>
      <HeroSection />
      <ContactForm />
      <StartProject />
    </section>
  );
}
