
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching products from API
export const fetchProducts = createAsyncThunk(
  "productBrowse/fetchProducts",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const {
      search, category, sort, listingType, priceMin, priceMax, page, productsPerPage
    } = state.productBrowse;

    // Build query string
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (listingType) params.set("listingType", listingType);
    if (priceMin != null && priceMin !== "") params.set("priceMin", priceMin);
    if (priceMax != null && priceMax !== "") params.set("priceMax", priceMax);
    params.set("page", page);
    params.set("limit", productsPerPage);

    const response = await fetch(`/api/items?${params.toString()}`);
    const data = await response.json();
    // Expect API returns { products: [...], total: number }
    return data;
  }
);

const productBrowseSlice = createSlice({
  name: "productBrowse",
  initialState: {
    search: "",
    category: "",
    sort: "latest",
    listingType: "",    // e.g. auction,sale
    priceMin: null,
    priceMax: null,
    page: 1,
    productsPerPage: 12,
    products: [],
    total: 0,
    status: "idle",     // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const {
  setSearch,
  setCategory,
  setSort,
  setListingType,
  setPriceRange,
  setPage,
  resetFilters,
} = productBrowseSlice.actions;

export default productBrowseSlice.reducer;
