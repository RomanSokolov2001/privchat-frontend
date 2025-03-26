import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from "../utils/types";


interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Partial<User> | null>) => {
            if (action.payload === null) {
                state.user = null;
            } else if (state.user === null) {
                state.user = action.payload as User;
            } else {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
