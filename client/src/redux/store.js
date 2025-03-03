import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import UserReducer from "./userSlice.js";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  user: UserReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
