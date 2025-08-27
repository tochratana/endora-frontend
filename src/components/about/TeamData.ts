export type SocialLinks = {
  github?: string;
  linkedin?:string;
  portfolio?:string;
};

export type TeamMember = {
  id: number;
  name: string;
  position: string;
  image: string;
  socials: SocialLinks
};

export const teamMembers:TeamMember[] =[
    {
      id: 1, 
      name: "Kay Keo",
      position: "Mentor",
      socials: {
        github: "",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/cherkeo.png"
    },
    {
      id: 2, 
      name: "Srong Sokcheat",
      position: "Mentor",
      socials: {
        github: "",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/chercheat.png"
    },
    {
      id: 3, 
      name: "Heng Liza",
      position: "Team Leader",
      socials: {
        github: "",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/liza.png"
    },
    {
      id: 4, 
      name: "Lim Ansoleaphea",
      position: "Team member",
      socials: {
        github: "",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/leaphea.png"
    },
    {
      id: 5, 
      name: "Rin Sanom",
      position: "Team member",
      socials: {
        github: "https://github.com/RinSanom",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/sanom.png"
    },
    {
      id: 6, 
      name: "Toch Ratana",
      position: "Team member",
      socials: {
        github: "",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/ratana.png"
    },
    {
      id: 7, 
      name: "Phoem Oudom",
      position: "Team member",
      socials: {
        github: "https://github.com/oudomm",
        linkedin: "https://www.linkedin.com/in/oudomm",
        portfolio: "https://www.oudom.dev"
      },
      image: "/images/oudom.png"
    },
    {
      id: 8, 
      name: "Korm Taingan",
      position: "Team member",
      socials: {
        github: "https://github.com/TaingAnKorm",
        linkedin: "https://www.linkedin.com/in/taing-an-005343325/",
        portfolio: ""
      },
      image: "/images/taingan.png"
    },
    {
      id: 9, 
      name: "Kea Daron",
      position: "Team member",
      socials: {
        github: "https://github.com/kea-daron",
        linkedin: "",
        portfolio: ""
      },
      image: "/images/daron.png"
    },
    {
      id: 10, 
      name: "Korm Taiyi",
      position: "Team member",
      socials: {
        github: "https://github.com/KormTaiyi",
        linkedin: "https://www.linkedin.com/in/korm-taiyi-906407327/",
        portfolio: "ssd"
      },
      image: "/images/taiyi.png"
    },
  ]