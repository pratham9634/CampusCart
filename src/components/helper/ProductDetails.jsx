"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
// --- Framer Motion Import ---
import { motion, AnimatePresence } from "framer-motion";
import { getUserById } from "@/lib/clerk";
import Loader from "./Loader";
import { ChevronLeft, ChevronRight, Tag, ShieldCheck, Hammer, Phone, University, User, Mail, CalendarDays, Clock } from "lucide-react";

let socket;

// --- Animation Variants Definition ---
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeInItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const ProductDetails = ({ product, currentUser }) => {
  const router = useRouter();
  const [seller, setSeller] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [media, setMedia] = useState([]);
  const [highestBid, setHighestBid] = useState(product.highestBid || null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // ... (all your existing useEffect hooks and logic remain unchanged) ...
  // --- Countdown Timer ---
  useEffect(() => {
    if (product.type !== "auction" || !product.auctionEndDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(product.auctionEndDate) - new Date();
      if (difference > 0) {
        setIsAuctionEnded(false);
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        setIsAuctionEnded(true);
        return null;
      }
    };

    const updateTime = () => {
      const newTime = calculateTimeLeft();
      if (newTime) {
        setTimeLeft(`${newTime.days}d ${newTime.hours}h ${newTime.minutes}m ${newTime.seconds}s`);
      } else {
        setTimeLeft("Auction Ended");
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [product.auctionEndDate, product.type]);

  // Socket.IO
  useEffect(() => {
    if (!socket) socket = io("http://localhost:5000");
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

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch(`/api/bids/${product._id}`);
        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        setBids(data.sort((a, b) => b.amount - a.amount));
        if (data.length > 0) {
          const maxBid = data.reduce((prev, current) => (prev.amount > current.amount ? prev : current));
          setHighestBid(maxBid);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (product?._id) fetchBids();
  }, [product._id]);

  // Media
  useEffect(() => {
    const mediaArray = (product.images || []).map((img) => ({ src: img, isImage: true }));
    if (product.video) mediaArray.push({ src: product.video, isImage: false });
    setMedia(mediaArray);
  }, [product.images, product.video]);

  // Seller
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
  const displayPrice = product.type === "auction" && highestBid?.amount > 0 ? highestBid.amount : product.price;

  const handleBid = () => {
    if (!currentUser) return alert("Please login to place a bid");
    const amount = parseInt(bidAmount);
    if (!amount || amount <= (highestBid?.amount || product.price || 0))
      return alert("Bid must be higher than the current highest bid or starting price.");
    socket.emit("placeBid", {
      productId: product._id,
      bidderId: currentUser.id,
      bidderName: currentUser.firstName || currentUser.fullName || "Anonymous",
      amount,
    });
    setBidAmount("");
  };

  return (
    // --- Added motion.section for page load animation ---
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen p-4 md:p-8 bg-slate-50 font-sans"
    >
      <div className="container mx-auto mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Media */}
          <motion.div variants={fadeInItem} className="flex flex-col items-center gap-4">
            <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-lg group bg-slate-100">
              {/* --- AnimatePresence for smooth image/video transition --- */}
              <AnimatePresence mode="wait">
                {media.length > 0 ? (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    {media[currentIndex].isImage ? (
                      <Image src={media[currentIndex].src} alt="Product media" fill className="object-cover" priority />
                    ) : (
                      <video src={media[currentIndex].src} controls className="w-full h-full object-cover" />
                    )}
                  </motion.div>
                ) : (
                  <Image src="/default_items.webp" alt="Default product image" fill className="object-cover" />
                )}
              </AnimatePresence>

              {media.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} className="text-slate-700" />
                  </button>
                  <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} className="text-slate-700" />
                  </button>
                </>
              )}
            </div>

            {media.length > 1 && (
              <div className="flex gap-3 justify-center flex-wrap">
                {media.map((item, idx) => (
                  // --- Added motion.div for hover/tap effects on thumbnails ---
                  <motion.div
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${currentIndex === idx ? "border-indigo-500 scale-105" : "border-transparent"}`}
                  >
                    {item.isImage ? (
                      <Image src={item.src} width={80} height={80} alt="Thumbnail" className="object-cover w-full h-full" />
                    ) : (
                      <div className="relative w-full h-full bg-black">
                        <video src={item.src} className="w-full h-full object-cover" muted loop />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column */}
          {/* --- Stagger animation for right column items --- */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5"
          >
            {/* Title & Tags */}
            <motion.div variants={fadeInItem}>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                {product.category && <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"><Tag size={16} />{product.category}</span>}
                {product.condition && <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"><ShieldCheck size={16} />{product.condition}</span>}
                {product.type === "auction" && <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"><Hammer size={16} />Auction</span>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 break-words">{product.title}</h1>
            </motion.div>

            {/* Auction Timer */}
            {product.type === 'auction' && (
              <motion.div variants={fadeInItem} className={`p-4 rounded-xl border ${isAuctionEnded ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-1">
                  <Clock size={16} />
                  <span>{isAuctionEnded ? 'Auction Status' : 'Time Left'}</span>
                </div>
                <p className={`text-2xl font-bold ${isAuctionEnded ? 'text-red-600' : 'text-amber-900'}`}>{timeLeft || "Loading..."}</p>
              </motion.div>
            )}

            {/* Price */}
            <motion.div variants={fadeInItem} className="p-4 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500">
                {product.type === "auction" ? (highestBid?.amount > 0 ? "Current Bid" : "Starting Price") : "Price"}
              </p>
              <p className="text-4xl font-extrabold text-indigo-600 break-words">
                ₹{displayPrice?.toLocaleString() || "N/A"}
              </p>
            </motion.div>

            {/* Bidding / Actions */}
            <motion.div variants={fadeInItem} className="flex flex-col gap-3">
              {product.type === "auction" && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="number"
                    placeholder={isAuctionEnded ? "Auction has ended" : "Enter your bid amount"}
                    className="flex-1 border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    disabled={isAuctionEnded}
                  />
                  <button 
                    onClick={handleBid}
                    className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAuctionEnded}
                  >
                    Place Bid
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                {product.type === "sale" && <button 
                onClick={() => setShowContactModal(true)}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-sm">Buy Now</button>}
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-100 transition-colors duration-300"
                >
                  Contact Seller
                </button>
                {product.type === "auction" && <button onClick={() => setShowBidsModal(true)} className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-100 transition-colors duration-300">View All Bids</button>}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div variants={fadeInItem}>
              <h2 className="text-xl font-semibold text-slate-700 mb-2">Details</h2>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed break-words">{product.description || "No description provided."}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-600 break-words"><Phone size={16} className="text-indigo-500 flex-shrink-0"/><strong>Contact:</strong> {product.phone || "N/A"}</p>
                {product.college && <p className="flex items-center gap-2 text-slate-600 break-words"><University size={16} className="text-indigo-500 flex-shrink-0"/><strong>Location:</strong> {product.college.toUpperCase()}</p>}
              </div>
            </motion.div>

            {/* Seller Info */}
            <motion.div variants={fadeInItem} className="mt-4 pt-4 border-t border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700 mb-3">Seller Information</h2>
              {!seller ? <Loader /> : (
                <div className="flex flex-col gap-2 p-4 bg-white rounded-lg border border-slate-200">
                  <button onClick={handleNavigate} className="flex items-center gap-2 text-lg font-semibold text-indigo-600 hover:underline break-words text-left">
                    <User size={20} className="flex-shrink-0"/> {seller?.name || "N/A"}
                  </button>
                  <p className="flex items-center gap-2 text-sm text-slate-500 break-words"><Mail size={16} className="flex-shrink-0"/> {seller?.email || "N/A"}</p>
                  <p className="flex items-center gap-2 text-sm text-slate-500 break-words"><CalendarDays size={16} className="flex-shrink-0"/> Member since: {seller?.memberSince ? new Date(seller.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* --- AnimatePresence for modals --- */}
      <AnimatePresence>
        {/* Bids Modal */}
        {showBidsModal && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div variants={modalVariants} className="bg-white p-6 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col relative shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">All Bids</h2>
                <button onClick={() => setShowBidsModal(false)} className="text-slate-500 hover:text-slate-800 transition-colors">✕</button>
              </div>
              <ul className="overflow-y-auto flex-1 pr-2">
                {bids.length === 0 ? (
                  <li className="text-center text-slate-500 py-8">No bids have been placed yet.</li>
                ) : (
                  bids.map((bid, idx) => (
                    <li key={idx} className={`flex justify-between items-center py-3 px-4 rounded-lg border-b border-slate-200 ${idx === 0 ? 'bg-indigo-50' : ''}`}>
                      <span className={`font-semibold break-words ${idx === 0 ? 'text-indigo-700' : 'text-slate-700'}`}>{bid.bidderName}</span>
                      <span className={`font-bold break-words text-right ${idx === 0 ? 'text-indigo-800 text-lg' : 'text-slate-600'}`}>₹{bid.amount.toLocaleString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Contact Seller Modal */}
        {showContactModal && seller && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div variants={modalVariants} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-6 relative">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Contact Seller</h2>
                <button 
                  onClick={() => setShowContactModal(false)} 
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <User size={24} className="text-indigo-500 flex-shrink-0"/>
                  <div className="flex flex-col">
                    <p className="font-semibold text-indigo-700 break-words">{seller.name || "N/A"}</p>
                    <p className="text-sm text-indigo-600 break-words">{seller.email || "N/A"}</p>
                  </div>
                </div>
                {seller.memberSince && (
                  <p className="flex items-center gap-2 text-sm text-indigo-600">
                    <CalendarDays size={16} className="text-indigo-500"/> Member since {new Date(seller.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                )}
                {product.phone && (
                  <p className="flex items-center gap-2 text-sm text-indigo-600">
                    <Phone size={16} className="text-indigo-500"/> {product.phone}
                  </p>
                )}
              </div>
              <p className="text-slate-700 text-sm text-center">
                Contact the seller directly for further buying process.
              </p>
              <button 
                onClick={() => setShowContactModal(false)}
                className="mt-2 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default ProductDetails;