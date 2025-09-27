"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setSearch,
  setCategory,
  setSort,
  setListingType,
  setPage,
  setPriceRange,
  setCollege, // ✅ new import
} from "@/redux/browseSlice";
import { categoriesData } from "@/constants/categories";
import Link from "next/link";
import Image from "next/image";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import PageLoader from "@/components/helper/PageLoader";

const BrowseWithSidebar = () => {
  const dispatch = useDispatch();
  const {
    products,
    status,
    error,
    search,
    sort,
    category,
    listingType,
    priceMin,
    priceMax,
    college, // ✅ new
    page,
    productsPerPage,
    total,
  } = useSelector((state) => state.productBrowse);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [
    search,
    sort,
    category,
    listingType,
    priceMin,
    priceMax,
    college,
    page,
    dispatch,
  ]); // ✅ added college

  const totalPages =
    productsPerPage && total ? Math.ceil(total / productsPerPage) : 1;

  // Sidebar filters
  const SidebarFilters = (
    <Card className="shadow-md border border-gray-200 h-full">
      <CardHeader>
        <h2 className="text-xl font-bold text-purple-600">Filters</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <Select
            value={category || "all"}
            onValueChange={(val) =>
              dispatch(setCategory(val === "all" ? "" : val))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              <SelectItem value="all">All</SelectItem>
              {categoriesData.map((cat) => (
                <SelectItem key={cat.id} value={cat.title}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Listing Type
          </label>
          <Select
            value={listingType || "any"}
            onValueChange={(val) =>
              dispatch(setListingType(val === "any" ? "" : val))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="sale">Buy</SelectItem>
              <SelectItem value="auction">Auction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Price Range
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceMin ?? ""}
              className="w-1/2"
              onChange={(e) =>
                dispatch(setPriceRange({ min: e.target.value, max: priceMax }))
              }
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceMax ?? ""}
              className="w-1/2"
              onChange={(e) =>
                dispatch(setPriceRange({ min: priceMin, max: e.target.value }))
              }
            />
          </div>
        </div>

        {/* College Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            College
          </label>
          <Input
            type="text"
            placeholder="Enter college name"
            value={college || ""}
            onChange={(e) => dispatch(setCollege(e.target.value))}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="w-64 hidden lg:block p-4">{SidebarFilters}</aside>

      {/* Main content */}
      <div className="flex-1 p-4 lg:p-6">
        {/* Page title */}
        <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center lg:text-left">
          Browse Products
        </h1>

        {/* Top controls: Search + Sort + Mobile Hamburger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 w-full">
          <div className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2">
            {/* Mobile sidebar button */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-purple-600 border-purple-600"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4 w-72">
                  <SheetHeader>
                    <SheetTitle className="text-purple-600">Filters</SheetTitle>
                  </SheetHeader>
                  {SidebarFilters}
                </SheetContent>
              </Sheet>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-1 gap-2 items-center min-w-0">
              {/* Search */}
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="flex-1 min-w-0 border-purple-500 focus:border-purple-600 focus:ring-purple-300"
              />

              {/* Sort */}
              <Select
                value={sort || "latest"}
                onValueChange={(val) => dispatch(setSort(val))}
              >
                <SelectTrigger className="w-40 border-purple-500 focus:border-purple-600 focus:ring-purple-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="low-to-high">Price: Low → High</SelectItem>
                  <SelectItem value="high-to-low">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products grid */}
        {status === "loading" ? (
          <div className="flex justify-center items-center h-64">
            <PageLoader />
          </div>
        ) : status === "failed" ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => product.isActive)
              .map((product) => (
                <Link
                  key={product._id || product.id}
                  href={`/product/${product._id || product.id}`}
                >
                  <Card className="flex flex-col w-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    {/* Product Image */}
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/default_items.webp"}
                        alt={product.title}
                        fill
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Modern Auction Badge */}
                      {product?.type === "auction" && (
                        <div className="absolute z-10 top-3 right-3 px-3 py-1 rounded-full bg-red-400/80 backdrop-blur-sm text-white text-xs font-semibold animate-bounce">
                          🔥 Auction
                        </div>
                      )}
                    </div>

                    {/* Product Info Wrapper */}
                    <div className="flex flex-col flex-1 p-4">
                      {/* Tags: Category & College */}
                      <div className="flex items-center gap-2 mb-2">
                        {product.category && (
                          <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                            {product.category}
                          </span>
                        )}
                        {product.college && (
                          <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-medium rounded-full truncate">
                            🎓 {product.college}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-2 leading-tight">
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-500 text-sm line-clamp-1 mt-1">
                        {product.description || "No description available."}
                      </p>

                      {/* Price & Bid Info */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-orange-600">
                          {product.type === "auction" &&
                          product.highestBid?.amount > 0
                            ? `₹${product.highestBid.amount.toLocaleString()}`
                            : `₹${product.price?.toLocaleString() || "N/A"}`}
                        </span>
                        {product.type === "auction" && (
                          <span className="text-sm font-medium text-slate-500">
                            {product.highestBid?.amount > 0
                              ? "Current Bid"
                              : "Starting Bid"}
                          </span>
                        )}
                      </div>

                      {/* Spacer to push button and time to the bottom */}
                      <div className="flex-1" />

                      {/* Time Posted */}
                      <p className="text-slate-400 text-xs text-right mt-4">
                        Posted{" "}
                        {product.createdAt
                          ? `${Math.floor(
                              (new Date() - new Date(product.createdAt)) /
                                (1000 * 60 * 60 * 24)
                            )}d ago`
                          : "N/A"}
                      </p>

                      {/* View Product Button */}
                      <Button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2.5 transition-colors">
                        View Product
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            size="sm"
            disabled={page <= 1}
            onClick={() => page > 1 && dispatch(setPage(page - 1))}
            className="bg-purple-500 text-white hover:bg-purple-600"
          >
            Prev
          </Button>
          <span className="px-3 py-1 font-semibold">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            disabled={page >= totalPages}
            onClick={() => page < totalPages && dispatch(setPage(page + 1))}
            className="bg-purple-500 text-white hover:bg-purple-600"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrowseWithSidebar;
