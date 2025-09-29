import { toast, Toaster } from "sonner";
import {
  Column,
  useGetAllSchemasQuery,
  useImportSchemaMutation,
} from "@/service/apiSlide/schemaApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface AllSchemaProps {
  projectUuid: string;
}

export default function ReuseSchema({
  projectUuid,
}: AllSchemaProps) {
  const {
    data: schemas,
    error,
    isLoading,
  } = useGetAllSchemasQuery(projectUuid);
  const [importSchema] = useImportSchemaMutation();
  const otherProjectSchemas = schemas?.filter(
    schema => schema.projectId !== projectUuid
  );

  const handleSelect = async (schema: any) => {
    try {
      await importSchema({
        projectUuid,
        schemaName: schema.schemaName,
        sourceProjectId: schema.projectId,
      }).unwrap();

      toast.success(`Schema "${schema.schemaName}" applied successfully`);
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;
      const message: string =
        err?.data?.message || err?.error || "Something went wrong";

      if (status === 400 || /already exists/i.test(message)) {
        toast.error(
          `Schema "${schema.schemaName}" already exists in this project.`
        );
      } else {
        toast.error(`Failed to import schema: ${message}`);
      }
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full flex items-center bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-100 border-gray-300 rounded-sm px-2 py-1 hover:bg-teal-200 dark:hover:bg-teal-700">
            Reuse Schema
            <ChevronDown className="ml-1 h-4 w-4 pt-0.5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white dark:bg-gray-800 dark:text-gray-100">
          {isLoading && (
            <div className="px-4 py-2 text-sm text-gray-500">Loading…</div>
          )}

          {error && (
            <div className="px-4 py-2 text-sm text-red-500">
              Failed to load schemas
            </div>
          )}

          {otherProjectSchemas?.map(schema => (
            <DropdownMenuItem
              key={schema.id}
              className="grid grid-cols-2 gap-6"
              onClick={() => handleSelect(schema)}
            >
              {schema.schemaName}
              <span className="text-xs text-gray-400">
                {schema.projectName}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
