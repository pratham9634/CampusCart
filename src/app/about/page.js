import React from 'react';

const page = () => {
  return (
    <div className="relative min-h-screen pt-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 overflow-hidden flex flex-col items-center justify-start px-6 py-12">

      {/* Glowing Bubbles */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-purple-300 rounded-full opacity-60 blur-lg animate-float1"></div>
      <div className="absolute top-1/3 right-20 w-32 h-32 bg-indigo-300 rounded-full opacity-60 blur-xl animate-float2"></div>
      <div className="absolute bottom-24 left-1 w-48 h-48 bg-pink-300 rounded-full opacity-65 blur-xl animate-float3"></div>
      <div className="absolute bottom-10 right-1 w-36 h-36 bg-purple-300 rounded-full opacity-70 blur-lg animate-float4"></div>

      {/* Main Content */}
      <div className="relative max-w-4xl text-center space-y-8 z-10">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-purple-800">
          About CampusCart
        </h1>

        {/* Subheading */}
        <p className="text-gray-700 text-lg max-w-2xl mx-auto font-medium">
          CampusCart is your trusted platform to buy and sell second-hand items with fellow students. Our mission is to create a sustainable and community-driven marketplace that’s easy, safe, and affordable.
        </p>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-purple-800 mb-2">Our Mission</h3>
            <p className="text-gray-600 text-sm font-medium">
              Empower students to save money and support sustainability by connecting buyers and sellers across campus.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-indigo-800 mb-2">Our Vision</h3>
            <p className="text-gray-600 text-sm font-medium">
              Build a trusted community marketplace where students can effortlessly exchange goods and foster meaningful connections.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-bold text-pink-800 mb-2">Our Values</h3>
            <p className="text-gray-600 text-sm font-medium">
              Trust, affordability, community support, and environmental responsibility drive every interaction on CampusCart.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <button className="inline-block bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300">
            Join CampusCart Today
          </button>
        </div>

        {/* Terms & Policies */}
        <div className="mt-12 text-left text-gray-700 space-y-6 z-10">

          {/* Terms & Conditions */}
          <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Terms & Conditions</h2>
            <p className="text-sm font-medium mb-2">
              Welcome to CampusCart! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
            </p>
            <p className="text-sm font-medium mb-2">
              1. <strong>Account Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account information and activity.
            </p>
            <p className="text-sm font-medium mb-2">
              2. <strong>Transactions:</strong> CampusCart facilitates peer-to-peer transactions. We are not responsible for the items exchanged, their condition, or disputes arising from them.
            </p>
            <p className="text-sm font-medium mb-2">
              3. <strong>Prohibited Items:</strong> Selling illegal, unsafe, or prohibited items is strictly forbidden. Violations may result in account suspension.
            </p>
            <p className="text-sm font-medium mb-2">
              4. <strong>Platform Use:</strong> Users must not use the platform for spamming, harassment, or any activity that violates applicable laws.
            </p>
            <p className="text-sm font-medium">
              By using CampusCart, you acknowledge that you have read and accepted these terms.
            </p>
          </div>

          {/* Privacy Policy */}
          <div className="bg-white bg-opacity-70 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Privacy Policy</h2>
            <p className="text-sm font-medium mb-2">
              CampusCart is committed to protecting your privacy. We collect and use your information responsibly to provide and improve our services.
            </p>
            <p className="text-sm font-medium mb-2">
              1. <strong>Information Collection:</strong> We collect information you provide during registration, item listing, and communication on the platform.
            </p>
            <p className="text-sm font-medium mb-2">
              2. <strong>Use of Information:</strong> Information is used to facilitate transactions, provide support, and improve user experience.
            </p>
            <p className="text-sm font-medium mb-2">
              3. <strong>Data Security:</strong> We implement reasonable security measures to protect your personal data from unauthorized access.
            </p>
            <p className="text-sm font-medium">
              By using CampusCart, you consent to the collection and use of your information as described in this policy.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default page;
