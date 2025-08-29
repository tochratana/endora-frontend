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
        <div className="grid md:grid-cols-8 grid-cols-4 gap-1">
          {teamMembers
            .filter((tm) => tm.position === "Mentor")
            .map((tm) => (
              <div
                className="col-span-2 flex flex-col items-center h-full text-center bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${tm.background})` }}
                key={tm.id}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={tm.image}
                    alt={tm.name}
                    width={200}
                    height={0}
                    className="object-contain h-auto"
                  />
                </div>
                <div className="flex flex-col mt-4 text-black">
                  <h1 className="font-semibold">{tm.name}</h1>
                  <p className="">{tm.position}</p>
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
