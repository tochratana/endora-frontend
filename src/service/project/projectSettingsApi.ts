import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Types based on Postman collection
export interface RenameProjectRequest {
  projectName: string;
}

export interface RenameProjectResponse {
  message: string;
  data: {
    uuid: string;
    name: string;
    updatedAt: string;
  };
}

export interface ChangePasswordRequest {
  password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface DeleteProjectResponse {
  message: string;
}

export interface WorkspaceResponse {
  data: Array<{
    uuid: string;
    name: string;
    userUuid?: string;
  }>;
  message: string;
  statusCode?: string;
}

export interface ProjectDetailResponse {
  uuid: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  userUuid?: string;
}

export const projectSettingsApi = createApi({
  reducerPath: "projectSettingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: headers => {
      headers.set("Content-Type", "application/json");

      // Remove async call to getSession - let the API routes handle authentication
      // This prevents blocking the headers preparation
      return headers;
    },
  }),
  tagTypes: ["Project", "Workspace", "User"],
  endpoints: builder => ({
    // Rename Project - using PATCH to update project directly
    renameProject: builder.mutation<
      RenameProjectResponse,
      {
        projectUuid: string;
        projectName: string;
        description?: string;
      }
    >({
      query: ({ projectUuid, projectName, description }) => ({
        url: `/projects/${projectUuid}`,
        method: "PATCH",
        body: { projectName, description },
      }),
      invalidatesTags: ["Project"],
    }),

    // Delete Project - matches Postman endpoint
    deleteProject: builder.mutation<DeleteProjectResponse, string>({
      query: projectUuid => ({
        url: `/projects/${projectUuid}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    // Change Password - matches Postman endpoint
    changePassword: builder.mutation<
      ChangePasswordResponse,
      {
        userUuid: string;
        password: string;
      }
    >({
      query: ({ userUuid, password }) => ({
        url: `/users/${userUuid}/change-password`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),

    // Get Workspaces - matches Postman endpoint
    getWorkspaces: builder.query<WorkspaceResponse, void>({
      query: () => "/workspaces",
      providesTags: ["Workspace"],
    }),

    // Get Current User (if needed for project settings)
    getCurrentUser: builder.query<
      { uuid: string; email: string; username: string },
      void
    >({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
  }),
});

// Export hooks for components to use
export const {
  useRenameProjectMutation,
  useDeleteProjectMutation,
  useChangePasswordMutation,
  useGetWorkspacesQuery,
  useGetCurrentUserQuery,
} = projectSettingsApi;
