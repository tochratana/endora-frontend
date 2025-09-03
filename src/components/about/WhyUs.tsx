// import Image from "next/image"
import { DatabaseZapIcon, FolderOpenIcon, Settings } from "lucide-react"

export default function WhyUs() {
  return (
    <section className="w-full bg-gray-900">
      <div className="max-w-6xl m-auto grid md:grid-cols-9 grid-cols-4 py-15 gap-2 md:gap-0">
        <div className="md:col-span-3 col-span-4">
          <h1 className="md:text-5xl text-4xl font-semibold text-center text-(--color-secondary)">Why Us?</h1>
          {/* <Image src={whyus} alt="i" width={0} height={0} className="w-full h-auto object-contain rounded"/> */}
        </div>
        <div className="col-span-6 grid grid-cols-8 gap-3 text-center md:px-5 px-1">
          <div className="col-span-4 border border-(--color-secondary) rounded-md md:p-5 p-3 flex flex-col items-center">
            <DatabaseZapIcon className="text-white"/>
            <h3 className="text-gray-500 font-semibold my-2">Schema Builder</h3>
            <p className="text-white">Create and manage database schemas with an intuitive visual editor and relationships without needing complex SQL.</p>
          </div>
          <div className="col-span-4 border border-(--color-secondary) rounded-md md:p-5 p-3 flex flex-col items-center">
            <Settings className="text-white"/>
            <h3 className="text-gray-500 font-semibold my-2">API Generator</h3>
            <p className="text-white ">Generate RESTful API endpoints from your schema in seconds, just design your schema and get production-ready APIs instantly.</p>
          </div>
          <div className="col-span-8 border border-(--color-secondary) rounded-md md:p-5 p-3 flex flex-col items-center">
            <FolderOpenIcon className="text-white"/>
            <h3 className="text-gray-500 font-semibold my-2">Download JSON</h3>
            <p className="text-white ">Download ready-to-use JSON collections for Postman. Save time by testing your endpoints immediately with structured requests and sample payloads.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
