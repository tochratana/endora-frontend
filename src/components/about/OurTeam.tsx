import Image from "next/image"
import Link from "next/link"
import { teamMembers } from "./TeamData"
import { Github,Linkedin, Globe } from 'lucide-react';

export default function OurTeam() { 
  return (
    <section className="w-full py-10 bg-white">
     <div className="max-w-6xl m-auto text-center">
      <div className="font-semibold mb-10">
        <h1 className="md:text-5xl text-4xl mb-5 text-[var(--color-primary)]">Our team members</h1>
        <p className="text-black">A passionate group of innovators, builders, and dreamers working together to make APIs effortless.</p>
      </div>
      <div className="grid md:grid-cols-8 sm:grid-cols-4 grid-cols-2 w-full gap-1">
        {
          teamMembers
            .filter((tm)=> tm.position === "Team Leader" || tm.position === "Team member")
            .map((tm)=>(
              <div key={tm.id} className="col-span-2 bg-red-500">
                <div className="relative w-full h-full">
                  <Image src={tm.image} alt={tm.name} width={200} height={0} className="object-contain h-auto"/>
                </div>
                <div className="flex flex-col mt-4 text-black">
                  <h1 className="font-semibold">{tm.name}</h1>
                  <p className="">{tm.position}</p>
                  <ul className="flex gap-1 justify-center mt-2">
                    {tm.socials.portfolio && (
                      <li>
                        <Link href={tm.socials.portfolio} target="_blank" className="text-[var(--color-primary)]"><Globe/></Link>
                      </li>
                    )}
                    {tm.socials.github && (
                      <li>
                        <Link href={tm.socials.github} target="_blank" className="text-[var(--color-primary)]"><Github /></Link>
                      </li>
                    )}
                    {tm.socials.linkedin && (
                      <li>
                        <Link href={tm.socials.linkedin} target="_blank" className=" text-[var(--color-primary)]"><Linkedin /></Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
          ))
        }
      </div>
     </div>
    </section>
  )
}

// {
//           teamMembers.map((tm)=>(
//             
//           ))
//         }