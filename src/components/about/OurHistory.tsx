// import Image from "next/image"

export default function OurHistory() {
  return (
    <section className="w-full py-10">
      <div className="max-w-6xl m-auto grid md:grid-cols-8 grid-cols-4 min-h-[400px] items-center">
        <div className="md:col-span-4 col-span-8 px-4">
          <h1 className="md:text-5xl text-4xl text-(--color-secondary) font-semibold mb-5">Our History</h1>
          <p className="text-gray-800 dark:text-white text-lg">In many projects, teams spend countless hours setting up backend code, writing repetitive CRUD operations, and managing database connections before they can even begin building actual features. We wanted to eliminate this barrier.</p>
          <br />
          <p className="text-gray-800 dark:text-white text-lg">What started as a small tool to automatically create APIs from database schemas quickly grew into a full-featured platform. Over time, we added a visual schema builder, data import/export options, authentication support, and interactive testing through Swagger UI.</p>
        </div>
        <div className="md:col-span-4 col-span-8 md:mt-0 mt-5 px-5 md:justify-self-end">
          {/* <Image
            src={history}
            alt="history image"
            width={0} height={0}
            className="w-full h-fit object-contain rounded"
            /> */}
        </div>
      </div>
    </section>
  )
}
