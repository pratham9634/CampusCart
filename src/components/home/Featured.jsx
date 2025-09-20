"use client";

import Link from "next/link";
import Image from "next/image";

// Utility: format "time ago"
const timeAgo = (date) => {
  const now = new Date();
  const posted = new Date(date);
  const seconds = Math.floor((now - posted) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};
const dummyProducts = [
  {
    _id: "1",
    title: "Dell Inspiron Laptop",
    description: "Powerful laptop with Intel i5, 8GB RAM, and 512GB SSD.",
    price: 35000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1622286346003-c5c7e63b1088?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRlbGwlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    _id: "2",
    title: "Guitar Acoustic",
    description: "6-string acoustic guitar in excellent condition.",
    price: 5000,
    category: "Musical Instruments",
    image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z3VpdGFyfGVufDB8fDB8fHww",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    _id: "3",
    title: "Casio Scientific Calculator",
    description: "Perfect for engineering and math students.",
    price: 700,
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1668930185267-1f3c19851b5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNjaWVudGlmaWMlMjBjYWxjdWxhdG9yfGVufDB8fDB8fHww",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    _id: "4",
    title: "Cricket Bat SS",
    description: "Premium English willow bat, barely used.",
    price: 2500,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1646282814550-f521d9b57a59?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JpY2tldCUyMGJhdHxlbnwwfHwwfHx8MA%3D%3D",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    _id: "5",
    title: "Hostel Chair",
    description: "Strong wooden chair for hostel or study use.",
    price: 900,
    category: "Furniture",
    image: "https://plus.unsplash.com/premium_photo-1675186049302-a0dad4cf3412?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2hhaXIlMjB3b29kfGVufDB8fDB8fHww",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
];

const Featured = ({ products= dummyProducts}) => {
  const featured = products?.slice(0, 5) || [];

  return (
    <section className="w-full py-12 px-8 bg-gray-200">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-extrabold text-center">
        <span className="bg-gradient-to-r from-orange-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text">
          Featured Products
        </span>
        <div className="w-40 h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-600 mx-auto mt-2 rounded-full animate-pulse" />
      </h2>

      {/* Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ">
        {featured.map((product) => (
          <div
            key={product._id}
             className="rounded-3xl backdrop-blur-md shadow-lg border border-white/30 
             overflow-hidden flex flex-col justify-between 
             bg-gradient-to-br from-amber-100 via-blue-100 to-purple-100
             transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Product Image */}
            <div className="relative w-full h-30">
              <Image
                src={product.image || "/default_items.webp"}
                alt={product.title}
                fill
                className="object-cover rounded-t-3xl"
              />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-md text-gray-900 truncate">
                {product.title}
              </h3>
              <p className="text-sm text-gray-700  line-clamp-2">
                {product.description}
              </p>
              <p className=" text-orange-500 font-semibold">
                ₹{product.price}
              </p>
              <p className="mt-1 text-xs text-blue-600 font-medium">
                {product.category}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Posted {timeAgo(product.createdAt)}
              </p>
            </div>

            {/* Button */}
            <div className="p-4 pt-0">
              <Link
                href={`/product/${product._id}`}
                className="block w-full text-center bg-orange-400 text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Featured;
