// "use client";

// import { DataTable } from "@/components/data-sources/data-table";
// import {
//   useGetRowsQuery,
//   useInsertRowMutation,
//   useUpdateRowMutation,
//   useDeleteRowsMutation,
// } from "@/components/service/apiSlide/rowsApi";
// import { useEffect, useRef } from "react";

// // compare previous and next arrays by `id`
// function diff(prev: any[], next: any[]) {
//   const prevMap = new Map(prev.map((r) => [r.id, r]));
//   const nextMap = new Map(next.map((r) => [r.id, r]));
//   const added = next.filter((r) => !prevMap.has(r.id));
//   const removed = prev.filter((r) => !nextMap.has(r.id)).map((r) => r.id);
//   const updated = next.filter((r) => {
//     const p = prevMap.get(r.id);
//     if (!p) return false;
//     return JSON.stringify(p) !== JSON.stringify(r);
//   });
//   return { added, removed, updated };
// }

// export function DataClient({
//   workspaceId,
//   tableId,
// }: {
//   workspaceId: string;
//   tableId: string;
// }) {
//   const { data = [], refetch } = useGetRowsQuery({ workspaceId, tableId });
//   const [insertRow] = useInsertRowMutation();
//   const [updateRow] = useUpdateRowMutation();
//   const [deleteRows] = useDeleteRowsMutation();

//   const last = useRef<any[]>(data);
//   useEffect(() => {
//     last.current = data;
//   }, [data]);

//   return (
//     <DataTable
//       products={data}
//       onProductsChange={async (next) => {
//         const { added, removed, updated } = diff(last.current, next);
//         for (const r of added) await insertRow({ workspaceId, tableId, row: r });
//         for (const r of updated) await updateRow({ workspaceId, tableId, row: r });
//         if (removed.length) await deleteRows({ workspaceId, tableId, ids: removed });
//         await refetch();
//       }}
//     />
//   );
// }
