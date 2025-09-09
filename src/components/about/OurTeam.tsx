import Image from "next/image";
import { teamMembers } from "./TeamData";
import SocialLinks from "./SocialLinks";

export default function OurTeam() {
  return (
    <section className="w-full py-10">
      <div className="max-w-6xl m-auto text-center">
        <div className="mb-10">
          <h1 className="font-semibold md:text-5xl text-4xl mb-5 text-[var(--color-primary)]">
            Our team members
          </h1>
          <p className="text-gray-800 dark:text-white md:text-xl text-lg px-1">
            A passionate group of innovators, builders, and dreamers working
            together to make APIs effortless.
          </p>
        </div>
        <div className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-2 w-full gap-y-9 gap-1">
          {teamMembers
            .filter(
              (tm) =>
                tm.position === "Team Leader" || tm.position === "Team member"
            )
            .map((tm) => (
              <div
                key={tm.id}
                className="col-span-2 flex flex-col items-center h-full bg-no-repeat bg-top bg-contain"
                style={{ backgroundImage: `url(${tm.background})` }}>
                <div className="relative w-full h-full">
                  <Image
                    src={tm.image}
                    alt={tm.name}
                    width={0}
                    height={0}
                    unoptimized
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col mt-4 text-gray-800 dark:text-white">
                  <h1 className="font-semibold md:text-lg">{tm.name}</h1>
                  <p className="text-gray-600 dark:text-white">{tm.position}</p>
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
