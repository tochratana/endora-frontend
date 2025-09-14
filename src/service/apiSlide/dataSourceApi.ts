// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getSession } from "next-auth/react";

// export interface DataSourceRecord {
//   id: string;
//   [key: string]: unknown; // Dynamic fields based on schema
//   created_at: string;
//   updated_at: string;
//   created_by: string;
//   schema_name: string;
//   project_uuid: string;
// }

// export interface DataSourceResponse {
//   data: DataSourceRecord[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   schema: string;
//   project: string;
// }

// export interface InsertDataRequest {
//   schemaName: string;
//   projectUuid: string;
//   userUuid: string;
//   data: Record<string, unknown>;
// }

// export interface InsertDataResponse {
//   success: boolean;
//   message: string;
//   data: DataSourceRecord;
// }

// export interface GetDataParams {
//   schemaName: string;
//   projectUuid: string;
//   userUuid: string;
//   page?: number;
//   limit?: number;
// }

// export const dataSourceApi = createApi({
//   reducerPath: "dataSourceApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "/api/table",
//     prepareHeaders: async headers => {
//       const session = await getSession();
//       if (session?.user) {
//         headers.set("authorization", `Bearer ${session.user.email}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["DataSource"],
//   endpoints: builder => ({
//     // Insert data into a schema
//     insertData: builder.mutation<InsertDataResponse, InsertDataRequest>({
//       query: ({ schemaName, projectUuid, userUuid, data }) => ({
//         url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data`,
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: (result, error, { schemaName, projectUuid }) => [
//         { type: "DataSource", id: `${schemaName}-${projectUuid}` },
//       ],
//     }),

//     // Get data from a schema
//     getData: builder.query<DataSourceResponse, GetDataParams>({
//       query: ({ schemaName, projectUuid, userUuid, page = 1, limit = 10 }) => ({
//         url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data?page=${page}&limit=${limit}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, { schemaName, projectUuid }) => [
//         { type: "DataSource", id: `${schemaName}-${projectUuid}` },
//       ],
//     }),
//   }),
// });

// export const { useInsertDataMutation, useGetDataQuery } = dataSourceApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DataSourceRecord {
  id: string | number;
  [key: string]: unknown;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  schema_name?: string;
  project_uuid?: string;
}

export interface DataSourceResponse {
  data: DataSourceRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  schema: string;
  project: string;
}

export interface InsertDataRequest {
  schemaName: string;
  projectUuid: string;
  userUuid: string;
  data: Record<string, unknown>;
}

export interface InsertDataResponse {
  success: boolean;
  message: string;
  data: DataSourceRecord;
}

export interface GetDataParams {
  schemaName: string;
  projectUuid: string;
  userUuid: string;
  page?: number;
  limit?: number;
  sort?: string;
}

// 💡 NOTE: Use Next.js API route, not backend directly
export const dataSourceApi = createApi({
  reducerPath: "dataSourceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/table", // <-- local Next.js API route
  }),
  tagTypes: ["DataSource"],
  endpoints: (builder) => ({
    // Insert record
    insertSchemaRow: builder.mutation<InsertDataResponse, InsertDataRequest>({
      query: ({ schemaName, projectUuid, userUuid, data }) => ({
        url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { schemaName, projectUuid }) => [
        { type: "DataSource", id: `${schemaName}-${projectUuid}` },
      ],
    }),

    // Fetch records
    getSchemaRows: builder.query<DataSourceResponse, GetDataParams>({
      query: ({ schemaName, projectUuid, userUuid, page = 1, limit = 10, sort }) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (sort) params.append("sort", sort);

        return {
          url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, { schemaName, projectUuid }) => [
        { type: "DataSource", id: `${schemaName}-${projectUuid}` },
      ],
    }),
  }),
});

export const {
  useInsertSchemaRowMutation,
  useGetSchemaRowsQuery,
} = dataSourceApi;
