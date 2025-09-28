// src/app/browse/page.js
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
  setCollege,
} from "@/redux/browseSlice";
import { categoriesData } from "@/constants/categories";

// --- ✅ IMPORT THE NEW CARD COMPONENT ---
import ProductCard from "@/components/helper/ProductCard";

// ✨ 1. Import motion and AnimatePresence from Framer Motion
import { motion, AnimatePresence } from "framer-motion";

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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import PageLoader from "@/components/helper/PageLoader";

// ✨ 2. Define animation variants for the grid container
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // This creates the cool cascading effect
    },
  },
};

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
    college,
    page,
    productsPerPage,
    total,
  } = useSelector((state) => state.productBrowse);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [search, sort, category, listingType, priceMin, priceMax, college, page, dispatch]);

  const totalPages =
    productsPerPage && total ? Math.ceil(total / productsPerPage) : 1;

  const SidebarFilters = (
    <Card className="shadow-md border border-gray-200 h-full">
      <CardHeader>
        <h2 className="text-xl font-bold text-purple-600">Filters</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <Select value={category || "all"} onValueChange={(val) => dispatch(setCategory(val === "all" ? "" : val))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              <SelectItem value="all">All</SelectItem>
              {categoriesData.map((cat) => (
                <SelectItem key={cat.id} value={cat.title}>{cat.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Listing Type</label>
          <Select value={listingType || "any"} onValueChange={(val) => dispatch(setListingType(val === "any" ? "" : val))}>
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
        <div>
          <label className="text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex space-x-2">
            <Input type="number" placeholder="Min" value={priceMin ?? ""} className="w-1/2" onChange={(e) => dispatch(setPriceRange({ min: e.target.value, max: priceMax }))} />
            <Input type="number" placeholder="Max" value={priceMax ?? ""} className="w-1/2" onChange={(e) => dispatch(setPriceRange({ min: priceMin, max: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">College</label>
          <Input type="text" placeholder="Enter college name" value={college || ""} onChange={(e) => dispatch(setCollege(e.target.value))} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-16 flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-64 hidden lg:block p-4"
      >
        {SidebarFilters}
      </motion.aside>

      <div className="flex-1 p-4 lg:p-6">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
          className="text-3xl font-bold text-purple-600 mb-6 text-center lg:text-left"
        >
          Browse Products
        </motion.h1>

        {/* Top controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 w-full">
            <div className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2">
                <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="text-purple-600 border-purple-600">
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
                <div className="flex flex-1 gap-2 items-center min-w-0">
                <Input placeholder="Search products..." value={search} onChange={(e) => dispatch(setSearch(e.target.value))} className="flex-1 min-w-0 border-purple-500 focus:border-purple-600 focus:ring-purple-300" />
                <Select value={sort || "latest"} onValueChange={(val) => dispatch(setSort(val))}>
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

        {/* Products grid and states */}
        <AnimatePresence mode="wait">
          {status === "loading" ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center h-64"><PageLoader /></motion.div>
          ) : status === "failed" ? (
            <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-red-500">Error: {error}</motion.p>
          ) : products.length === 0 ? (
            <motion.p key="no-products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-500 mt-10">No products found matching your criteria.</motion.p>
          ) : (
             // ✨ 3. Apply the grid container variants here
            <motion.div
              key={page + sort + category + listingType + college} // ✨ 4. CRITICAL: This key remounts the component to re-trigger the animation on filter change
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products
                .filter((product) => product.isActive)
                .map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button size="sm" disabled={page <= 1} onClick={() => page > 1 && dispatch(setPage(page - 1))} className="bg-purple-500 text-white hover:bg-purple-600">
              Prev
            </Button>
            <span className="px-3 py-1 font-semibold">{page} / {totalPages}</span>
            <Button size="sm" disabled={page >= totalPages} onClick={() => page < totalPages && dispatch(setPage(page + 1))} className="bg-purple-500 text-white hover:bg-purple-600">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseWithSidebar;