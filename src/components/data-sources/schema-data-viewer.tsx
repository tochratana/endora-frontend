// "use client";

// import { useState } from "react";
// import { useGetDataQuery } from "@/service/apiSlide/dataSourceApi";
// import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, RefreshCw } from "lucide-react";
// import Button from "@/components/button/Button";

// interface SchemaDataViewerProps {
//   projectUuid: string;
//   userUuid: string;
// }

// export function SchemaDataViewer({
//   projectUuid,
//   userUuid,
// }: SchemaDataViewerProps) {
//   const [selectedSchema, setSelectedSchema] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { data: schemas } = useGetSchemasQuery(projectUuid);

//   // Get the selected schema details
//   const currentSchema = schemas?.find(schema => schema.id === selectedSchema);
//   const schemaName = currentSchema?.schemaName || "";

//   const {
//     data: dataResponse,
//     error,
//     isLoading,
//     refetch,
//   } = useGetDataQuery(
//     {
//       schemaName,
//       projectUuid,
//       userUuid,
//       page,
//       limit,
//     },
//     {
//       skip: !selectedSchema || !schemaName,
//     }
//   );

//   const handleRefresh = () => {
//     refetch();
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   };

//   const handleNextPage = () => {
//     if (dataResponse?.pagination && page < dataResponse.pagination.totalPages) {
//       setPage(page + 1);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Schema Selection */}
//       <div className="flex items-center gap-4">
//         <div className="flex-1">
//           <Select
//             value={selectedSchema}
//             onValueChange={value => {
//               setSelectedSchema(value);
//               setPage(1); // Reset to first page when changing schema
//             }}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select a schema to view data..." />
//             </SelectTrigger>
//             <SelectContent>
//               {schemas?.map(schema => (
//                 <SelectItem key={schema.id} value={schema.id}>
//                   {schema.schemaName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {selectedSchema && (
//           <Button
//             onClick={handleRefresh}
//             disabled={isLoading}
//             variant="secondary"
//           >
//             <RefreshCw
//               className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </Button>
//         )}
//       </div>

//       {/* Data Content */}
//       {!selectedSchema ? (
//         <div className="text-center py-12">
//           <p className="text-slate-400">Select a schema to view its data</p>
//         </div>
//       ) : isLoading ? (
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-400" />
//             <p className="text-slate-400">Loading data...</p>
//           </div>
//         </div>
//       ) : error ? (
//         <div className="text-center py-12">
//           <p className="text-red-400 mb-2">Failed to load data</p>
//           <p className="text-sm text-slate-500">
//             {error && "data" in error ? String(error.data) : "Unknown error"}
//           </p>
//         </div>
//       ) : !dataResponse?.data || dataResponse.data.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-slate-400 mb-2">No data found</p>
//           <p className="text-sm text-slate-500">
//             This schema doesn&apos;t have any data yet. Use the Insert Data
//             button to add some records.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* Schema Info */}
//           <div className="dark:bg-slate-800 border-1 rounded-lg p-4">
//             <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
//               {currentSchema?.schemaName}
//             </h3>
//             <p className="text-sm text-slate-400">
//               Showing {dataResponse.data.length} of{" "}
//               {dataResponse.pagination.total} records
//             </p>
//             <p className="text-xs text-slate-500 mt-1">
//               Endpoint: /table/{schemaName}/project/{projectUuid}/user/
//               {userUuid}/data
//             </p>
//           </div>

//           {/* Data Table */}
//           <div className="dark:bg-slate-800 border rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="dark:bg-slate-700 bg-slate-100">
//                   <tr>
//                     {dataResponse.data.length > 0 &&
//                       Object.keys(dataResponse.data[0]).map(key => (
//                         <th
//                           key={key}
//                           className="px-4 py-3 text-left text-sm font-medium text-slate-300"
//                         >
//                           {key}
//                         </th>
//                       ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataResponse.data.map((record, index) => (
//                     <tr
//                       key={record.id || index}
//                       className="border-t dark:border-slate-600"
//                     >
//                       {Object.values(record).map((value, cellIndex) => (
//                         <td
//                           key={cellIndex}
//                           className="px-4 py-3 text-sm text-slate-300"
//                         >
//                           {typeof value === "string" ||
//                           typeof value === "number"
//                             ? String(value)
//                             : JSON.stringify(value)}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           {dataResponse.pagination.totalPages > 1 && (
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-slate-400">
//                 Page {dataResponse.pagination.page} of{" "}
//                 {dataResponse.pagination.totalPages}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={handlePreviousPage}
//                   disabled={page <= 1}
//                   variant="secondary"
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   onClick={handleNextPage}
//                   disabled={page >= dataResponse.pagination.totalPages}
//                   variant="secondary"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

