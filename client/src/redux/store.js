import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import UserReducer from "./userSlice.js";
import OrderReducer from "./orderSlice.js"
import storage from "redux-persist/lib/storage";
import locationReducer from "./locationSlice";

const rootReducer = combineReducers({
  user: UserReducer,
  order: OrderReducer,
  location: locationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "order","location"],
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
