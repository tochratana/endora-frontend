import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Project,
  CreateProjectRequest,
  ProjectResponse,
  ProjectSummary,
} from "@/types/product";
import ProjectOverview from "@/types/projectOverview";

// Add new types for the upload endpoint
export interface UploadDataRequest {
  projectUuid: string;
  schemaName: string;
  data: any; // JSON data to upload
  format?: string;
  trimStrings?: boolean;
  batchSize?: number;
}

export interface UploadDataResponse {
  success: boolean;
  message: string;
  recordsProcessed?: number;
  errors?: string[];
}

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      
      // Add authorization header if you have token in your state
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set("Authorization", `Bearer ${token}`);
      // }

      return headers;
    },
  }),
  tagTypes: ["Project", "TableData"],
  endpoints: builder => ({
    getProjects: builder.query<ProjectSummary[], void>({
      query: () => `/projects`,
      providesTags: ["Project"],
      transformResponse: (response: ProjectResponse) => response.data,
    }),

    getProjectByUuid: builder.query<Project, string>({
      query: uuid => `/projects/${uuid}`,
      providesTags: ["Project"],
      // providesTags: (result, error, uuid) => [{ type: "Project", id: uuid }],
    }),

    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: projectData => ({
        url: "projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),

    getProjectOverview: builder.query<ProjectOverview, string>({
      query: uuid => `/projects/${uuid}/usage/current`,
      providesTags: (result, error, uuid) => [{ type: "Project", id: uuid }],
    }),

    // New endpoint for uploading data to tables
    uploadTableData: builder.mutation<UploadDataResponse, UploadDataRequest>({
      query: ({ projectUuid, schemaName, data, format = "json", trimStrings = true, batchSize = 500 }) => ({
        url: `/v1/projects/${projectUuid}/rest/tables/${schemaName}/data/upload`,
        method: "POST",
        body: data,
        params: {
          format,
          trimStrings,
          batchSize,
        },
      }),
      invalidatesTags: ["TableData"],
    }),

    // Alternative endpoint that matches your original URL structure
    insertTableDataFromEditor: builder.mutation<UploadDataResponse, UploadDataRequest>({
      query: ({ projectUuid, schemaName, data, format = "json", trimStrings = true, batchSize = 500 }) => ({
        url: `/v1/projects/${projectUuid}/rest/tables/${schemaName}/data/insert-from-editor-plain`,
        method: "POST",
        body: data,
        params: {
          format,
          trimStrings,
          batchSize,
        },
      }),
      invalidatesTags: ["TableData"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByUuidQuery,
  useCreateProjectMutation,
  useGetProjectOverviewQuery,
  useUploadTableDataMutation,
  useInsertTableDataFromEditorMutation,
} = projectApi;