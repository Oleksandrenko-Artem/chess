import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, findUserAccount, updateUser, findAllUsers } from '../api';
import { fulfilledCase, pendingCase, rejectedCase } from './functions';

export const updateUserThunk = createAsyncThunk('users/updateUserThunk', async ({ id, values }, thunkAPI) => {
    try {
        const response = await updateUser(id, values);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});
export const logoutUserThunk = createAsyncThunk('users/logoutUserThunk', async () => {
    localStorage.removeItem('token');
});
export const findAllUsersThunk = createAsyncThunk('users/findAllUsers', async (values, thunkAPI) => {
    try {
        const response = await findAllUsers(values);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});
export const findUserAccountThunk = createAsyncThunk('users/findUserAccount', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return thunkAPI.rejectWithValue('No token');
        }
        const response = await findUserAccount();
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});
export const loginUserThunk = createAsyncThunk('users/loginUserThunk', async (values, thunkAPI) => {
    try {
        const response = await loginUser(values);
        localStorage.setItem('token', response.data.data.token);
        return response.data.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});
export const registerUserThunk = createAsyncThunk('users/registerUserThunk', async (values, thunkAPI) => {
    try {
        const response = await registerUser(values);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.message);
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
        users: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => { 
        builder.addCase(registerUserThunk.pending, pendingCase);
        builder.addCase(registerUserThunk.fulfilled, fulfilledCase);
        builder.addCase(registerUserThunk.rejected, rejectedCase);
        builder.addCase(loginUserThunk.pending, pendingCase);
        builder.addCase(loginUserThunk.fulfilled, fulfilledCase);
        builder.addCase(loginUserThunk.rejected, rejectedCase);
        builder.addCase(findUserAccountThunk.pending, pendingCase);
        builder.addCase(findUserAccountThunk.fulfilled, fulfilledCase);
        builder.addCase(findUserAccountThunk.rejected, rejectedCase);

        builder.addCase(findAllUsersThunk.pending, pendingCase);
        builder.addCase(findAllUsersThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.users = action.payload;
        });
        builder.addCase(findAllUsersThunk.rejected, rejectedCase);
        builder.addCase(logoutUserThunk.fulfilled, (state) => {
            state.user = null;
            state.error = null;
            state.isLoading = false;
        });
        builder.addCase(updateUserThunk.pending, pendingCase);
        builder.addCase(updateUserThunk.fulfilled, fulfilledCase);
        builder.addCase(updateUserThunk.rejected, rejectedCase);
    },
});

export default usersSlice.reducer;