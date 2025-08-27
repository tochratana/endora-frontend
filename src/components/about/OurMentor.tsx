import Image from "next/image"

import { Github, Globe, Linkedin } from "lucide-react"
import { teamMembers } from "./TeamData"

export default function OurMentor() {
  return (
    <section className="w-full py-10 px-2 bg-white">
      <div className="max-w-6xl m-auto">
        <h1 className="text-(--color-primary) text-center md:text-5xl text-4xl font-semibold mb-4">Our Mentor</h1>
        <p className="text-black font-semibold text-center mb-15">Behind every great achievement is great guidance-ours comes from an exceptional mentor.</p>
        <div className="grid md:grid-cols-8 grid-cols-4">
          {
            teamMembers
              .filter((tm)=>(tm.position === "Mentor"))
              .map((tm)=>(
                <div className="col-span-2" key={tm.id}>
                  
                </div>
              ))
          }
        </div>
      </div>
    </section>
  )
}