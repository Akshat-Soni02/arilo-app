import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubscriptionInfo {
    planName: string;
    noteDailyLimit: number;
    noteMonthlyLimit: number;
}

export interface UserInfo {
    id?: string;
    email: string;
    name: string;
    photo?: string;
    subscription: SubscriptionInfo;
}

interface AuthResponse {
    token: string;
    type: string;
    userId: string;
    email: string;
    name: string;
    profilePictureUrl: string;
    subscription: SubscriptionInfo;
}

interface UserState {
    userInfo: UserInfo | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userInfo: null,
    loading: false,
    error: null,
};

export const loginWithGoogle = createAsyncThunk(
    'user/loginWithGoogle',
    async (idToken: string) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Authentication failed');
        }

        const data: AuthResponse = await response.json();
        return data;
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },
        clearUserInfo: (state) => {
            state.userInfo = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithGoogle.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = {
                    id: action.payload.userId,
                    email: action.payload.email,
                    name: action.payload.name,
                    photo: action.payload.profilePictureUrl,
                    subscription: {
                        planName: action.payload.subscription.planName,
                        noteDailyLimit: action.payload.subscription.noteDailyLimit,
                        noteMonthlyLimit: action.payload.subscription.noteMonthlyLimit,
                    },
                };
            })
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            });
    },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;

