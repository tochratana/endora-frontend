import { Archive, Database, User, ZapIcon } from "lucide-react";

export default function ProjectOverview() {
  return (
   <section className="w-full py-10 dark:bg-slate-900 bg-white">
      <div className="max-w-6xl m-auto flex md:flex-col flex-row text-black px-2">
        <div className="grid grid-cols-12 w-full mb-10">
          <div className="col-span-6">
            <h1 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">Daron-Beauty-Store</h1>
            <p className="text-gray-800 dark:text-gray-400">We bring convenience to your fingertips with a wide range of products tailored to your lifestyle.</p>
          </div>
          <div className="col-span-6 justify-self-end ">
            <h1 className="font-semibold text-lg text-gray-800 dark:text-white">Total</h1>
            <p className="text-gray-800 dark:text-gray-300">00</p>
          </div>
        </div>
        <div className="grid grid-cols-8 h-70 w-full gap-4">
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <Database className="text-[var(--color-secondary)]"/>
                <h1 className="font-semibold text-gray-800 dark:text-gray-300">Schema</h1>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">REST Request</h3>
              <p className="text-gray-800 dark:text-gray-300">0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 text-center">
              <p className="text-gray-800 dark:text-gray-300">No data to show</p>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <Archive className="text-[var(--color-secondary)]"/>
                <h1 className="font-semibold">Storage</h1>
              </div>
              <h3 className="text-sm font-semibold">REST Request</h3>
              <p>0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 text-center">
              <p>No data to show</p>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <User className="text-[var(--color-secondary)]"/>
                <h1 className="font-semibold">Auth</h1>
              </div>
              <h3 className="text-sm font-semibold">REST Request</h3>
              <p>0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 text-center">
              <p>No data to show</p>
            </div>
          </div>
          {/*  */}
          <div className="col-span-2 p-3 border rounded border-gray-300">
            <div className="h-[50%]">
              <div className="flex gap-4 mb-3">
                <ZapIcon className="text-[var(--color-secondary)]"/>
                <h1 className="font-semibold">Realtime</h1>
              </div>
              <h3 className="text-sm font-semibold">REST Request</h3>
              <p>0</p>
            </div>
            <div className="h-[50%] grid place-content-center border border-gray-300 text-center">
              <p>No data to show</p>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </section>
  )
}