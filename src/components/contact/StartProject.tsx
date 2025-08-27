import Image from "next/image";
import Link from "next/link";

export default function StartProject() {
  return (
    <section className="w-full m-auto max-w-6xl py-10 grid grid-cols-8 px-2">
      <div className="col-span-5">
        <h1 className="text-black dark:text-white md:text-3xl text-2xl font-semibold">Start project with us</h1>
        <p className="text-gray-500 my-5 font-semibold">Sign up to design schemas, generate API endpoints, and download Postman collections—plus unlock Swagger testing to speed up your API development.</p>
       <Link href="/signup" className="py-2 rounded border w-full">Sign Up</Link>
      </div>
      <Image src="" alt="image" unoptimized className="col-span-3"/>
    </section>
  )
}
