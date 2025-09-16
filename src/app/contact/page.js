"use client";

import { useState } from "react";

const page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Integrate API or email service here
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="h-full pt-20 bg-gradient-to-br from-gray-100 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8 border border-gray-200">
        
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-purple-600">
            Contact Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? Send us a message and we’ll respond as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
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
          </div>

          <div>
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
          </div>

          <div>
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
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </form>

        {/* Additional Contact Info */}
        <div className="text-center space-y-4">
          <p className="text-gray-500">Or connect with us via:</p>
          <div className="flex justify-center gap-6 text-purple-600 text-xl">
            <a href="mailto:support@example.com" className="hover:text-purple-800 transition">
              📧
            </a>
            <a href="tel:+1234567890" className="hover:text-purple-800 transition">
              📞
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-800 transition">
              🐦
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-800 transition">
              🔗
            </a>
          </div>
        </div>
{/* Address Info */}
<div className="text-center text-gray-500 text-sm mt-6 space-y-1">
  <p>📍 Selakui,Dehradun,Uttarakhand, India</p>
  <p>⏰ Mon – Fri: 9 AM – 6 PM</p>
</div>


      </div>
    </div>
  );
};

export default page;