//todo second one
// "use client";

// import { useState } from "react";
// import { useGetSchemaRowsQuery } from "@/service/apiSlide/dataSourceApi"; // ✅ FIXED
// import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, RefreshCw } from "lucide-react";
// import Button from "@/components/button/Button";

// interface SchemaDataViewerProps {
//   projectUuid: string;
//   userUuid: string;
// }

// export function SchemaDataViewer({
//   projectUuid,
//   userUuid,
// }: SchemaDataViewerProps) {
//   const [selectedSchema, setSelectedSchema] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   // ✅ Load schema list
//   const { data: schemas } = useGetSchemasQuery(projectUuid);

//   // Find schema name by ID
//   const currentSchema = schemas?.find((s) => s.id === selectedSchema);
//   const schemaName = currentSchema?.schemaName || "";

//   // ✅ Fetch rows using new endpoint
//   const {
//     data: dataResponse,
//     error,
//     isLoading,
//     refetch,
//   } = useGetSchemaRowsQuery(
//     {
//       schemaName,
//       projectUuid,
//       userUuid,
//       page,
//       limit,
//       sort: "-created_at",
//     },
//     {
//       skip: !selectedSchema || !schemaName,
//     }
//   );

//   const handleRefresh = () => {
//     refetch();
//   };

//   const handlePreviousPage = () => {
//     if (page > 1) setPage(page - 1);
//   };

//   const handleNextPage = () => {
//     if (dataResponse?.pagination && page < dataResponse.pagination.totalPages) {
//       setPage(page + 1);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Schema Selection */}
//       <div className="flex items-center gap-4">
//         <div className="flex-1">
//           <Select
//             value={selectedSchema}
//             onValueChange={(value) => {
//               setSelectedSchema(value);
//               setPage(1);
//             }}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select a schema to view data..." />
//             </SelectTrigger>
//             <SelectContent>
//               {schemas?.map((schema) => (
//                 <SelectItem key={schema.id} value={schema.id}>
//                   {schema.schemaName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {selectedSchema && (
//           <Button onClick={handleRefresh} disabled={isLoading} variant="secondary">
//             <RefreshCw
//               className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
//             />
//             Refresh
//           </Button>
//         )}
//       </div>

//       {/* Data Content */}
//       {!selectedSchema ? (
//         <div className="text-center py-12">
//           <p className="text-slate-400">Select a schema to view its data</p>
//         </div>
//       ) : isLoading ? (
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-400" />
//             <p className="text-slate-400">Loading data...</p>
//           </div>
//         </div>
//       ) : error ? (
//         <div className="text-center py-12">
//           <p className="text-red-400 mb-2">Failed to load data</p>
//           <p className="text-sm text-slate-500">
//             {"data" in error ? String(error.data) : "Unknown error"}
//           </p>
//         </div>
//       ) : !dataResponse?.data || dataResponse.data.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-slate-400 mb-2">No data found</p>
//           <p className="text-sm text-slate-500">
//             This schema doesn&apos;t have any data yet. Use the Insert Data
//             button to add some records.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* Schema Info */}
//           <div className="dark:bg-slate-800 border-1 rounded-lg p-4">
//             <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
//               {currentSchema?.schemaName}
//             </h3>
//             <p className="text-sm text-slate-400">
//               Showing {dataResponse.data.length} of{" "}
//               {dataResponse.pagination.total} records
//             </p>
//             <p className="text-xs text-slate-500 mt-1">
//               Endpoint: /table/{schemaName}/project/{projectUuid}/user/
//               {userUuid}/data
//             </p>
//           </div>

