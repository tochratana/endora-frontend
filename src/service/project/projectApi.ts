import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Project,
  CreateProjectRequest,
  ProjectResponse,
  ProjectSummary,
} from "@/types/product";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: headers => {
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  tagTypes: ["Project"],
  endpoints: builder => ({
    getProjects: builder.query<ProjectSummary[], void>({
      query: () => `/projects`,
      providesTags: ["Project"],
      transformResponse: (response: ProjectResponse) => response.data,
    }),

    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: projectData => ({
        url: "projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = projectApi;