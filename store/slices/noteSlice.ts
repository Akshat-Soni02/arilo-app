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

// Async thunk to upload audio note
export const uploadAudioNote = createAsyncThunk(
    'notes/uploadAudioNote',
    async (audioUri: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/notes/upload`;

        const formData = new FormData();
        formData.append('file', {
            uri: audioUri,
            type: 'audio/m4a',
            name: 'recording.m4a',
        } as any);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token || '',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload audio note');
        }

        const data = await response.json();
        return data;
    }
);

interface PollResponse {
    status: NoteStatus;
    error_message?: string;
    stt?: string | null;
    noteback?: string | null;
}

// Async thunk to poll note status
export const pollNoteStatus = createAsyncThunk(
    'notes/pollNoteStatus',
    async (jobId: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);

        const url = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/notes/poll?job_id=${jobId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token || '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to poll note status');
        }

        const data: PollResponse = await response.json();
        return { jobId, data };
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
        markNoteAsFailed: (state, action) => {
            const index = state.notes.findIndex(n => n.jobId === action.payload);
            if (index !== -1) {
                state.notes[index].status = 'FAILED';
            }
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
            })
            .addCase(uploadAudioNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadAudioNote.fulfilled, (state, action) => {
                state.loading = false;
                const newNote: Note = {
                    noteId: action.payload.job_id,
                    jobId: action.payload.job_id,
                    noteType: 'AUDIO',
                    status: 'PROCESSING',
                    stt: null,
                    noteback: null,
                    createdAt: new Date().toISOString(),
                };
                state.notes.unshift(newNote);
            })
            .addCase(uploadAudioNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to upload audio note';
            })
            .addCase(pollNoteStatus.fulfilled, (state, action) => {
                const { jobId, data } = action.payload;
                const noteIndex = state.notes.findIndex(n => n.jobId === jobId);

                if (noteIndex !== -1) {
                    state.notes[noteIndex] = {
                        ...state.notes[noteIndex],
                        status: data.status,
                        stt: data.stt ?? state.notes[noteIndex].stt,
                        noteback: data.noteback ?? state.notes[noteIndex].noteback,
                    };
                }
            });
    },
});

export const { clearError, clearNotes, markNoteAsFailed } = noteSlice.actions;
export default noteSlice.reducer;
