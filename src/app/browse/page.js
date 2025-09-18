
"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setSearch,
  setCategory,
  setSort,
  setListingType,
  setPriceRange,
  setPage,
} from "@/redux/browseSlice";
import Link from "next/link";
import { categoriesData } from "@/constants/categories";  // your categories
import Image from "next/image";

export default function Page() {
  const dispatch = useDispatch();
  const {
    search,
    category,
    sort,
    listingType,
    priceMin,
    priceMax,
    page,
    productsPerPage,
    products,
    total,
    status,
    error,
  } = useSelector((state) => state.productBrowse);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [search, category, sort, listingType, priceMin, priceMax, page, dispatch]);

  const totalPages = Math.ceil(total / productsPerPage);

  return (
    <div className="px-6 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 text-center mb-8">
        Browse Products
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <select
          value={category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          {categoriesData.map((cat) => (
            <option key={cat.id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="low-to-high">Price: Low → High</option>
          <option value="high-to-low">Price: High → Low</option>
        </select>

        <select
          value={listingType}
          onChange={(e) => dispatch(setListingType(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="new">Sale</option>
          <option value="used">Auction</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={priceMin ?? ""}
          onChange={(e) =>
            dispatch(setPriceRange({ min: e.target.value, max: priceMax }))
          }
          className="px-4 py-2 border rounded-lg w-24"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax ?? ""}
          onChange={(e) =>
            dispatch(setPriceRange({ min: priceMin, max: e.target.value }))
          }
          className="px-4 py-2 border rounded-lg w-24"
        />
      </div>

      {/* Products Grid */}
      {status === "loading" ? (
        <p className="text-center">Loading...</p>
      ) : status === "failed" ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="block"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                <Image
                  src={product.images?.[0] || "/default_items.webp"}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={300}
                />
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-purple-600 hover:text-orange-500 transition-colors">
                    {product.title}
                  </h2>
                  <p className="text-gray-500 mt-1">{product.category}</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => {
            if (page > 1) dispatch(setPage(page - 1));
          }}
          disabled={page <= 1}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => {
            if (page < totalPages) dispatch(setPage(page + 1));
          }}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
