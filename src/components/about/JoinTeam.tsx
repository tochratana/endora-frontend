import Image from "next/image";

export default function JoinTeam() {
  return (
    <section className="w-full text-center py-10 font-semibold px-2">
      <h1 className="text-(--color-secondary) md:text-5xl text-4xl mb-7">
        {" "}
        Joint Our Team
      </h1>
      <p className="text-black md:w-[60%] w-full m-auto dark:text-white mb-5">
        We are delighted to be a part of your project journey by delivering fast
        and effective tools that accelerate your progress. Whether you’re
        starting small or scaling up, we’re here to ensure your development
        process runs faster, smoother, and smarter.
      </p>
      <Image
        src=""
        alt="image"
        width={0}
        height={0}
        className="h-auto object-contain"
      />
    </section>
  );
}
