import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
    data: localStorage.getItem('data') !== "undefined" ? JSON.parse(localStorage.getItem('data')) : {},
    tcData: localStorage.getItem('tcData') !== "undefined" ? JSON.parse(localStorage.getItem('tcData')) : {},
};

export const createAccount = createAsyncThunk('/user/register', async (data) => {
    try {
        let res = axiosInstance.post('user/register', data);

        res = await res;
        toast.success(res.data.message)

        return res.data;
    } catch (e) {
        toast.error(e?.response?.data?.message);
        throw e;
    }
});

export const loginAccount = createAsyncThunk('/user/login', async (data) => {
    try {
        let res = axiosInstance.post('/user/login', data);

        res = await res;
        toast.success(res.data.message)
        return res.data;
    } catch (e) {
        toast.error(e?.response?.data?.message);

        throw e;

    }
});

export const logout = createAsyncThunk('/user/logout', async () => {
    try {
        let res = axiosInstance.get('/user/logout');

        res = await res;
        return res.data;
    } catch (e) {
        return e?.response?.data?.message;

    }
});

export const userProfile = createAsyncThunk('/user/details', async () => {
    try {
        const res = axiosInstance.get(`/user/me`);
        return (await res).data;
    } catch (e) {
        toast.error(e?.message);
        throw e;
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginAccount.fulfilled, (state, action) => {
                localStorage.setItem('data', JSON.stringify(action?.payload?.validUser));
                if (action?.payload?.success) {
                    localStorage.setItem('isLoggedIn', true);
                    state.isLoggedIn = true;
                }
                state.data = action?.payload?.validUser;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                localStorage.setItem('data', JSON.stringify(action.payload.user));
                localStorage.setItem('isLoggedIn', true);
                state.isLoggedIn = true;
                state.data = action.payload.user;
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.data = {};
                state.isLoggedIn = false;
                state.role = "";
            })
            .addCase(userProfile.fulfilled, (state, action) => {
                localStorage.setItem('data', JSON.stringify(action.payload.user));
                localStorage.setItem('isLoggedIn', true);
                state.isLoggedIn = true;
                state.data = action.payload.user;
            })
    }
});

export default authSlice.reducer;