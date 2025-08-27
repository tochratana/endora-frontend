import Image from "next/image";

export default function JoinTeam() {
  return (
    <section className="w-full py-10 px-2 bg-white">
      <div className="max-w-6xl m-auto text-center font-semibold">
        <h1 className="text-(--color-secondary) md:text-5xl text-4xl mb-7">
          {" "}
          Joint Our Team
        </h1>
        <p className="text-black md:w-[50%] w-full m-auto mb-5">
          We are delighted to be a part of your project journey by delivering
          fast and effective tools that accelerate your progress. Whether you’re
          starting small or scaling up, we’re here to ensure your development
          process runs faster, smoother, and smarter.
        </p>
        <Image
          src="/join_team.gif"
          alt="Join our team"
          width={1000}
          height={400}
          style={{ width: "500px", height: "auto" }}
          className="h-auto object-contain"
        />
      </div>
    </section>
  );
}
