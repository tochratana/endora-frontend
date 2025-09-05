"use client";

import { useState } from "react";
import { useGetDataQuery } from "@/service/apiSlide/dataSourceApi";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCw } from "lucide-react";
import Button from "@/components/button/Button";

interface SchemaDataViewerProps {
  projectUuid: string;
  userUuid: string;
}

export function SchemaDataViewer({
  projectUuid,
  userUuid,
}: SchemaDataViewerProps) {
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: schemas } = useGetSchemasQuery(projectUuid);

  // Get the selected schema details
  const currentSchema = schemas?.find(schema => schema.id === selectedSchema);
  const schemaName = currentSchema?.schemaName || "";

  const {
    data: dataResponse,
    error,
    isLoading,
    refetch,
  } = useGetDataQuery(
    {
      schemaName,
      projectUuid,
      userUuid,
      page,
      limit,
    },
    {
      skip: !selectedSchema || !schemaName,
    }
  );

  const handleRefresh = () => {
    refetch();
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (dataResponse?.pagination && page < dataResponse.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Schema Selection */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select
            value={selectedSchema}
            onValueChange={value => {
              setSelectedSchema(value);
              setPage(1); // Reset to first page when changing schema
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a schema to view data..." />
            </SelectTrigger>
            <SelectContent>
              {schemas?.map(schema => (
                <SelectItem key={schema.id} value={schema.id}>
                  {schema.schemaName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSchema && (
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="secondary"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        )}
      </div>

      {/* Data Content */}
      {!selectedSchema ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Select a schema to view its data</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-400" />
            <p className="text-slate-400">Loading data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-2">Failed to load data</p>
          <p className="text-sm text-slate-500">
            {error && "data" in error ? String(error.data) : "Unknown error"}
          </p>
        </div>
      ) : !dataResponse?.data || dataResponse.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-2">No data found</p>
          <p className="text-sm text-slate-500">
            This schema doesn&apos;t have any data yet. Use the Insert Data
            button to add some records.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Schema Info */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">
              {currentSchema?.schemaName}
            </h3>
            <p className="text-sm text-slate-400">
              Showing {dataResponse.data.length} of{" "}
              {dataResponse.pagination.total} records
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Endpoint: /table/{schemaName}/project/{projectUuid}/user/
              {userUuid}/data
            </p>
          </div>

          {/* Data Table */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    {dataResponse.data.length > 0 &&
                      Object.keys(dataResponse.data[0]).map(key => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-sm font-medium text-slate-300"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {dataResponse.data.map((record, index) => (
                    <tr
                      key={record.id || index}
                      className="border-t border-slate-600"
                    >
                      {Object.values(record).map((value, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-3 text-sm text-slate-300"
                        >
                          {typeof value === "string" ||
                          typeof value === "number"
                            ? String(value)
                            : JSON.stringify(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {dataResponse.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Page {dataResponse.pagination.page} of{" "}
                {dataResponse.pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviousPage}
                  disabled={page <= 1}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextPage}
                  disabled={page >= dataResponse.pagination.totalPages}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
