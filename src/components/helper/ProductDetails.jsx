"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUserById } from "@/lib/clerk";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { io } from "socket.io-client";

let socket;

const ProductDetails = ({ product, currentUser }) => {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [media, setMedia] = useState([]);
  const [highestBid, setHighestBid] = useState(product.highestBid || null);
  const [bids, setBids] = useState([]); // will fetch from API
  const [bidAmount, setBidAmount] = useState("");
  const [showBidsModal, setShowBidsModal] = useState(false);

  // Initialize Socket.IO and join product room
  useEffect(() => {
    if (!socket) socket = io("http://localhost:5000"); // your server URL
    socket.emit("joinProductRoom", product._id);

    socket.on("newBid", (data) => {
      if (data.productId === product._id) {
        setHighestBid(data.highestBid);
        setBids(data.bids.sort((a, b) => b.amount - a.amount));
      }
    });

    socket.on("bidError", (err) => alert(err.message || "Bid error"));

    return () => {
      socket.off("newBid");
      socket.off("bidError");
    };
  }, [product._id]);

  // Fetch all bids from API on mount
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch(`/api/bids/${product._id}`);
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        setBids(data.sort((a, b) => b.amount - a.amount));
        if (data.length > 0) setHighestBid(data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBids();
  }, [product._id]);

  // Build media array
  useEffect(() => {
    const mediaArray = (product.images || []).map((img) => ({
      src: img,
      isImage: true,
    }));
    if (product.video) mediaArray.push({ src: product.video, isImage: false });
    setMedia(mediaArray);
  }, [product.images, product.video]);

  // Fetch seller info
  useEffect(() => {
    if (!product.createdBy) return;
    const fetchSeller = async () => {
      try {
        const data = await getUserById(product.createdBy);
        setSeller(data);
      } catch (err) {
        console.error("Failed to fetch seller info:", err);
      }
    };
    fetchSeller();
  }, [product.createdBy]);

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  const handleNavigate = () => router.push(`/profile/${product.createdBy}`);

  const displayPrice =
    product.type === "auction" && highestBid?.amount > 0
      ? highestBid.amount
      : product.price;

  // Place a bid
  const handleBid = async () => {
  if (!currentUser) return alert("Please login to place a bid");
  const amount = parseInt(bidAmount);

  // Simplified validation (the server should be the source of truth)
  if (!amount || amount <= (highestBid?.amount || 0)) {
    return alert("Bid must be higher than the current highest bid.");
  }

  // ONLY emit the event to the socket server. No more fetch().
  socket.emit("placeBid", {
    productId: product._id,
    bidderId: currentUser.id,
    bidderName: currentUser.firstName || currentUser.fullName || "Anonymous",
    amount,
  });

  setBidAmount(""); // Clear input optimistically
}

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 roboto">
      <div className="w-full mx-auto mt-14 p-4 flex flex-col md:flex-row gap-6">
        {/* Left Media */}
        <div className="w-full md:w-[40vw] flex flex-col items-center gap-6">
          {media.length === 0 ? (
            <div className="w-full h-[50vh] relative">
              <Image src="/default_items.webp" alt="Default" fill className="object-cover" />
            </div>
          ) : (
            <>
              <div className="w-full h-[300px] relative rounded-4xl overflow-hidden shadow-xl group">
                {media[currentIndex].isImage ? (
                  <Image src={media[currentIndex].src} alt="media" fill className="object-cover" />
                ) : (
                  <video src={media[currentIndex].src} controls className="w-full h-full object-cover rounded-xl" />
                )}

                {media.length > 1 && (
                  <>
                    <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full group-hover:opacity-100 opacity-0">
                      <ChevronLeft size={24} />
                    </button>
                    <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full group-hover:opacity-100 opacity-0">
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              {media.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {media.map((item, idx) => (
                    <div key={idx} onClick={() => setCurrentIndex(idx)} className={`w-20 h-20 border-2 cursor-pointer ${currentIndex === idx ? "border-purple-500" : "border-transparent"}`}>
                      {item.isImage ? <Image src={item.src} width={80} height={80} alt="thumb" className="object-cover" /> : <video src={item.src} className="w-full h-full object-cover" muted loop />}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Info */}
        <div className="flex flex-col gap-3 flex-1 break-words">
          <h1 className="text-2xl font-bold text-purple-700">{product.title}</h1>
          <div className="flex gap-2 flex-wrap">
            {product.category && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{product.category}</span>}
            {product.condition && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{product.condition}</span>}
            {product.type === "auction" && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Auction</span>}
          </div>

          <p className="text-2xl font-extrabold text-blue-700">
            ₹{displayPrice?.toLocaleString()} {product.type === "auction" && <span className="text-blue-400 text-base font-normal ml-2">Current Bid</span>}
          </p>

          <p className="text-md text-gray-900 whitespace-pre-line">{product.description || "No description"}</p>
          <p><span className="font-semibold text-green-700">Contact:</span> <span className="text-purple-600">{product.phone || "N/A"}</span></p>
          {product.college && <p><span className="font-semibold text-green-700">Location:</span> {product.college.toUpperCase()}</p>}

          {/* Bidding & Buy Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-3">
            {product.type === "auction" && (
              <div className="flex gap-2 flex-1">
                <input type="number" placeholder="Enter your bid" className="flex-1 border p-2 rounded-lg" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                <button onClick={handleBid} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Place Bid</button>
                <button onClick={() => setShowBidsModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View All Bids</button>
              </div>
            )}
            {product.type === "sale" && <button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600">Buy Now</button>}
            <button className="flex-1 border border-gray-300 text-purple-700 py-3 rounded-lg hover:bg-purple-100">Message Seller</button>
          </div>

          {/* Seller Info */}
          <div className="mt-4">
            <hr className="border-purple-300" />
            <h2 className="text-xl font-semibold text-blue-700 mt-3">Seller Information</h2>
            {!seller ? <Loader /> : (
              <>
                <button onClick={handleNavigate} className="px-4 py-2 bg-purple-100 text-amber-800 rounded-full hover:bg-purple-200">{seller?.name || "N/A"}</button>
                <p>Email: <span className="text-purple-600">{seller?.email || "N/A"}</span></p>
                <p className="text-blue-800">Member since: {seller?.memberSince ? new Date(seller.memberSince).toLocaleDateString("en-US",{month:"short",year:"numeric"}) : "N/A"}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bids Modal */}
      {showBidsModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 max-h-[80vh] overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4">All Bids</h2>
            <button onClick={() => setShowBidsModal(false)} className="absolute top-4 right-4 text-gray-500">✕</button>
            <ul>
              {bids.length === 0 ? <li>No bids yet</li> : bids.map((bid, idx) => (
                <li key={idx} className="flex justify-between py-2 border-b hover:bg-gray-50">
                  <span>{bid.bidderName}</span>
                  <span>₹{bid.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
