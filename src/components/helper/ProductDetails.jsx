"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUserById } from "@/lib/clerk";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductDetails = ({ product, bid }) => {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [media, setMedia] = useState([]);

  // Build media array combining images and video
  useEffect(() => {
    const mediaArray = (product.images || []).map((img) => ({
      src: img,
      isImage: true,
    }));
    if (product.video) {
      mediaArray.push({ src: product.video, isImage: false });
    }
    setMedia(mediaArray);
  }, [product.images, product.video]);

  // Fetch seller info
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

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNavigate = () => {
    if (product.createdBy) {
      router.push(`/profile/${product.createdBy}`);
    }
  };

  const displayPrice =
    product.type === "auction" && product.highestBid?.amount > 0
      ? product.highestBid.amount
      : product.price;

  return (
   <section className="w-full roboto min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
  <div className="w-full mx-auto mt-14 p-4 flex flex-col md:flex-row gap-6">
    {/* Left: Product Media */}
    <div className="w-full md:w-[40vw] flex flex-col items-center gap-6">
  {/* Default Image when no media */}
  {media.length === 0 && (
    <div className="w-full h-[50vh] relative">
      <Image
        src="/default_items.webp"
        alt="Default Image"
        fill
        className="object-cover transition-transform duration-300 ease-in-out"
      />
    </div>
  )}

  {/* Media Carousel */}
  {media.length > 0 && (
    <>
      <div className="w-full h-[200px] md:h-[300px] relative rounded-4xl overflow-hidden shadow-xl group ">
        {media[currentIndex].isImage ? (
          <Image
            src={media[currentIndex].src || "/default_items.webp"}
            alt={`${product.title} - media ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        ) : (
          <video
            src={media[currentIndex].src}
            controls
            className="w-full h-full object-cover rounded-xl"
          />
        )}

        {/* Prev/Next Buttons */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-purple-200 hover:scale-110 transition-transform duration-200 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous media"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-green-200 hover:scale-110 transition-transform duration-200 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next media"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
          {media.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer hover:opacity-80 transition ${
                currentIndex === idx ? "border-purple-500" : "border-transparent"
              }`}
            >
              {item.isImage ? (
                <Image
                  src={item.src}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <video
                  src={item.src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )}
</div>


    {/* Right: Product Info */}
    <div className="flex flex-col gap-3 flex-1 break-words">
      <h1 className="text-2xl font-bold text-purple-700 break-words">
        {product.title}
      </h1>

      {/* category / condition / type */}
      <div className="flex flex-wrap gap-2">
        {product.category && (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm break-words">
            {product.category}
          </span>
        )}
        {product.condition && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm break-words">
            {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
          </span>
        )}
        {product.type === "auction" && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Auction
          </span>
        )}
      </div>

      {/* price */}
      <div className="mt-1">
        <p className="text-2xl font-extrabold text-blue-700 break-words">
          ₹{displayPrice?.toLocaleString() || "N/A"}
          {product.type === "auction" && (
            <span className="text-blue-400 text-base font-normal ml-4">
              Current bid
            </span>
          )}
        </p>
      </div>

      <hr className="w-full border border-purple-300" />

      {/* description */}
      <div>
        <h2 className="text-xl font-bold text-purple-800">Description</h2>
        <p className="text-md text-gray-900 whitespace-pre-line break-words">
          {product.description || "No description provided."}
        </p>
      </div>
       <p className="break-words">
               <span className="font-semibold text-green-700">Contact Info :</span>{" "}
                <span className="text-purple-600 font-medium">
                  {product?.phone || "N/A"}
                </span>
              </p>
      {/* location */}
      {product.college && (
        <div>
          <p className="text-gray-800 font-medium break-words">
            <span className="font-semibold text-green-700">Location:</span>{" "}
            {product.college.toUpperCase()}
          </p>
        </div>
      )}

      {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-1 sigmar">
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
      <div className="mt-2">
        <hr className="w-full border border-purple-300" />
        <h2 className="text-xl font-semibold text-blue-700 mt-3">
          Seller Information
        </h2>
        <div className="flex flex-col gap-2">
          {!seller ? (
            <Loader />
          ) : (
            <>
              <button
                onClick={handleNavigate}
                className="inline-block px-4 py-2 rounded-full bg-purple-100 text-amber-800 font-medium text-lg hover:bg-purple-200 transition cursor-pointer break-words"
              >
                {seller?.name ? `Seller : ${seller?.name}` : "Seller Name: N/A"}
              </button>
              <p className="break-words">
                Email :{" "}
                <span className="text-purple-600 font-medium">
                  {seller?.email || "N/A"}
                </span>
              </p>
             
              <p className="text-blue-800 text-md">
                Member since{" "}
                {seller.memberSince
                  ? new Date(seller.memberSince).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
              <p className="text-lg text-amber-800 mt-1 break-words">
                Note: Click on Seller name to view Profile
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</section>

  );
};

export default ProductDetails;
