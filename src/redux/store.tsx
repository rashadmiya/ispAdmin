
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage";
import redusers from "./reducers";
import { persistStore } from "redux-persist";



const middlware = (getDefaultMiddleware: (arg0: { serializableCheck: boolean; }) => any) =>
    getDefaultMiddleware({
        serializableCheck: false
    })


const persisConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persisConfig, redusers);

export const ReduxStore = () => {
    let store = configureStore({ 
        reducer: persistedReducer,
        middleware: middlware 
    });
    let persistor = persistStore(store);
    return { store, persistor }
}