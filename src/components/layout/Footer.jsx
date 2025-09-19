"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-1">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-blue-100 to-purple-100" />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-xl border-t border-gray-200" />

      <div className="relative container mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-black">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold">Campus Cart</h2>
          <p className="mt-3 text-sm font-medium">
            Buy and sell with ease in your campus community.
          </p>
          <div className="flex items-center space-x-4 mt-5">
            <Link href="https://facebook.com" target="_blank">
              <Facebook size={22} className="text-blue-500 hover:text-blue-700 transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram size={22} className="text-orange-500 hover:text-orange-700 transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter size={22} className="text-blue-400 hover:text-blue-600 transition" />
            </Link>
            <Link href="https://github.com/pratham9634/CampusCart" target="_blank">
              <Github size={22} className="text-purple-500 hover:text-purple-700 transition" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
       <div>
  <h3 className="text-lg font-bold  text-amber-800">Quick Links</h3>
  <ul className="mt-4 space-y-2 text-sm font-semibold">
    <li>
      <Link
        href="/"
        className="transition hover:text-orange-500 underline decoration-orange-500 underline-offset-4"
      >
        Home
      </Link>
    </li>
    <li>
      <Link
        href="/browse"
        className="transition hover:text-blue-500 underline decoration-blue-500 underline-offset-4"
      >
        Browse Items
      </Link>
    </li>
    <li>
      <Link
        href="/create"
        className="transition hover:text-purple-500 underline decoration-purple-500 underline-offset-4"
      >
        Sell an Item
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className="transition hover:text-orange-500 underline decoration-orange-500 underline-offset-4"
      >
        About Us
      </Link>
    </li>
  </ul>
</div>

{/* Support */}
<div>
  <h3 className="text-lg font-bold text-amber-800">Support</h3>
  <ul className="mt-4 space-y-2 text-sm font-semibold">
    <li>
      <Link
        href="/"
        className="transition hover:text-blue-500 underline decoration-blue-500 underline-offset-4"
      >
        FAQs
      </Link>
    </li>
    <li>
      <Link
        href="/contact"
        className="transition hover:text-purple-500 underline decoration-purple-500 underline-offset-4"
      >
        Contact Us
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className="transition hover:text-orange-500 underline decoration-orange-500 underline-offset-4"
      >
        Privacy Policy
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className="transition hover:text-blue-500 underline decoration-blue-500 underline-offset-4"
      >
        Terms & Conditions
      </Link>
    </li>
  </ul>
</div>


        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold  text-amber-800">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm font-semibold">
            <li className="flex items-center space-x-2">
              <Mail size={20} className="text-orange-500" />
              <span>support@campuscart.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={20} className="text-blue-500" />
              <span>+91 99******00</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={20} className="text-purple-500" />
              <span>Selakui,Dehradun</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-200 py-6 text-center text-sm font-semibold text-black">
        © {new Date().getFullYear()}{" "}
        <span className="font-bold">Campus Cart</span>. All rights reserved.
      </div>
    </footer>
  );
}
