import { whyChooseData } from '@/constants/chooseus';
import React from 'react';

const WhyChoose = () => {
  return (
    <section className="w-full px-6 py-16 bg-white text-center">
      <h1 className="text-4xl sigmar font-[900] text-center w-full mb-16 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 animate-text">
  Why Choose Us
  <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-50 h-1 bg-gradient-to-r from-orange-500 via-purple-600 to-red-500 rounded-full animate-pulse"></span>
</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {whyChooseData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:text-blue-600 transform hover:scale-105 transition-transform duration-300 animate-fadeIn"
          >
            <div className="text-4xl mb-4 font-bold">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm font-semibold">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChoose;
