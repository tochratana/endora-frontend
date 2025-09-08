import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    prepareHeaders: async headers => {
      // Do not access tokens on the client — refresh tokens are server-side only.
      // For server-to-server calls, use a dedicated proxy endpoint that attaches the access token.
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: builder => ({
    getCurrentUser: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    register: builder.mutation<User, RegisterData>({
      query: userData => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    createProject: builder.mutation<
      unknown,
      { projectName: string; description?: string }
    >({
      query: payload => ({
        url: "/proxy/projects",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useRegisterMutation,
  useCreateProjectMutation,
} = authApi;
