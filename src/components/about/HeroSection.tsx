import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-6xl m-auto flex flex-col item-center text-center justify-center py-15 gap-5">
      <h1 className="md:text-5xl text-4xl font-semibold text-black dark:text-white">
        Welcome to <span className="text-(--color-secondary)">Endora</span>
      </h1>
      <p className="md:w-[60%] w-[80%] m-auto md:text-lg font-bold text-black dark:text-white">
        Endora is a lightweight Backend-as-a-Service(Baas) platform that
        simplifies backend development by generating REST APIs from schemas or
        data sources.
      </p>
      <button>
        <Link href="/" className="md:px-4 px-2 py-2 bg-(--color-secondary) text-white rounded text-sm font-semibold"> Start your project </Link>
      </button>
    </section>
  );
}
