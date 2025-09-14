import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Search } from "lucide-react";
import Image from "next/image";
import { steps } from "@/constants/work_step";

export default function Home() {
  return (
    <main className="flex flex-col h-full w-full p-1">
      {/* Hero Section */}
      <section className="w-full h-[90vh] mt-16 flex items-center justify-center px-6 bg-gradient-to-br from-blue-100 via-violet-100 to-blue-100">
           {/* Gradient Balls */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-tr from-purple-300 via-pink-300 to-blue-300 rounded-full opacity-80 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200 rounded-full opacity-70 blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-gradient-to-r from-green-200 via-teal-200 to-blue-200 rounded-full opacity-80 blur-2xl animate-pulse"></div>
        <div className="flex flex-col md:flex-row items-center max-w-6xl w-full gap-8">
          {/* Left side - Text content */}
          <div className="md:w-2/3 text-center md:text-left space-y-10 px-4">
      {/* Heading with gradient text */}
    <h1 className="text-4xl  md:text-5xl   text-center md:text-left leading-snug">
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
          placeholder="Search items, categories..."
          className="pl-12 pr-28 py-3 rounded-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400" />
        <Button className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-full px-5 hover:opacity-90 transition-opacity">
          Search
        </Button>
      </div>

      {/* Outer action buttons */}
      <div className="flex  gap-4 justify-center md:justify-start mt-6">
        <Button className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
          Browse
        </Button>
        <Button className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
          Start Selling
        </Button>
      </div>
    </div>

          {/* Right side - Image */}
          <div className="md:w-1/2 border-none">
            <Image
              src="/cart.webp"
              width={750}
              height={500}
              alt="Students using marketplace"
              className="mx-4 md:mx-6 lg:mx-32"
            />
          </div>
        </div>
      </section>

      {/* How It Work Section*/}
       <section className="w-full h-full  px-4 py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      
      {/* Heading */}
     <h1 className="text-4xl sigmar font-[900] text-center w-full mb-16 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 animate-text">
  How It Works
  <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full animate-pulse"></span>
</h1>



      
      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-xl shadow-md hover:scale-105 transition-transform hover:shadow-xl duration-300 p-6 w-full max-w-lg text-center group cursor-pointer"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 via-purple-500 to-orange-500 rounded-full flex items-center justify-center mb-6 text-white text-2xl">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-[800] mb-3  text-gray-800 group-hover:text-purple-600 transition-colors duration-500">
              {step.title}
            </h2>
            <p className="text-gray-600 text-md nunito ">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>

    

    </main>
  );
}
