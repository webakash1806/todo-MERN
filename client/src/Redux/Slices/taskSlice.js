import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from '../../Helper/axiosInstance';

const initialState = {
    taskData: localStorage.getItem('taskData') !== "undefined" ? JSON.parse(localStorage.getItem('taskData')) : {},
};

export const addTask = createAsyncThunk('/task/add', async (data) => {
    try {
        let res = axiosInstance.post('task/add', data);

        res = await res;
        toast.success(res.data.message)

        return res.data;
    } catch (e) {
        toast.error(e?.response?.data?.message);
        throw e;
    }
});

export const getAllTask = createAsyncThunk('/task', async () => {
    try {
        let res = axiosInstance.get('/task',);

        res = await res;
        // toast.success(res.data.message)
        return res.data;
    } catch (e) {

        return e?.response?.data?.message;
    }
});

export const deleteTask = createAsyncThunk('/task/delete', async (id) => {
    try {
        let res = axiosInstance.delete(`/task/${id}`);

        res = await res;
        return res.data;
    } catch (e) {
        return e?.response?.data?.message;

    }
});

export const updateTask = createAsyncThunk('/task/update', async (data) => {
    try {
        let res = axiosInstance.put(`/task/${data?.id}`, data);

        res = await res;
        return res.data;
    } catch (e) {
        return e?.response?.data?.message;

    }
});

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTask.fulfilled, (state, action) => {
                localStorage.setItem('taskData', JSON.stringify(action?.payload?.data));
                state.taskData = action?.payload?.data;
            })

    }
});

export default taskSlice.reducer;