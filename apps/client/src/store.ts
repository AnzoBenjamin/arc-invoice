import { configureStore } from "@reduxjs/toolkit";
import reducers from "@/reducers/";
import { thunk } from "redux-thunk";

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types or paths
        ignoredActions: ['GET_INVOICE'], // Add the action type you're having issues with
        ignoredPaths: ['payload.businessDetails.headers'] // Specific non-serializable path
      }
    }).concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export default store;