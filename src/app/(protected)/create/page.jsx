"use client";
import { categoriesData } from "@/constants/categories";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";

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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autofill email from Clerk
  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user.primaryEmailAddress.emailAddress,
      }));
    }
  }, [user]);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  // Remove individual image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Remove video
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

      console.log([...data.entries()]);
      console.log(formData);

      const response = await fetch("/api/create", { method: "POST", body: data });
      console.log("📡 Raw response:", response);

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to list item");

      toast.success("Product listed successfully!", { id: toastId });

      // Reset form
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
      });

      // Reset file inputs
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
    <main className="min-h-screen w-full pt-20 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-pink-100">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Greeting Section */}
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 mt-10 text-center border-t-4 border-purple-600">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">
          Welcome to CampusMart!
        </h1>
        <p className="text-gray-700 mb-3">
          Discover how easy it is to list and sell your items.
        </p>
        <p className="text-gray-600">
          From textbooks to gadgets, help your college community while earning extra cash!
        </p>
      </div>

      {/* Listing Form Section */}
      <div className="w-[70vw] bg-white rounded-2xl shadow-xl p-8 mt-8 border-t-4 border-orange-500">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">List Your Item</h2>

        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Item Title */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Item Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: MacBook Pro 2019"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none hover:border-blue-400 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none hover:border-orange-500 transition-all"
            >
              <option value="">Select a category</option>
              {categoriesData.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Type of Listing */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Type of Listing</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none hover:border-purple-500 transition-all"
            >
              <option value="sale">Sale</option>
              <option value="auction">Auction</option>
            </select>
            <small className="text-gray-500 text-sm">
              Choose Auction to allow users to bid.
            </small>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Ex: 50000"
              min="0"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none hover:border-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ex: MacBook Pro, 16 inch, excellent condition, used for 2 years."
              rows="5"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none hover:border-orange-500 transition-all"
            ></textarea>
          </div>

          {/* Upload Images */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Upload Images (Max 6)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
            <div className="flex gap-3 mt-3 flex-wrap">
              {formData.images.map((img, index) => (
                <div key={index} className="relative w-20 h-20 border rounded-md overflow-hidden">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`image-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Video */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Upload Video (Optional)</label>
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all"
            />
            {formData.video && (
              <div className="mt-3 relative w-[250px]">
                <video controls width="250" className="rounded-md border">
                  <source src={URL.createObjectURL(formData.video)} type={formData.video.type} />
                  Your browser does not support the video tag.
                </video>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Contact Information</h3>

            {/* Email */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@college.edu"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none hover:border-blue-400 transition-all"
              />
              <small className="text-gray-500 text-sm">We’ll contact you via this email.</small>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ex: +91 9********0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none hover:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-[20vw] py-3 rounded-lg font-semibold transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white"
              }`}
            >
              {isSubmitting ? "Listing..." : "List Item"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Page;
