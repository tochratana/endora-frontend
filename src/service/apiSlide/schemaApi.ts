import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { inflate } from "zlib";

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
  schema: Record<string, string>;
  projectUuid: string;
}

export interface Schema {
  schemaDocId: string;
  projectUuid: string;
  schemaName: string;
  columns: Record<string, string>;
  schema: Record<string, string>;
  relationships: [];
  updatedAt: string;
}

export interface CreateSchemaRelationship {
  foreignKeyColumn: string;
  referencedTable: string;
  referencedColumn: string;
  relationshipType: string;
  onDelete: string;
  onUpdate: string;
}

export interface SchemaRelationship {
  projectUuid: string;
  schemaName: string;
  relationshipType: string;
  ddl: string;
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
        url: `/table/project/${projectUuid}`,
        method: "POST",
        body: {
          schemaName,
          publicList: true,
          publicRead: true,
          schema,
        },
      }),
      invalidatesTags: ["Schema"],
    }),

    getSchemas: builder.query<Schema[], string>({
      query: projectUuid => `/table/project/${projectUuid}`,
      transformResponse: (response: { data: Schema[] }) => response.data,
      providesTags: ["Schema"],
    }),
    getSchemaById: builder.query<Schema, string>({
      query: schemaDocId => `schemas/${schemaDocId}`,
      providesTags: ["Schema"],
    }),

    createSchemaRelationship: builder.mutation<SchemaRelationship, CreateSchemaRelationship & { schemaName: string; projectUuid: string }>({
      query: ({
        schemaName,
        projectUuid,
        foreignKeyColumn,
        referencedTable,
        referencedColumn,
        relationshipType,
        onDelete,
        onUpdate,
      }) => ({
        url: `/table/project/${projectUuid}/${schemaName}`,
        method: "POST",
        body: {
          foreignKeyColumn,
          referencedTable,
          referencedColumn,
          relationshipType,
          onDelete,
          onUpdate,
        },
      }),
      invalidatesTags: ["Schema"],
    }),
  }),
});

export const {
  useCreateSchemaMutation,
  useGetSchemaByIdQuery,
  useGetSchemasQuery,
  useCreateSchemaRelationshipMutation,
} = schemaApi;
