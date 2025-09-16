import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const createApiSlide = createApi({
  reducerPath: "createApiSlide",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE}` }),
  endpoints: builder => ({}),
});
