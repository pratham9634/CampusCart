"use client"; // Required for Next.js 13+ App Router

import Link from "next/link";
import { categoriesData } from "@/constants/categories";

const Category = () => {
  // Categories array inside the component file
 
  return (
  <section className="w-full px-6 py-24 bg-gray-50 text-center">
      <h1 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 mb-16">
        Explore Categories
        <span className="block w-32 h-1 mx-auto mt-4 bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 rounded-full animate-pulse"></span>
      </h1>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-8 max-w-8xl mx-auto">
        {categoriesData.map((category, index) => {
          const Icon = category.icon;

          return (
            <Link key={category.id} href={category.link} className="block">
              <div className={`bg-white p-2 rounded-2xl shadow-lg transition-all duration-500 cursor-pointer group transform hover:-translate-y-3 hover:shadow-2xl animate-float`}>
                
                {/* Icon */}
                <div className={`flex items-center justify-center mb-4 w-12 h-12 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto rounded-full bg-gray-100 group-hover:bg-gradient-to-r group-hover:${category.color} transition-all duration-1000`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-600 group-hover:text-white transition-colors  transform group-hover:scale-125 group-hover:rotate-12" />
                </div>

                {/* Title */}
                <h2 className={`text-sm md:text-lg font-bold text-purple-600 transition-colors duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${category.color} transition-all duration-500`}>
                  {category.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Category;
