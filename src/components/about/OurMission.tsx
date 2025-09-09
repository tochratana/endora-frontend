// import Image from "next/image"

export default function OurMission() {
  return (
    <section className="w-full py-10">
      <div className="grid md:grid-cols-9 grid-cols-4 min-h-[400px] items-center max-w-6xl m-auto">
        <div className="md:col-span-4 col-span-9 md:mt-0 mt-5 px-5 md:order-1 order-2 md:justify-self-end">
          {/* <Image
            src={mission}
            alt="history image"
            width={0} height={0}
            className="w-full h-auto object-contain"
            /> */}
        </div>
        <div className="md:col-span-5 col-span-9 px-4 font-semibold md:order-2 order-1">
          <h1 className="md:text-5xl text-4xl text-(--color-primary) mb-5">Our Mission</h1>
          <ul className="list-disc marker:text-(--color-secondary)">
            <li><p className="text-gray-800 dark:text-white md:text-base text-sm">
              <span className="text-(--color-secondary) text-lg">Our mission</span> is to empower developers, students, and teams to build reliable APIs faster and easier than ever before. We believe creating an API should not be limited by technical barriers or time-consuming backend setup.</p>
              </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
