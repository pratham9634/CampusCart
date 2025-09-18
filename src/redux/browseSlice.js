import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: "",
  category: "",
  sort: "latest",  // or "oldest", etc.
  listingType: "", // new/used etc
  priceMin: null,
  priceMax: null,
  page: 1,
  itemsPerPage: 12,

};

export const browseSlice = createSlice({
  name: "browse",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setListingType(state, action) {
      state.listingType = action.payload;
      state.page = 1;
    },
    setPriceRange(state, action) {
      const { min, max } = action.payload;
      state.priceMin = min;
      state.priceMax = max;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    resetFilters(state) {
      state.search = "";
      state.category = "";
      state.sort = "latest";
      state.listingType = "";
      state.priceMin = null;
      state.priceMax = null;
      state.page = 1;
    }
  }
});

export const {
  setSearch,
  setCategory,
  setSort,
  setListingType,
  setPriceRange,
  setPage,
  resetFilters
} = browseSlice.actions;


export default browseSlice.reducer