import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tag {
    id: string;
    name: string;
    createdAt: string;
}

export interface Note {
    id: string;
    stt: string;
    createdAt: string;
    tagId?: string;
}

export interface TagState {
    tags: Tag[];
    notes: Note[];
    selectedTag: Tag | null;
    loading: boolean;
    notesLoading: boolean;
    error: string | null;
}

const TOKEN_KEY = 'auth_token';

const initialState: TagState = {
    tags: [],
    notes: [],
    selectedTag: null,
    loading: false,
    notesLoading: false,
    error: null,
};

// Async thunk to fetch tags
export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    async () => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || '',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tags');
        }

        const data: Tag[] = await response.json();
        return data;
    }
);

// Async thunk to fetch notes by tag
export const fetchNotesByTag = createAsyncThunk(
    'tags/fetchNotesByTag',
    async (tagId: string) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/notes/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || '',
            },
            body: JSON.stringify({
                tagId: tagId,
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

// Async thunk to create a new tag
export const createTag = createAsyncThunk(
    'tags/createTag',
    async (tagData: { name: string; description: string }) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token || '',
            },
            body: JSON.stringify(tagData),
        });

        if (!response.ok) {
            throw new Error('Failed to create tag');
        }

        const data: Tag = await response.json();
        return data;
    }
);

const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedTag: (state, action: PayloadAction<Tag | null>) => {
            state.selectedTag = action.payload;
        },
        clearNotes: (state) => {
            state.notes = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch tags
            .addCase(fetchTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tags';
            })
            // Fetch notes by tag
            .addCase(fetchNotesByTag.pending, (state) => {
                state.notesLoading = true;
                state.error = null;
            })
            .addCase(fetchNotesByTag.fulfilled, (state, action) => {
                state.notesLoading = false;
                state.notes = action.payload;
            })
            .addCase(fetchNotesByTag.rejected, (state, action) => {
                state.notesLoading = false;
                state.error = action.error.message || 'Failed to fetch notes';
            })
            // Create tag
            .addCase(createTag.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTag.fulfilled, (state, action) => {
                state.loading = false;
                state.tags.push(action.payload);
            })
            .addCase(createTag.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create tag';
            });
    },
});

export const { clearError, setSelectedTag, clearNotes } = tagSlice.actions;
export default tagSlice.reducer;
