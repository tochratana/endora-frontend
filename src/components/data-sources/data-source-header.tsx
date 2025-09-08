
import Image from "next/image";


export function DataSourceHeader() {
  return (
     <div className="flex items-center gap-4 mb-12">
      <div className="flex items-center gap-3">
        <div className="relative w-[70px] h-[70px]">
          <Image
            src="/linear.svg"
            alt="Database logo"
            width={70}
            height={70}
            className="object-contain"
            style={{ 
              maxWidth: '100%',
              height: 'auto',
              filter: 'none'
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Data Source</h1>
          <p className=" text-gray-500 text-sm">View and manage the dataset powering this project APIs</p>
        </div>
      </div>
    </div>
  )
}
