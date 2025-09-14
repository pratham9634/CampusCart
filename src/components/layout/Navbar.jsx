import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between z-50">
      {/* Left side - Logo and Links */}
      <div className="flex justify-around w-[80vw] items-center space-x-12">
        <Link href="/" className="flex items-center">
          <Image
                        src="/logo.png"
                        width={50}
                        height={70}
                        alt="Students using marketplace"
                        className=""
                      />
        </Link>
        
        <div className="hidden justify-evenly md:flex space-x-4 items-center text-lg font-bold nunito text-gray-600">
          <Link href="/" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
            Home
          </Link>
          <Link href="/browse" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
            Browse
          </Link>

          <SignedIn>
            <Link href="/create-listing" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
              Create Listing
            </Link>
            <Link href="/my-listings" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
              My Listings
            </Link>
            <Link href="/profile" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
              Profile
            </Link>
          </SignedIn>

          <Link href="/about" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
            About
          </Link>
          <Link href="/contact" className="px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Right side - Auth buttons */}
      <div className="flex items-center space-x-3 roboto font-extrabold text-lg">
        <SignedIn>
          <UserButton  />
        </SignedIn>

        <SignedOut>
          <Link
            href="/sign-in"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <SignUpButton
            mode="modal"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:brightness-90 transition-colors cursor-pointer"
          >
            Sign Up
          </SignUpButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
