import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskStatus = 'IN_PROGRESS' | 'DELETED' | 'DONE';

export interface Task {
    id: string;
    task: string;
    status: TaskStatus;
    createdAt: string;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    filter: TaskStatus | 'ALL';
    searchQuery: string;
}
const TOKEN_KEY = 'auth_token';

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    filter: 'ALL',
    searchQuery: '',
};

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (filter?: TaskStatus) => {
        const baseUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/tasks`;
        const url = filter ? `${baseUrl}?filter=${filter}` : baseUrl;
        const token = await AsyncStorage.getItem(TOKEN_KEY);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        const data: Task[] = await response.json();
        return data;
    }
);

// Async thunk to update a task
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ taskId, updates }: { taskId: string; updates: { task?: string; status?: TaskStatus } }) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const data: Task = await response.json();
        return data;
    }
);

// Async thunk to delete a task
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (taskId: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token || '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        return taskId;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<TaskStatus | 'ALL'>) => {
            state.filter = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            // Update task
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update task';
            })
            // Delete task
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete task';
            });
    },
});

export const { setFilter, setSearchQuery, clearError } = taskSlice.actions;
export default taskSlice.reducer;
