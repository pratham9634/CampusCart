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
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
    page,
    productsPerPage,
    total,
  } = useSelector((state) => state.productBrowse);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [search, sort, category, listingType, priceMin, priceMax, page, dispatch]);

  const totalPages =
    productsPerPage && total ? Math.ceil(total / productsPerPage) : 1;

  const SidebarFilters = (
    <Card className="shadow-md border border-gray-200 h-full">
      <CardHeader>
        <h2 className="text-xl font-bold text-purple-600">Filters</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort by</label>
          <Select value={sort} onValueChange={(val) => dispatch(setSort(val))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="low-to-high">Price: Low → High</SelectItem>
              <SelectItem value="high-to-low">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <Select value={category} onValueChange={(val) => dispatch(setCategory(val))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              <SelectItem value="">All</SelectItem>
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
          <label className="block text-sm font-medium text-gray-700">Listing Type</label>
          <Select
            value={listingType}
            onValueChange={(val) => dispatch(setListingType(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="new">Buy</SelectItem>
              <SelectItem value="used">Bid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium text-gray-700">Price Range</label>
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
      </CardContent>
    </Card>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="w-64 hidden lg:block p-4">{SidebarFilters}</aside>

      {/* Mobile Sidebar (hamburger) */}
      <div className="lg:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 w-72">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {SidebarFilters}
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 lg:p-6">
        {status === "loading" ? (
          <p className="text-center">Loading products...</p>
        ) : status === "failed" ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : products.length === 0 ? (
          <p className="text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product._id || product.id}
                href={`/product/${product._id || product.id}`}
              >
                <Card className="hover:shadow-lg transition transform hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative w-full h-36">
                      <Image
                        src={product.images?.[0] || "/default_items.webp"}
                        alt={product.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-1 p-3">
                    <h3 className="font-semibold text-md text-purple-600 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold text-gray-800">
                        ₹{product.price}
                      </p>
                      {product.listingType === "new" ? (
                        <Button
                          size="sm"
                          className="bg-purple-500 text-white hover:bg-purple-600"
                        >
                          Buy
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-orange-500 text-white hover:bg-orange-600"
                        >
                          Bid
                        </Button>
                      )}
                    </div>
                  </CardFooter>
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
          >
            Prev
          </Button>
          <span className="px-3 py-1">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            disabled={page >= totalPages}
            onClick={() => page < totalPages && dispatch(setPage(page + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrowseWithSidebar;
