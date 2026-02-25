import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import themeReducer from "./slice/themeSlice";
import habitsReducer from "./slice/habitsSlice";
import settingsReducer from "./slice/settingsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    habits: habitsReducer,
    settings: settingsReducer,
})

export default rootReducer;
