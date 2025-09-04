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
  id: string;
  schemaName: string;
  schema: SchemaDefinition;
  projectUuid: string;
  createdAt: string;
  updatedAt: string;
}

export const schemaApi = createApi({
  reducerPath: "schemaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
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
        body: { schemaName, schema },
      }),
      invalidatesTags: ["Schema"],
    }),
  }),
});

export const { useCreateSchemaMutation } = schemaApi;
