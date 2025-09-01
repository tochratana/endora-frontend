import Image from "next/image";
import SocialLinks from "./SocialLinks";
import { teamMembers } from "./TeamData";

export default function OurMentor() {
  return (
    <section className="w-full py-10 px-2 bg-white">
      <div className="max-w-6xl m-auto">
        <h1 className="text-(--color-primary) text-center md:text-5xl text-4xl font-semibold mb-4">
          Our Mentor
        </h1>
        <p className="text-black font-semibold text-center mb-15">
          Behind every great achievement is great guidance-ours comes from an
          exceptional mentor.
        </p>
        <div className="flex md:flex-row flex-col gap-8">
          {teamMembers
            .filter((tm) => tm.position === "Mentor")
            .map((tm, index) => (
              <div key={tm.id}className={`flex flex-row items-center md:gap-6 gap-2 max-w-4xl mx-auto ${index % 2 === 1 ? "flex-row-reverse text-right flex-" : ""}`}>
                <div className="flex-shrink-0">
                  <Image
                    src={tm.image}
                    alt={tm.name}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-[var(--color-primary)] md:text-2xl text-xl font-semibold mb-2">
                    {tm.name}
                  </h2>
                  <p className="text-[var(--color-secondary)] text-lg font-medium mb-4">
                    {tm.position}
                  </p>
                  <SocialLinks
                    portfolio={tm.socials.portfolio}
                    github={tm.socials.github}
                    linkedin={tm.socials.linkedin}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
