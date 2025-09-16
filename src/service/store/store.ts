import { authApi } from "@/app/store/api/authApi";
import { projectApi } from "@/service/project/projectApi";
import { schemaApi } from "@/service/apiSlide/schemaApi";
import { dataSourceApi } from "@/service/apiSlide/dataSourceApi";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
// import { authApi } from "../../store/api/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [schemaApi.reducerPath]: schemaApi.reducer,
    [dataSourceApi.reducerPath]: dataSourceApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(projectApi.middleware)
      .concat(schemaApi.middleware)
      .concat(dataSourceApi.middleware),
});

setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
