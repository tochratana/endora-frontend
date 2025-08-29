import Image from "next/image";
import Link from "next/link"; 

export default function StartProject() {
  return (
    <section className="w-full m-auto max-w-6xl py-10 grid grid-cols-8 px-2 md:gap-2 gap-4">
      <div className="md:col-span-4 col-span-8">
        <h1 className="text-black dark:text-white md:text-3xl text-2xl font-semibold">
          Start project with us
        </h1>
        <p className="text-gray-500 my-5 font-semibold">
          Sign up to design schemas, generate API endpoints, and download
          Postman collections—plus unlock Swagger testing to speed up your API
          development.
        </p>
        <div className="grid grid-cols-5">
          <Link href="/signup"
            className="md:col-span-2 col-span-3 inline-flex items-center justify-center py-2 px-4 rounded font-semibold border-2 border-[var(--color-secondary)]"> Sign Up</Link>
        </div>
      </div>
      <div className="md:col-span-4 col-span-8 bg-emerald-400">

      </div>
      <Image src="" alt="image" unoptimized className="" />
    </section>
  );
}
