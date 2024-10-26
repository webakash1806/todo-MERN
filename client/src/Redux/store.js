import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from './Slices/authSlice'
import taskSliceReducer from './Slices/taskSlice'

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        task: taskSliceReducer

    },
    devTools: true
})

export default store