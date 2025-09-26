import { DatabaseIcon } from "lucide-react";
import { GoPlusCircle } from "react-icons/go";
import { AiOutlineDownload } from "react-icons/ai";
import { ImportDataModal } from "../popup/importDataModel";
import { useState } from "react";

interface EmptyStateProps {
  onAddSample?: () => void;
}

export function EmptyState({ onAddSample }: EmptyStateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImport = (file: File, method: string) => {
    console.log("Importing file:", file.name, "with method:", method);
    // Handle the file import logic here
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 text-gray-600">
        <DatabaseIcon className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-gray-400 mb-4">
        No data in your product table
      </h3>
      <p className="text-gray-500 mb-8 max-w-md">
        Your schema is ready, but no data yet. Import data from a CSV/ JSON file
        or add sample data to test your API endpoints.
      </p>
      <div className="flex gap-4">
        {/* <button 
        onClick={onAddSample}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
          <GoPlusCircle className="text-xl"/>
          Add Sample
        </button> */}

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          <AiOutlineDownload className="text-xl" />
          Import File
        </button>
        <ImportDataModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}
