import Image from "next/image";

export default function OurMentor() {
  return (
    <section className="w-full py-10 px-2">
      <h1 className="text-(--color-primary) text-center md:text-5xl text-4xl font-semibold mb-4">
        Our Mentor
      </h1>
      <p className="text-black dark:text-white font-semibold text-center mb-15">
        Behind every great achievement is great guidance-ours comes from an
        exceptional mentor.
      </p>
      <div className="grid md:grid-cols-8 grid-cols-4">
        <div className="col-span-4 grid grid-cols-5">
          <Image
            src=""
            alt="mentor"
            width={0}
            height={0}
            className="h-auto object-contain col-span-2"
          />
          <div className="col-span-3 bg-yellow-400">
            <h1 className="text-xl text-(--color-primary) font-semibold">
              Kay Keo
            </h1>
            <p className="text-(--color-secondary) font-semibold">Mentor</p>
            <ul className="flex gap-2"></ul>
          </div>
        </div>
        <div className="col-span-4 grid grid-cols-5">
          <div className="col-span-3 text-right bg-red-400">
            <h1 className="text-xl text-(--color-primary) font-semibold">
              Srorng Sokcheat
            </h1>
            <p className="text-(--color-secondary) font-semibold">Mentor</p>
            <ul className="flex gap-2"></ul>
          </div>
          <Image
            src=""
            alt="mentor"
            width={0}
            height={0}
            className="h-auto object-contain col-span-2"
          />
        </div>
      </div>
    </section>
  );
}
