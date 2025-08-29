import Image from "next/image";
import { teamMembers } from "./TeamData";
import SocialLinks from "./SocialLinks";

export default function OurTeam() {
  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-6xl m-auto text-center">
        <div className="font-semibold mb-10">
          <h1 className="md:text-5xl text-4xl mb-5 text-[var(--color-primary)]">
            Our team members
          </h1>
          <p className="text-black">
            A passionate group of innovators, builders, and dreamers working
            together to make APIs effortless.
          </p>
        </div>
        <div className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-2 w-full gap-1">
          {teamMembers
            .filter(
              (tm) =>
                tm.position === "Team Leader" || tm.position === "Team member"
            )
            .map((tm) => (
              <div
                key={tm.id}
                className="col-span-2 flex flex-col items-center h-full text-center bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${tm.background})` }}
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