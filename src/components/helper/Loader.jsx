"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center ">
      {/* Dots Animation */}
      <div className="flex space-x-2">
        <span className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce"></span>
        <span className="w-4 h-4 bg-green-500 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
        <span className="w-4 h-4 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      </div>
        <p className="mt-2 text-white">Listing your item...</p>
    </div>
  );
};

export default Loader;
