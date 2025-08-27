import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex flex-col item-center text-center justify-center w-full py-10 gap-4">
        <h1 className="md:text-5xl text-4xl mb-5 font-semibold text-black dark:text-white">Welcome to <span className="text-(--color-secondary)">Endora</span></h1>
        <p className="text-lg font-bold text-black dark:text-white">Endora is a lightweight Backend-as-a-Service(Baas) platform <br /> that simplifies backend development by generating REST <br /> APIs from schemas or data sources.</p>
        <button><Link href="/" className="px-4 py-2 bg-(--color-secondary) text-white rounded text-sm font-semibold">Start your project</Link></button>
    </section>
  )
}
