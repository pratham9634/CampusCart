// src/components/ProductCard.js (or similar path)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

// Helper function to format the time left
const formatTimeLeft = (difference) => {
  if (difference <= 0) return "Auction Ended";
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m ${Math.floor((difference / 1000) % 60)}s left`;
};

const ProductCard = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);

  useEffect(() => {
    if (product.type !== "auction" || !product.auctionEndDate) return;

    const interval = setInterval(() => {
      const difference = +new Date(product.auctionEndDate) - +new Date();
      setTimeLeft(formatTimeLeft(difference));
      if (difference <= 0) {
        setIsAuctionEnded(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product.auctionEndDate, product.type]);

  return (
    <Link href={`/product/${product._id || product.id}`}>
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
            <div className="absolute z-10 top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold animate-bounce">
              🔥 Auction
            </div>
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

         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
  {/* Auction Countdown Timer */}
  {product.type === "auction" && timeLeft && (
    <div
      className={`flex items-center justify-center gap-1 py-0.5 px-1.5 rounded-full text-sm font-semibold ${
        isAuctionEnded
          ? "bg-red-100 text-red-700"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      <Clock size={16} />
      <span>{timeLeft}</span>
    </div>
  )}

  {product.type !== "auction" && <div className="hidden sm:block" />}
  
  <p className="text-slate-600 py-1  text-xs text-right">
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
  );
};

export default ProductCard;