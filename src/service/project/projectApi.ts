import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Project,
  CreateProjectRequest,
  ProjectResponse,
  ProjectSummary,
} from "@/types/product";
import ProjectOverview from "@/types/projectOverview";

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

    getProjectByUuid: builder.query<ProjectResponse, string>({
      query: uuid => `/projects/${uuid}`, // matches your folder
      providesTags: (result, error, uuid) => [{ type: "Project", id: uuid }],
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
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByUuidQuery,
  useCreateProjectMutation,
  useGetProjectOverviewQuery,
} = projectApi;
