"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

// Helper function
const formatTimeLeft = (difference) => {
  // ✨ FIX 1: Add a check for NaN to prevent "NaNh NaNm left".
  if (isNaN(difference) || difference <= 0) return "Auction Ended";
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m ${Math.floor((difference / 1000) % 60)}s left`;
};

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

const ProductCard = React.forwardRef(({ product, variants }, ref) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  useEffect(() => {
    if (product.type !== "auction" || !product.auctionEndDate) {
      if(product.type === "auction") {
        setIsAuctionEnded(true);
        setTimeLeft("Auction Ended");
      }
      return;
    };

    const auctionEndUTC = new Date(product.auctionEndDate + 'Z');

    // ✨ FIX 2: Validate the date before starting the timer.
    if (isNaN(auctionEndUTC.getTime())) {
      setIsAuctionEnded(true);
      setTimeLeft("Auction Ended");
      return; // Exit if the date is invalid
    }

    const interval = setInterval(() => {
      const difference = auctionEndUTC.getTime() - Date.now();
      
      setTimeLeft(formatTimeLeft(difference));
      
      if (difference <= 0) {
        setIsAuctionEnded(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product.auctionEndDate, product.type]);

  return (
    <motion.div
      ref={ref}
      variants={variants || cardVariants}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link href={`/product/${product._id || product.id}`} className="block h-full">
        <Card className="flex flex-col py-2.5 w-full h-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
          {/* Product Image */}
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={product.images?.[0] || "/default_items.webp"}
              alt={product.title}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            {product?.type === "auction" && (
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute z-10 top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold"
              >
                🔥 Auction
              </motion.div>
            )}
          </div>

          {/* Product Info Wrapper */}
          <div className="flex flex-col px-3 ">
            <div className="flex items-center gap-2 mb-0.5">
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
            <h3 className="font-bold mt-1 text-lg text-slate-800 line-clamp-2 leading-tight">
              {product.title}
            </h3>
            <p className="text-slate-500 text-sm line-clamp-1">
              {product.description || "No description available."}
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-orange-600">
                {product.type === "auction" && product.highestBid?.amount > 0
                  ? `₹${product.highestBid.amount.toLocaleString()}`
                  : `₹${product.price?.toLocaleString() || "N/A"}`}
              </span>
              {product.type === "auction" && (
                <span className="text-sm font-medium text-slate-500">
                  {product.highestBid?.amount > 0 ? "Current Bid" : "Starting Bid"}
                </span>
              )}
            </div>
            <div className="flex-1" />
            <div className="flex flex-col text-sm sm:flex-row sm:items-center sm:justify-between gap-1 mt-1">
              {product.type === "auction" && timeLeft && (
                <div
                  className={`flex flex-nowrap items-center justify-center gap-1 py-0.5 px-1.5 rounded-full text-xs font-semibold ${
                    isAuctionEnded
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <Clock size={16} />
                  <span >{timeLeft}</span>
                </div>
              )}
              {product.type !== "auction" && <div className="hidden sm:block" />}
              <p className="text-slate-600 py-1 text-xs text-right">
                Posted{" "}
                {product.createdAt
                  ? `${Math.floor(
                      (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
                    )}d ago`
                  : "N/A"}
              </p>
            </div>
            <Button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2.5 transition-colors">
              View Product
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
});

export default ProductCard;