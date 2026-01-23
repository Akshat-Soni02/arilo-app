import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type NoteStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type NoteType = 'AUDIO' | 'TEXT';

export interface Note {
    noteId: string;
    noteType: NoteType;
    stt: string | null;
    jobId: string;
    status: NoteStatus;
    noteback: string | null;
    createdAt: string;
}

interface NoteState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}

const TOKEN_KEY = 'auth_token';

const initialState: NoteState = {
    notes: [],
    loading: false,
    error: null,
};

// Async thunk to fetch notes
export const fetchNotes = createAsyncThunk(
    'notes/fetchNotes',
    async () => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/notes/query`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || '',
            },
            body: JSON.stringify({
                order: 'ASC'
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const data: Note[] = await response.json();
        return data;
    }
);

const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearNotes: (state) => {
            state.notes = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch notes';
            });
    },
});

export const { clearError, clearNotes } = noteSlice.actions;
export default noteSlice.reducer;
