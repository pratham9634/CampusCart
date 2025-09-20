"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUserById } from "@/lib/clerk";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

const ProductDetails = ({ product }) => {
  const router = useRouter();

  const [seller, setSeller] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = product.images || [];
  const video = product.video || null;

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

  const handleNavigate = () => {
    if (seller?._id) {
      router.push(`/profile/${seller._id}`);
    }
  };

  const displayPrice =
    product.type === "auction" && product.highestBid?.amount > 0
      ? product.highestBid.amount
      : product.price;

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto mt-20 p-6 md:p-12 flex flex-col md:flex-row gap-10">
        {/* Left: Product Media */}
        <div className="flex-1 flex flex-col items-center gap-6">
          {/* Show Video if available */}
          {video && (
            <div className="w-full max-w-md h-[300px] md:h-[400px] relative rounded-xl overflow-hidden shadow-xl">
              <video
                src={video}
                controls
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          {/* Show Images if available */}
          {images.length > 0 && (
            <>
              <div className="w-full max-w-md h-[400px] md:h-[500px] relative rounded-xl overflow-hidden shadow-xl group">
                <Image
                  src={images[currentIndex] || "/default_items.webp"}
                  alt={`${product.title} - image ${currentIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-purple-200 transition opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Previous image"
                    >
                      ◀
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-green-200 transition opacity-0 group-hover:opacity-100 z-10"
                      aria-label="Next image"
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex justify-center gap-3 mt-4 w-full max-w-md">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer hover:opacity-80 transition ${
                        currentIndex === idx
                          ? "border-purple-500"
                          : "border-transparent"
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
            </>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-purple-700">{product.title}</h1>

          {/* category / condition / type */}
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {product.category}
              </span>
            )}
            {product.condition && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {product.condition.charAt(0).toUpperCase() +
                  product.condition.slice(1)}
              </span>
            )}
            {product.type === "auction" && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                Auction
              </span>
            )}
          </div>

          {/* price */}
          <div className="mt-2">
            <p className="text-4xl font-extrabold text-blue-700">
              ₹{displayPrice?.toLocaleString() || "N/A"}
              {product.type === "auction" && (
                <span className="text-gray-500 text-base font-normal ml-2">
                  Current bid
                </span>
              )}
            </p>
          </div>

          {/* description */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              Description
            </h2>
            <p className="text-lg text-gray-700">
              {product.description || "No description provided."}
            </p>
          </div>

          {/* location */}
          {product.college && (
            <div className="mt-2">
              <p className="text-gray-600 text-base">
                <span className="font-semibold text-green-700">Location:</span>{" "}
                {product.college}
              </p>
            </div>
          )}

          {/* buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {product.type === "auction" && (
              <button className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">
                Place Bid
              </button>
            )}
            {product.type === "sale" && (
              <button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition">
                Buy Now
              </button>
            )}
            <button className="flex-1 border border-gray-300 text-purple-700 font-semibold py-3 rounded-lg hover:bg-purple-100 transition">
              Message Seller
            </button>
          </div>

          {/* seller info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">
              Seller Information
            </h2>
            <div className="flex items-center justify-between">
              <div>
                {!seller ? (
                  <Loader />
                ) : (
                  <>
                    <button
                      onClick={handleNavigate}
                      className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium text-lg hover:bg-purple-200 transition cursor-pointer"
                    >
                      {seller?.firstName || seller?.lastName
                        ? `${seller?.firstName || ""} ${
                            seller?.lastName || ""
                          }`
                        : "Seller Name: N/A"}
                    </button>

                    <p className="text-gray-500 text-sm">
                      Member since{" "}
                      {seller.createdAt
                        ? new Date(seller.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </>
                )}
              </div>
              <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition">
                Ask in Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
