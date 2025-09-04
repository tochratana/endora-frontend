import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductResponse } from "@/types/product";

export const createApiSlide = createApi({
  reducerPath: "createApiSlide",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.api-ngin.oudom.dev" }),
  endpoints: builder => ({
    createProject : builder.mutation<ProductResponse, void>({
      query: () => ({
        url: "/projects",
        method: "POST",
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = createApiSlide;