//           {/* Data Table */}
//           <div className="dark:bg-slate-800 border rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="dark:bg-slate-700 bg-slate-100">
//                   <tr>
//                     {Object.keys(dataResponse.data[0] || {}).map((key) => (
//                       <th
//                         key={key}
//                         className="px-4 py-3 text-left text-sm font-medium text-slate-300"
//                       >
//                         {key}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataResponse.data.map((record, index) => (
//                     <tr
//                       key={record.id || index}
//                       className="border-t dark:border-slate-600"
//                     >
//                       {Object.values(record).map((value, i) => (
//                         <td key={i} className="px-4 py-3 text-sm text-slate-300">
//                           {typeof value === "string" || typeof value === "number"
//                             ? String(value)
//                             : JSON.stringify(value)}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           {dataResponse.pagination.totalPages > 1 && (
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-slate-400">
//                 Page {dataResponse.pagination.page} of{" "}
//                 {dataResponse.pagination.totalPages}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={handlePreviousPage}
//                   disabled={page <= 1}
//                   variant="secondary"
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   onClick={handleNextPage}
//                   disabled={page >= dataResponse.pagination.totalPages}
//                   variant="secondary"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

//todo third
// "use client";

// import { useState, useMemo } from "react";
// import { useGetSchemaRowsQuery } from "@/service/apiSlide/dataSourceApi";
// import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2, RefreshCw } from "lucide-react";
// import Button from "@/components/button/Button";
// import { SampleProduct } from "@/types/dataSource";

// // Helper: Convert API record → SampleProduct
// function mapRecordToProduct(record: any): SampleProduct {
//   return {
//     id: typeof record.id === "number" ? record.id : String(record.id),
//     name: String(record.name ?? "Unknown"),
//     price: Number(record.price ?? 0),
//     created_date: String(record.created_at ?? ""),
//   };
// }

// interface SchemaDataViewerProps {
//   projectUuid: string;
//   userUuid: string;
// }

// export function SchemaDataViewer({ projectUuid, userUuid }: SchemaDataViewerProps) {
//   const [selectedSchema, setSelectedSchema] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   // Load schema list
//   const { data: schemas } = useGetSchemasQuery(projectUuid);

//   // Find schema by ID
//   const currentSchema = schemas?.find((s) => s.id === selectedSchema);
//   const schemaName = currentSchema?.schemaName || "";

//   // Fetch rows
//   const {
//     data: dataResponse,
//     error,
//     isLoading,
//     refetch,
//   } = useGetSchemaRowsQuery(
//     {
//       schemaName,
//       projectUuid,
//       userUuid,
//       page,
//       limit,
//       sort: "-created_at",
//     },
//     { skip: !selectedSchema || !schemaName }
//   );

//   // Normalize rows into SampleProduct[]
//   const products: SampleProduct[] = useMemo(
//     () => (dataResponse?.data ?? []).map(mapRecordToProduct),
//     [dataResponse]
//   );

//   const handleRefresh = () => refetch();
//   const handlePreviousPage = () => page > 1 && setPage(page - 1);
//   const handleNextPage = () => {
//     if (dataResponse?.pagination && page < dataResponse.pagination.totalPages) {
//       setPage(page + 1);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Schema selection */}
//       <div className="flex items-center gap-4">
//         <div className="flex-1">
//           <Select
//             value={selectedSchema}
//             onValueChange={(value) => {
//               setSelectedSchema(value);
//               setPage(1);
//             }}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select a schema to view data..." />
//             </SelectTrigger>
//             <SelectContent>
//               {schemas?.map((schema) => (
//                 <SelectItem key={schema.id} value={schema.id}>
//                   {schema.schemaName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {selectedSchema && (
//           <Button onClick={handleRefresh} disabled={isLoading} variant="secondary">
//             <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//         )}
//       </div>

//       {/* Content */}
//       {!selectedSchema ? (
//         <p className="text-center py-12 text-slate-400">
//           Select a schema to view its data
//         </p>
//       ) : isLoading ? (
//         <div className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-400" />
//           <p className="text-slate-400">Loading data...</p>
//         </div>
//       ) : error ? (
//         <p className="text-center py-12 text-red-400">Failed to load data</p>
//       ) : products.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-slate-400">No data found</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* Schema info */}
//           <div className="dark:bg-slate-800 border rounded-lg p-4">
//             <h3 className="font-semibold">{currentSchema?.schemaName}</h3>
//             <p className="text-sm text-slate-400">
//               Showing {products.length} of {dataResponse?.pagination.total} records
//             </p>
//           </div>

