"use client";
import { whyChooseData } from '@/constants/chooseus';
import React from 'react';
import { motion } from 'framer-motion'; // Import motion

// Define animation variants for the container and items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const WhyChoose = () => {
  return (
    <section className="w-full px-6 py-16 bg-white text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sigmar font-[900] text-center w-full mb-12 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 animate-text"
      >
        Why Choose Us
        <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-50 h-1 bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 rounded-full animate-pulse"></span>
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {whyChooseData.map((item) => (
          <motion.div
            key={item.id}
            className="bg-gray-50 p-6 rounded-lg shadow-md hover:text-blue-600"
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-4xl mb-4 font-bold">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm font-semibold">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyChoose;