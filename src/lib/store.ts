// import { configureStore } from "@reduxjs/toolkit";
// import { schemaApi } from "@/service/apiSlide/schemaApi";
// import { rowsApi } from "@/components/service/apiSlide/rowsApi";

// export const store = configureStore({
//   reducer: {
//     [schemaApi.reducerPath]: schemaApi.reducer,
//     [rowsApi.reducerPath]: rowsApi.reducer,   // ✅ add this
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//       .concat(schemaApi.middleware)
//       .concat(rowsApi.middleware),             // ✅ add this
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
