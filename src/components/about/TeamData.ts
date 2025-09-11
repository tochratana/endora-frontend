export type SocialLinks = {
  github?: string;
  linkedin?: string;
  portfolio?: string;
};

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  image: string;
  background?: string;
  socials: SocialLinks;
};

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Kay Keo",
    position: "Mentor",
    socials: {
      github: "https://github.com/kaykeo",
      linkedin: "https://www.linkedin.com/in/kaykeo",
      portfolio: "https://kaykeo.dev",
    },
    image: "/images/teacher-keo.png",
  },
  {
    id: 2,
    name: "Srorng Sokcheat",
    position: "Mentor",
    socials: {
      github: "https://github.com/srongsokcheat",
      linkedin: "https://www.linkedin.com/in/srongsokcheat",
      portfolio: "https://sokcheat.dev",
    },
    image: "/images/teacher-cheat.png",
  },
  {
    id: 3,
    name: "Heng Liza",
    position: "Team Leader",
    socials: {
      github: "https://github.com/Icesuza",
      linkedin: "https://www.linkedin.com/in/heng-liza-071531383/",
      portfolio: "https://hengliza.dev",
    },
    background: "/team-background/blob9.svg",
    image: "/images/heng-liza.png",
  },
  {
    id: 4,
    name: "Lim Ansoleaphea",
    position: "Team member",
    socials: {
      github: "https://github.com/Leaphea-Lim",
      linkedin: "https://www.linkedin.com/in/limansoleaphea",
      portfolio: "#",
    },
    background: "/team-background/blob2.svg",
    image: "/images/lim-ansoleaphea.png",
  },
  {
    id: 5,
    name: "Rin Sanom",
    position: "Team member",
    socials: {
      github: "https://github.com/RinSanom",
      linkedin: "https://www.linkedin.com/in/rinsanom",
      portfolio: "https://rin-sanom.vercel.app/",
    },
    background: "/team-background/blob5.svg",
    image: "/images/rin-sanom.png",
  },
  {
    id: 6,
    name: "Toch Ratana",
    position: "Team member",
    socials: {
      github: "https://github.com/tochratana",
      linkedin: "https://www.linkedin.com/in/ratana-touch",
      portfolio: "#",
    },
    background: "/team-background/blob9.svg",
    image: "/images/toch-ratana.png",
  },
  {
    id: 7,
    name: "Phoem Oudom",
    position: "Team member",
    socials: {
      github: "https://github.com/oudomm",
      linkedin: "https://www.linkedin.com/in/oudomm",
      portfolio: "https://www.oudom.dev",
    },
    background: "/team-background/blob4.svg",
    image: "/images/phoem-oudom.png",
  },
  {
    id: 8,
    name: "Korm TaingAn",
    position: "Team member",
    socials: {
      github: "https://github.com/TaingAnKorm",
      linkedin: "https://www.linkedin.com/in/taing-an-005343325/",
      portfolio: "#",
    },
    // background: "/team-background/blob2.svg",
    // image: "/images/korm-taingan.png"
    background: "/team-background/blob6.svg",
    image: "/images/korm-taingan.png",
  },
  {
    id: 9,
    name: "Kea Daron",
    position: "Team member",
    socials: {
      github: "https://github.com/kea-daron",
      linkedin: "https://www.linkedin.com/in/kea-daron-315ba436b/",
      portfolio: "https://my-folio-pearl.vercel.app/",
    },
    background: "/team-background/blob9.svg",
    image: "/images/kea-daron.png",
  },
  {
    id: 10,
    name: "Korm Taiyi",
    position: "Team member",
    socials: {
      github: "https://github.com/KormTaiyi",
      linkedin: "https://www.linkedin.com/in/korm-taiyi-906407327/",
      portfolio: "#",
    },
    background: "/team-background/blob.svg",
    image: "/images/korm-taiyi.png",
  },
];