//           {/* Data table (clean format) */}
//           <div className="dark:bg-slate-800 border rounded-lg overflow-hidden">
//             <table className="w-full">
//               <thead className="dark:bg-slate-700 bg-slate-100">
//                 <tr>
//                   <th className="px-4 py-3 text-left">Name</th>
//                   <th className="px-4 py-3 text-left">Price</th>
//                   <th className="px-4 py-3 text-left">Created Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((p) => (
//                   <tr key={p.id} className="border-t dark:border-slate-600">
//                     <td className="px-4 py-3">{p.name}</td>
//                     <td className="px-4 py-3">${p.price.toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       {new Date(p.created_date).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//         {/* Pagination */}
// {dataResponse?.pagination?.totalPages && dataResponse.pagination.totalPages > 1 && (
//   <div className="flex justify-between items-center">
//     <p className="text-sm text-slate-400">
//       Page {dataResponse?.pagination?.page ?? 1} of{" "}
//       {dataResponse?.pagination?.totalPages ?? 1}
//     </p>
//     <div className="flex gap-2">
//       <Button
//         onClick={handlePreviousPage}
//         disabled={page <= 1}
//         variant="secondary"
//       >
//         Previous
//       </Button>
//       <Button
//         onClick={handleNextPage}
//         disabled={page >= (dataResponse?.pagination?.totalPages ?? 1)}
//         variant="secondary"
//       >
//         Next
//       </Button>
//     </div>
//   </div>
// )}

//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import Button from "@/components/button/Button";

interface SchemaDataViewerProps {
  projectUuid: string;
  userUuid: string;
}

// Mock schemas (fake tables)
const mockSchemas = [
  { id: "1", schemaName: "products" },
  { id: "2", schemaName: "users" },
  { id: "3", schemaName: "orders" },
];

// Mock records by schema
const mockDataBySchema: Record<string, any[]> = {
  products: [
    { id: 1, name: "Sneakers", price: 59.99, created_at: "2024-01-15T10:30:00Z" },
    { id: 2, name: "Laptop", price: 1299.0, created_at: "2024-01-16T11:45:00Z" },
    { id: 3, name: "Headphones", price: 199.99, created_at: "2024-01-20T08:15:00Z" },
  ],
  users: [
    { id: 1, username: "alice", email: "alice@example.com", joined_at: "2024-01-01T12:00:00Z" },
    { id: 2, username: "bob", email: "bob@example.com", joined_at: "2024-02-05T14:30:00Z" },
  ],
  orders: [
    { id: 1001, product: "Sneakers", quantity: 2, total: 119.98, ordered_at: "2024-03-01T09:15:00Z" },
    { id: 1002, product: "Laptop", quantity: 1, total: 1299.0, ordered_at: "2024-03-02T16:45:00Z" },
  ],
};

export function SchemaDataViewer({ projectUuid, userUuid }: SchemaDataViewerProps) {
  const [selectedSchema, setSelectedSchema] = useState<string>("");

  const rows = selectedSchema ? mockDataBySchema[selectedSchema] || [] : [];

  const handleRefresh = () => {
    console.log("Refreshed mock data for:", selectedSchema);
  };

  return (
    <div className="space-y-6">
      {/* Schema Selection */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select
            value={selectedSchema}
            onValueChange={(value) => setSelectedSchema(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a schema to view data..." />
            </SelectTrigger>
            <SelectContent>
              {mockSchemas.map((schema) => (
                <SelectItem key={schema.id} value={schema.schemaName}>
                  {schema.schemaName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSchema && (
          <Button onClick={handleRefresh} variant="secondary">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        )}
      </div>

      {/* Data Table */}
      {!selectedSchema ? (
        <div className="text-center py-12">
          <p className="text-slate-400">Select a schema to view its data</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-2">No data found</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="dark:bg-slate-800 border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="dark:bg-slate-700 bg-slate-100">
                  <tr>
                    {Object.keys(rows[0] || {}).map((key) => (
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
                  {rows.map((record, index) => (
                    <tr key={record.id || index} className="border-t dark:border-slate-600">
                      {Object.values(record).map((value, i) => (
                        <td key={i} className="px-4 py-3 text-sm text-slate-300">
                          {typeof value === "string" || typeof value === "number"
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
        </div>
      )}
    </div>
  );
}
