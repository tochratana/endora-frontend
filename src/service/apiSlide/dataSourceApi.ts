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

//for the projects stats API response
export interface ProjectStatsResponse {
  totalRecord: number;
  lastUpdatedAt: string;
}

export interface UpdateDataRequest {
  schemaName: string;
  projectUuid: string;
  userUuid: string;
  id: string | number;
  data: Record<string, unknown>;
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
    // Insert data into a schema
    // insertData: builder.mutation<InsertDataResponse, InsertDataRequest>({
    //   query: ({ schemaName, projectUuid, userUuid, data }) => ({
    //     url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data`,
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: (result, error, { schemaName, projectUuid }) => [
    //     { type: "DataSource", id: `${schemaName}-${projectUuid}` },
    //   ],
    // }),

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

    // Get data from a schema
    // getData: builder.query<DataSourceResponse, GetDataParams>({
    //   query: ({ schemaName, projectUuid, userUuid, page = 1, limit = 10 }) => ({
    //     url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),
    //   providesTags: (result, error, { schemaName, projectUuid }) => [
    //     { type: "DataSource", id: `${schemaName}-${projectUuid}` },
    //   ],
    // }),
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
          sort: "created_at",
        });
        // if (sort) params.append("sort", sort);
        //can also add more parameters if needed, for example:
        // params.append("order", "asc"); // If your API uses this for ascending order

        return {
          url: `/${schemaName}/project/${projectUuid}/user/${userUuid}/data?${params.toString()}`,
          method: "GET",
        };
      },

      //Transform the response to filter out soft-deleted records
      transformResponse: (response: DataSourceResponse) => {
        const filteredData = response.data.filter(
          (record: any) => !record.deleted_at
        );
        return {
          ...response,
          data: filteredData,
          pagination: {
            ...response.pagination,
            // Update the total count to reflect the filtered data
            total: filteredData.length,
          },
        };
      },
      providesTags: (result, error, { schemaName, projectUuid }) => [
        { type: "DataSource", id: `${schemaName}-${projectUuid}` },
      ],
    }),

    // Endpoint to get project-wide stats
    getProjectStats: builder.query<ProjectStatsResponse, string>({
      query: projectUuid => `/project/${projectUuid}/stats`,
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
  }),
});

export const {
  useInsertSchemaRowMutation,
  useGetSchemaRowsQuery,
  useGetProjectStatsQuery,
  useDeleteSchemaRowMutation,
  useUpdateSchemaRowMutation,
} = dataSourceApi;
