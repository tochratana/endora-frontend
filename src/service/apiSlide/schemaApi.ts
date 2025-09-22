import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Column {
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  isPrimary: boolean;
}

export interface SchemaDefinition {
  [columnName: string]: string; // Simple string format like "SERIAL PRIMARY KEY" or "VARCHAR(255)"
}

export interface CreateSchemaRequest {
  schemaName: string;
  schema: SchemaDefinition;
  projectUuid: string;
}

export interface Schema {
  schemaDocId: string;
  projectUuid: string;
  schemaName: string;
  columns: Record<string, string>;
  relationships: [];
  updatedAt: string;
}

export const schemaApi = createApi({
  reducerPath: "schemaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: headers => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Schema"],
  endpoints: builder => ({
    createSchema: builder.mutation<Schema, CreateSchemaRequest>({
      query: ({ schemaName, schema, projectUuid }) => ({
        url: `table?projectUuid=${projectUuid}`,
        method: "POST",
        body: {
          schemaName,
          schema,
          publicList: true,
          publicRead: true,
        },
      }),
      invalidatesTags: ["Schema"],
    }),

    getSchemas: builder.query<Schema[], string>({
      query: projectUuid => `/table/project/${projectUuid}`,
      transformResponse: (response: { data: Schema[] }) => response.data,
      providesTags: ["Schema"],
    }),
    // getSchemas: builder.query<Schema[], string>({
    //   query: projectUuid => `/table/project/${projectUuid}`,
    //   transformResponse: (response: any) => {
    //     console.log("📡 Raw schema API response:", response);
    //     return Array.isArray(response) ? response : response.data;
    //   },
    //   providesTags: ["Schema"],
    // }),

    getSchemaById: builder.query<Schema, string>({
      query: id => `schemas/${id}`,
      providesTags: ["Schema"],
    }),
  }),
});

export const {
  useCreateSchemaMutation,
  useGetSchemaByIdQuery,
  useGetSchemasQuery,
} = schemaApi;
