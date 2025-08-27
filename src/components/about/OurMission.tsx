import Image from "next/image"
import mission from "../../../public/mission.jpg"

export default function OurMission() {
  return (
    <section className="w-full py-10 max-w-6xl m-auto grid md:grid-cols-9 grid-cols-4">
      <div className="col-span-4 md:mt-0 mt-5 px-5 md:order-1 order-2">
          {/* <Image
            src={mission}
            alt="history image"
            width={0} height={0}
            className="w-full h-auto object-contain"
            /> */}
      </div>
      <div className="col-span-5 px-4 font-semibold md:order-2 order-1">
        <h1 className="md:text-5xl text-4xl text-(--color-primary) mb-5">Our Mission</h1>
        <ul className="list-disc marker:text-(--color-secondary)">
          <li><p className="text-black dark:text-white md:text-base text-sm"><span className="text-(--color-secondary)">Our mission</span> is to empower developers, students, and teams to build reliable APIs faster and easier than ever before. We believe creating an API should not be limited by technical barriers or time-consuming backend setup. That’s why we provide a platform where anyone can visually design a schema, instantly generate endpoints, and test them in a secure environment.</p></li>
          <li><p className="text-black dark:text-white md:text-base text-sm">By bridging the gap between database design and API implementation, we aim to simplify the development process, reduce repetitive work, and help innovators focus on building meaningful applications.</p></li>
        </ul>
      </div>
    </section>
  )
}
