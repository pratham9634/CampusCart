import { configureStore } from '@reduxjs/toolkit'
import productBrowseReducer  from '../redux/browseSlice'
export const store = configureStore({
    reducer: {
         productBrowse: productBrowseReducer,
    },
})