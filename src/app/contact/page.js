"use client";

import { useState } from "react";
// ✨ 1. Import motion from Framer Motion
import { motion } from "framer-motion";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Add a success toast message here for better UX!
    setFormData({ name: "", email: "", message: "" });
  };

  // ✨ 2. Define animation variants for staggering
  const formContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1, // This will animate children one by one
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconVariants = {
    hover: {
      scale: 1.3,
      rotate: 10,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <div className="h-full pt-20 bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      {/* ✨ 3. Convert the main container to a motion component */}
      <motion.div
        className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-200"
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-purple-600">
            Contact Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? Send us a message and we’ll respond as soon as possible.
          </p>
        </motion.div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@example.com"
              required
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Write your message..."
              rows="6"
              required
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            ></textarea>
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* ✨ 4. Add hover and tap animations to the button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg"
            >
              Send Message
            </motion.button>
          </motion.div>
        </form>

        {/* Additional Contact Info */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <p className="text-gray-500">Or connect with us via:</p>
          <div className="flex justify-center gap-6 text-2xl">
            {/* ✨ 5. Add hover animations to social icons */}
            <motion.a variants={iconVariants} whileHover="hover" href="mailto:support@example.com" className="text-purple-600 hover:text-purple-800">📧</motion.a>
            <motion.a variants={iconVariants} whileHover="hover" href="tel:+911234567890" className="text-purple-600 hover:text-purple-800">📞</motion.a>
            <motion.a variants={iconVariants} whileHover="hover" href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">🐦</motion.a>
            <motion.a variants={iconVariants} whileHover="hover" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">🔗</motion.a>
          </div>
        </motion.div>

        {/* Address Info */}
        <motion.div variants={itemVariants} className="text-center text-gray-500 text-sm mt-6 space-y-1">
          <p>📍 Selakui, Dehradun, Uttarakhand, India</p>
          <p>⏰ Mon – Fri: 9 AM – 6 PM</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;