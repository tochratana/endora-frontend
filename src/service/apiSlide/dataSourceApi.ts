import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export interface DataSourceRecord {
  id: string;
  [key: string]: unknown; // Dynamic fields based on schema
  created_at: string;
  updated_at: string;
  created_by: string;
  schema_name: string;
  project_uuid: string;
  deleted_at?: string;
  deleted_data?: unknown;
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

//projects stats API response
export interface ProjectStatsResponse {
  message: string;
  data: {
    total: number;
    records: unknown;
  };
}

export interface UpdateDataRequest {
  schemaName: string;
  projectUuid: string;
  userUuid: string;
  id: string | number;
  data: Record<string, unknown>;
}

//Link Record request payload
export interface LinkRecordRequest {
  projectUuid: string;
  sourceSchemaName: string; // The primary table ({{table}})
  sourceRecordId: string | number; // The ID of the record being modified ({{id}})
  targetSchemaName: string; // The related table ({{otherTable}})
  add?: (string | number)[]; // Array of IDs to link
  remove?: (string | number)[]; // Array of IDs to unlink
}

//Import request
export interface ImportDataRequest {
  projectUuid: string;
  schemaName: string;
  importMethod: string; // 'replace', 'append', or 'update'
  file: File;
}

export const dataSourceApi = createApi({
  reducerPath: "dataSourceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/table",
    prepareHeaders: async headers => {
      const session = await getSession();
      if (session?.user) {
        headers.set("authorization", `Bearer ${session.user.email}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DataSource"],
  endpoints: builder => ({
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
      query: ({
        schemaName,
        projectUuid,
        userUuid,
        page = 1,
        limit = 10,
        sort,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort: sort || "created_at",
        });

        return {
          url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data?${params.toString()}`,
          method: "GET",
        };
      },

      transformResponse: (response: DataSourceResponse) => {
        const filteredData = response.data.filter(
          (record: any) =>
            record && Object.keys(record).length > 0 && !record.deleted_at
        );
        return {
          ...response,
          data: filteredData,
          pagination: {
            ...response.pagination,
            total: filteredData.length,
          },
        };
      },
      providesTags: (result, error, { schemaName, projectUuid }) => [
        { type: "DataSource", id: `${schemaName}-${projectUuid}` },
      ],
    }),

    //get project-wide stats (get all record)
    getProjectStats: builder.query<ProjectStatsResponse, string>({
      query: projectUuid => `/projects/${projectUuid}/rest/records-with-counts`,
    }),

    //update record
    updateSchemaRow: builder.mutation<void, UpdateDataRequest>({
      query: ({ schemaName, projectUuid, userUuid, id, data }) => ({
        url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { schemaName, projectUuid }) => [
        {
          type: "DataSource",
          id: `${schemaName}-${projectUuid}`,
        },
      ],
    }),

    //delete record
    deleteSchemaRow: builder.mutation<
      void,
      {
        schemaName: string;
        projectUuid: string;
        userUuid: string;
        id: string | number;
      }
    >({
      query: ({ schemaName, projectUuid, userUuid, id }) => ({
        url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { schemaName, projectUuid }) => [
        { type: "DataSource", id: `${schemaName}-${projectUuid}` },
      ],
    }),

    //handle file import
    importData: builder.mutation<void, ImportDataRequest>({
      query: ({ projectUuid, schemaName, importMethod, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("method", importMethod);

        return {
          url: `/projects/${projectUuid}/rest/tables/${schemaName}/data/upload`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { schemaName, projectUuid }) => [
        { type: "DataSource", id: `${schemaName}-${projectUuid}` },
      ],
    }),
  }),
});

export const {
  useInsertSchemaRowMutation,
  useGetSchemaRowsQuery,
  useGetProjectStatsQuery,
  useDeleteSchemaRowMutation,
  useUpdateSchemaRowMutation,
  useImportDataMutation,
} = dataSourceApi;
