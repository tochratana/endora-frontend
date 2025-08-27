import Image from "next/image";

export default function OurTeam() {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Heng Liza",
      position: "Team Leader",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 2,
      name: "Lim Ansoleaphea",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 3,
      name: "Phoem Oudom",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 4,
      name: "Rin Sanom",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 5,
      name: "Toch Ratana",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 6,
      name: "Korm Taingan",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 7,
      name: "Kea Daron",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image: "",
    },
    {
      id: 8,
      name: "Korm Taiyi",
      position: "Team member",
      socials: {
        telegram: "",
        github: "",
        linkedin: "",
      },
      image:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQV_sEfRdcfwfKOjMoTjnR-dyaVbJk6fhw3lEtcLXbaPVGCnd4JcRvq0okB88v4ScJa90Y4P0T2sCdjrMmclQYFqIZOl8fcG0Rfep5Zj07f",
    },
  ];
  return (
    <section className="w-full py-10 text-center">
      <div className="font-semibold text-[var(--color-primary)] mb-5">
        <h1 className="md:text-5xl text-4xl mb-5">Our team members</h1>
        <p className="text-black dark:text-white">
          A passionate group of innovators, builders, and dreamers working
          together to make APIs effortless.
        </p>
      </div>
      <div className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-2 w-full md:gap-4 gap-2 md:px-4 px-2 justify-between">
        {teamMembers.map(tm => (
          <div key={tm.id} className="col-span-2 py-2">
            <Image
              src={tm.image || "/placeholder.png"}
              unoptimized
              alt={tm.name}
              width={0}
              height={0}
              className="w-full object-contain h-auto"
            />
            <div className="flex flex-col mt-4">
              <h1 className="font-semibold">{tm.name}</h1>
              <p className="">{tm.position}</p>
              <div className="flex gap-1">{/* icon */}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
