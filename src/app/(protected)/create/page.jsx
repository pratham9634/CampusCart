"use client";
import { categoriesData } from "@/constants/categories";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/helper/Loader";
import { Clock } from "lucide-react";
// ✨ Step 1: Import motion and AnimatePresence from Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// ✨ Animation Variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const Page = () => {
  const { user } = useUser();

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: categoriesData[0].title,
    type: "sale",
    price: "",
    description: "",
    images: [],
    video: null,
    email: "",
    phone: "",
    college: "",
    condition: "used",
    auctionDuration: 3, // Default auction duration in days
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user.primaryEmailAddress.emailAddress,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const existing = formData.images || [];
    if (existing.length + files.length > 6) {
      toast.error("You can upload a maximum of 6 images.");
      return;
    }
    setFormData({
      ...formData,
      images: existing.concat(files).slice(0, 6),
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, video: file });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({ ...prev, video: null }));
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Listing your product...");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((img) => data.append("images", img));
        } else if (key === "video" && value) {
          data.append("video", value);
        } else {
          data.append(key, value);
        }
      });
      
      const response = await fetch("/api/create", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to list item");

      toast.success("Product listed successfully!", { id: toastId });

      setFormData({
        title: "",
        category: categoriesData[0].title,
        type: "sale",
        price: "",
        description: "",
        images: [],
        video: null,
        email: user?.primaryEmailAddress?.emailAddress || "",
        phone: "",
        college: "",
        condition: "used",
        auctionDuration: 3,
      });

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      console.error(error.message);
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full pt-12 p-2 flex flex-col items-center justify-center bg-slate-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* ✨ Wrap main content in a motion.div for staggered animations */}
      <motion.div
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg p-6 mt-8 text-center border-t-4 border-indigo-600"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700 ">
            Welcome to CampusMart!
          </h1>
          <p className="text-gray-700 mt-2">
            Discover how easy it is to list and sell your items.
          </p>
          <p className="text-gray-600">
            From textbooks to gadgets, help your college community while earning extra cash!
          </p>
        </motion.div>

        {/* Listing Form Section */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-white rounded-2xl shadow-lg px-8 py-6 mt-4 border-t-4 border-orange-500"
        >
          <h2 className="text-xl font-bold text-slate-700 mb-6 text-center">List Your Item</h2>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Item Title */}
            <div>
              <label className="block font-semibold text-gray-700">Item Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: MacBook Pro 2019"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none hover:border-indigo-400 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none hover:border-orange-500 transition-all"
              >
                <option value="" disabled>Select a Category</option>
                {categoriesData.map((cat) => (
                  <option key={cat.id} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Type of Listing */}
            <div>
              <label className="block font-semibold text-gray-700">Type of Listing</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none hover:border-indigo-500 transition-all"
              >
                <option value="sale">For Sale (Fixed Price)</option>
                <option value="auction">Auction (Bidding)</option>
              </select>
            </div>
            
            {/* ✨ Wrap conditional Auction Duration field with AnimatePresence */}
            <AnimatePresence>
              {formData.type === 'auction' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 overflow-hidden"
                >
                  <label htmlFor="auctionDuration" className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                    <Clock size={20} className="text-indigo-600" />
                    Auction Duration
                  </label>
                  <select
                    id="auctionDuration"
                    name="auctionDuration"
                    value={formData.auctionDuration}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none hover:border-indigo-500 transition-all"
                  >
                    {[3, 4, 5, 6, 7].map(day => (
                      <option key={day} value={day}>{day} days</option>
                    ))}
                  </select>
                  <small className="text-gray-500 text-sm mt-1 block">
                    Your auction will automatically end after the selected duration.
                  </small>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Price */}
            <div>
              <label className="block font-semibold text-gray-700">
                  {formData.type === 'auction' ? 'Starting Price (₹)' : 'Price (₹)'}
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter amount in INR"
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none hover:border-blue-500 transition-all"
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block font-semibold text-gray-700">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none hover:border-green-500 transition-all"
              >
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>

            {/* College / Location */}
            <div>
              <label className="block font-semibold text-gray-700">College / Location</label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                placeholder="Enter your college or location"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none hover:border-blue-500 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: MacBook Pro, 16 inch, excellent condition, used for 2 years."
                rows="5"
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none hover:border-orange-500 transition-all"
              ></textarea>
            </div>

            {/* Upload Images */}
            <div>
              <label className="block font-semibold text-gray-700">Upload Images (Max 6)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imageInputRef}
                onChange={handleImageChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
              <div className="flex gap-3 mt-3 flex-wrap">
                 {/* ✨ Animate the image previews on add/remove */}
                <AnimatePresence>
                  {formData.images.map((img, index) => (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-24 h-24 border rounded-md overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`image-${index}`}
                        className="w-full h-full object-cover"
                      />
                      <motion.button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        whileHover={{ scale: 1.2, backgroundColor: "#dc2626" }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
                <p className="text-sm text-gray-600 italic mt-2">
                  Note: The <span className="font-semibold text-orange-600">first uploaded image</span> will be used as your product’s cover image.
                </p>
            </div>

            {/* Upload Video */}
            <div>
              <label className="block font-semibold text-gray-700">Upload Video (Optional)</label>
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={handleVideoChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all"
              />
              {/* ✨ Animate the video preview */}
              <AnimatePresence>
                {formData.video && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 relative w-full max-w-sm"
                  >
                    <video controls className="rounded-md border w-full">
                      <source src={URL.createObjectURL(formData.video)} type={formData.video.type} />
                      Your browser does not support the video tag.
                    </video>
                    <motion.button
                      type="button"
                      onClick={handleRemoveVideo}
                      whileHover={{ scale: 1.2, backgroundColor: "#dc2626" }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Information */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-slate-700">Contact Information</h3>
              <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@college.edu"
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-all"
                    />
                    <small className="text-gray-500 text-sm">We’ll contact you via this email.</small>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ex: +91 9********0"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none hover:border-orange-500 transition-all"
                    />
                  </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                // ✨ Add hover and tap animations to the submit button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-full sm:w-1/2 py-3 rounded-lg font-semibold text-white transition-colors duration-300 shadow-lg ${
                 isSubmitting
  ? "bg-gradient-to-r from-red-200 via-orange-200 to-amber-200 cursor-not-allowed"
  : "bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 hover:from-red-500 hover:via-orange-500 hover:to-amber-500"

                }`}
              >
                {isSubmitting ? <Loader /> : "List My Item"}
              </motion.button>
            </div>
          </form>
            <p className="text-sm text-gray-600 italic text-center mt-4">
                  Note: Please <span className="font-semibold text-red-600">delete this product</span> from your profile once it is sold.
            </p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Page;