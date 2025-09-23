import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Column {
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  isPrimary: boolean;
}

export interface SchemaDefinition {
  [columnName: string]: string;
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
    baseUrl: "/api", // keeps your /api/table/... endpoints working
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

    // ✅ FIXED: correct path + response normalization + encoding
    getSchemaByName: builder.query<
      Schema,
      { projectUuid: string; schemaName: string }
    >({
      query: ({ projectUuid, schemaName }) =>
        `/projects/${projectUuid}/schema/tables/${encodeURIComponent(schemaName)}`, // ⬅️ EXACT v1 path
      transformResponse: (response: {
        message: string;
        data: {
          schemaDocId?: string;
          id?: string;
          projectUuid: string;
          schemaName: string;
          columns: Record<string, string> | Column[];
          relationships: [];
          updatedAt: string;
        };
      }) => {
        const d = response.data;
        let columns: Record<string, string> = {};
        if (Array.isArray(d.columns)) {
          // If columns is an array of Column objects, convert to Record<string, string>
          columns = Object.fromEntries(d.columns.map(c => [c.name, c.type]));
        } else {
          // If already Record<string, string>
          columns = d.columns ?? {};
        }
        return {
          id: d.id ?? d.schemaDocId ?? "",
          projectUuid: d.projectUuid,
          schemaName: d.schemaName,
          columns,
          schema: columns,
          relationships: d.relationships ?? [],
          updatedAt: d.updatedAt,
        };
      },
    }),

    createSchemaRelationship: builder.mutation<
      SchemaRelationship,
      CreateSchemaRelationship & { schemaName: string; projectUuid: string }
    >({
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
        url: `/table/project/${projectUuid}/${encodeURIComponent(schemaName)}`,
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
  useGetSchemaByNameQuery,
} = schemaApi;
