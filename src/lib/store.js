import { configureStore } from '@reduxjs/toolkit'
import browseReducer  from '../redux/browseSlice'
export const store = configureStore({
    reducer: {
        browse : browseReducer,
    },
})