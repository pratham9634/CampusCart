"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Hero = () => {
    const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/browse?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
     <section className="w-full h-[90vh] mt-15 flex items-center justify-center px-6 bg-gradient-to-br from-blue-100 via-violet-100 to-blue-100">
           {/* Gradient Balls */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-tr from-purple-300 via-pink-300 to-blue-300 rounded-full opacity-80 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 rounded-full opacity-70 blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-gradient-to-r from-green-200 via-teal-200 to-blue-200 rounded-full opacity-80 blur-2xl animate-pulse"></div>
        <div className="flex flex-col md:flex-row items-center max-w-6xl w-full gap-8">
          {/* Left side - Text content */}
          <div className="md:w-2/3 text-center md:text-left space-y-4 px-4">
      {/* Heading with gradient text */}
    <h1 className="text-xl  md:text-4xl   text-center md:text-left leading-snug">
  <span className="block   bg-gradient-to-r font-semibold tracking-tight from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
    Welcome to the world of
  </span>
  <span className="block ml-4 md:ml-10 sigmar bg-gradient-to-r font-extrabold from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
    CampusCart
  </span>
</h1>


      {/* Description */}
      <p className="text-gray-600 text-base md:text-lg">
        Explore and trade second-hand items within your campus community. Easy,
        fast, and secure – CampusCart connects students to a world of opportunities right at their fingertips.
      </p>

      {/* Search bar with icon and search button inside it */}
      <div className="relative w-full max-w-lg mx-auto sm:mx-0">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search items, categories..."
        className="pl-12 pr-28 py-5 rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <Search className="absolute left-4 top-2 text-gray-400" />
      <Button
        onClick={handleSearch}
        className="absolute right-1 top-0.5 bottom-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-full px-5 hover:opacity-90 transition-opacity"
      >
        Search
      </Button>
    </div>

      {/* Outer action buttons */}
      <div className="flex  gap-4 justify-center md:justify-start mt-6">
        <Button onClick={() => router.push("/browse")}
        className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
          Browse
        </Button>
        <Button onClick={() => router.push("/create")}
        className="text-xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
          Start Selling
        </Button>
      </div>
    </div>

          {/* Right side - Image */}
          <div className="w-1/2 border-none">
            <Image
              src="/cart.webp"
              width={750}
              height={500}
              alt="Students using marketplace"
              className="mx-2 md:mx-6"
            />
          </div>
        </div>
      </section>
  )
}

export default Hero