"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUserById } from "@/lib/clerk"; // Assuming this function exists

const ProductDetails = ({ product }) => {
  const [seller, setSeller] = useState(null);
  // State to manage the currently displayed image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Early return if there are no images to prevent errors
  const images = product.images || [];

  // Handlers for next and previous images
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Fetch seller info client-side
  useEffect(() => {
    if (product?.createdBy) {
      const fetchSeller = async () => {
        try {
          const data = await getUserById(product.createdBy);
          setSeller(data);
        } catch (err) {
          console.error("Failed to fetch seller info:", err);
        }
      };
      fetchSeller();
    }
  }, [product?.createdBy]);

  // Determine the price to display based on product type
  const displayPrice =
    product.type === "auction" && product.highestBid?.amount > 0
      ? product.highestBid.amount
      : product.price;

  return (
    <section className="max-w-6xl mx-auto mt-20 p-6 md:p-12 flex flex-col md:flex-row gap-10">
      {/* Left: Product Images (Redesigned with full functionality) */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="w-full max-w-md h-[400px] md:h-[500px] relative rounded-xl overflow-hidden shadow-lg group">
          <Image
            src={images[currentIndex] || "/default_items.webp"} // Display current image
            alt={`${product.title} - image ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out"
            priority={true} // Prioritize loading the main image
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-800 hover:bg-white transition opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-800 hover:bg-white transition opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex justify-center gap-3 mt-4 w-full max-w-md">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer hover:opacity-80 transition ${
                  currentIndex === idx ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info (Unchanged) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.category && (
            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              {product.category}
            </span>
          )}
          {product.condition && (
            <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
              {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
            </span>
          )}
          {product.type === 'auction' && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Auction
            </span>
          )}
        </div>

        {/* Price & Bid Info */}
        <div className="mt-2">
          <p className="text-4xl font-extrabold text-gray-800">
            ₹{displayPrice?.toLocaleString() || "N/A"}
            {product.type === 'auction' && (
              <span className="text-gray-500 text-base font-normal ml-2">
                Current bid
              </span>
            )}
          </p>
        </div>

        {/* Description */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-lg text-gray-700">{product.description || "No description provided."}</p>
        </div>
        
        {/* Location */}
        {product.college && (
          <div className="mt-2">
            <p className="text-gray-600 text-base">
              <span className="font-semibold">Location:</span> {product.college}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {product.type === "auction" && (
            <button className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition">
              Place Bid
            </button>
          )}
           {product.type === "sale" && (
            <button className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
              Buy Now
            </button>
          )}
          <button className="flex-1 border border-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-100 transition">
            Message Seller
          </button>
        </div>

        {/* Seller Info */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold mb-3">Seller Information</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium text-gray-800">{seller?.firstName || "Loading..."} {seller?.lastName || ""}</p>
              <p className="text-gray-500 text-sm">
                Member since{" "}
                {seller?.createdAt
                  ? new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : "N/A"}
              </p>
            </div>
            <button className="bg-black text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.892 8.892 0 01-4.13-1.037l-.993 1.49a1 1 0 01-1.533-.864v-1.64C2.12 13.963 1 12.08 1 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.707 11.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L7 12.586l-1.293-1.293z" clipRule="evenodd" />
              </svg>
              Ask in Chat
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;