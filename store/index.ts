import { configureStore } from '@reduxjs/toolkit';
import noteReducer from './slices/noteSlice';
import tagReducer from './slices/tagSlice';
import taskReducer from './slices/taskSlice';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        tasks: taskReducer,
        tags: tagReducer,
        notes: noteReducer,
        theme: themeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
