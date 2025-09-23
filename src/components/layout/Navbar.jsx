'use client'; // Required for using hooks like useState

import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Home, Search, PlusCircle, User, Info, Mail, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close the menu, can be passed to link clicks
  const closeMenu = () => setIsMenuOpen(false);

  // Component for sidebar links to avoid repetition
  const NavLinks = ({ isMobile = false }) => (
    <div
      className={
        isMobile
          ? "flex flex-col items-start space-y-6 text-lg"
          : "hidden md:flex justify-evenly space-x-4 items-center text-md font-bold nunito text-gray-600 "
      }
    >
      <Link href="/" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
        <Home className="w-5 h-5 text-blue-500" />
        Home
      </Link>
      <Link href="/browse" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
        <Search className="w-5 h-5 text-purple-500" />
        Browse
      </Link>
      <SignedIn>
        <Link href="/create" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
          <PlusCircle className="w-5 h-5 text-green-500" />
          Create Listing
        </Link>
        <Link href="/profile" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5 text-amber-600" />
          Profile
        </Link>
      </SignedIn>
      <Link href="/about" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
        <Info className="w-5 h-5 text-indigo-500" />
        About
      </Link>
      <Link href="/contact" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors">
        <Mail className="w-5 h-5 text-red-500" />
        Contact Us
      </Link>
    </div>
  );

  return (
    <>
      <nav className="fixed h-[8vh] md:h-[10vh] top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between z-50">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            width={50}
            height={50}
            alt="CampusCart Logo"
            className="rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Middle - Desktop Navigation Links */}
        <div className="flex-grow flex justify-center">
          <NavLinks />
        </div>

        {/* Right side - Auth buttons and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <SignedIn>
              <div className="scale-110">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Sign In
              </Link>
              <SignUpButton mode="modal">
                 <button className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Sign Up
                 </button>
              </SignUpButton>
            </SignedOut>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          {/* Mobile Nav Links */}
          <NavLinks isMobile={true} />

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col items-start gap-4 mt-8 border-t pt-6">
            <SignedIn>
               <div className="flex items-center gap-4">
                 <UserButton afterSignOutUrl="/" />
                 <span className='font-semibold text-gray-700'>Manage Account</span>
               </div>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" onClick={closeMenu} className="w-full text-center px-4 py-2 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Sign In
              </Link>
               <SignUpButton mode="modal" afterSignUpUrl="/" afterSignInUrl="/">
                 <button onClick={closeMenu} className="w-full px-4 py-2 font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Sign Up
                 </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Optional: Overlay for the rest of the page when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-30 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;