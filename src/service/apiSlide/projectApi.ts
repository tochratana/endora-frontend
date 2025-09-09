import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Project, CreateProjectRequest } from "@/types/product";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: headers => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Project"],
  endpoints: builder => ({
    getProjects: builder.query<Project[], void>({
      query: () => `/projects/my-projects`,
      providesTags: ["Project"],
    }),

    getProjectByUuid: builder.query<Project, string>({
      query: projectUuid => `/projects/${projectUuid}`,
      providesTags: (result, error, projectUuid) => [
        { type: "Project", id: projectUuid },
      ],
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

export const {
  useGetProjectsQuery,
  useGetProjectByUuidQuery,
  useCreateProjectMutation,
} = projectApi;
