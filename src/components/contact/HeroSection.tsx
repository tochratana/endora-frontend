import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-6xl w-full m-auto flex py-10 px-2">
      <div> 
        <h1 className="text-[var(--color-secondary)] md:text-4xl text-3xl font-semibold">Get in touch with us.</h1>
        <h2 className="text-black dark:text-white md:text-3xl text-2xl">We're here to assist you.</h2>
        <p className="text-gray-500 mt-4">Our  friendly team is always here to chat.</p>
      </div>
      <Image src="" alt="" width={0} height={0} unoptimized className=""/>
    </section>
  )
}
