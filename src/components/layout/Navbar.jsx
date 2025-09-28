'use client';

import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Home, Search, PlusCircle, User, Info, Mail, Menu, X } from "lucide-react";
// --- 1. Import Framer Motion ---
import { motion, AnimatePresence } from 'framer-motion';

// --- 2. Define Animation Variants ---
const mobileMenuVariants = {
  hidden: {
    x: "100%",
    transition: { type: "tween", duration: 0.3, ease: "easeIn" }
  },
  visible: {
    x: 0,
    transition: { type: "tween", duration: 0.3, ease: "easeOut" }
  }
};

const linkContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // Stagger effect for each link
      delayChildren: 0.2     // Wait for the menu to slide in
    }
  }
};

const linkItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // Updated NavLinks to use motion.div for animation
  const NavLinks = ({ isMobile = false }) => {
    // For mobile, we wrap links in a motion container for staggering
    if (isMobile) {
      return (
        <motion.div
          variants={linkContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start space-y-6 text-lg"
        >
          {/* Each link is now a motion component */}
          <motion.div variants={linkItemVariants}>
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Home className="w-5 h-5 text-blue-500" />Home</Link>
          </motion.div>
          <motion.div variants={linkItemVariants}>
            <Link href="/browse" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Search className="w-5 h-5 text-purple-500" />Browse</Link>
          </motion.div>
          <SignedIn>
            <motion.div variants={linkItemVariants}>
              <Link href="/create" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><PlusCircle className="w-5 h-5 text-green-500" />Create Listing</Link>
            </motion.div>
            <motion.div variants={linkItemVariants}>
              <Link href="/profile" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><User className="w-5 h-5 text-amber-600" />Profile</Link>
            </motion.div>
          </SignedIn>
          <motion.div variants={linkItemVariants}>
            <Link href="/about" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Info className="w-5 h-5 text-indigo-500" />About</Link>
          </motion.div>
          <motion.div variants={linkItemVariants}>
            <Link href="/contact" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Mail className="w-5 h-5 text-red-500" />Contact Us</Link>
          </motion.div>
        </motion.div>
      );
    }

    // Desktop links don't need the staggering animation
    return (
      <div className="hidden md:flex justify-evenly space-x-4 items-center text-md font-bold nunito text-gray-600">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Home className="w-5 h-5 text-blue-500" />Home</Link>
        <Link href="/browse" className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Search className="w-5 h-5 text-purple-500" />Browse</Link>
        <SignedIn>
          <Link href="/create" className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><PlusCircle className="w-5 h-5 text-green-500" />Create Listing</Link>
          <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><User className="w-5 h-5 text-amber-600" />Profile</Link>
        </SignedIn>
        <Link href="/about" className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Info className="w-5 h-5 text-indigo-500" />About</Link>
        <Link href="/contact" className="flex items-center gap-2 px-3 py-2 rounded-md hover:text-blue-600 hover:bg-gray-100 transition-colors"><Mail className="w-5 h-5 text-red-500" />Contact Us</Link>
      </div>
    );
  };

  return (
    <>
      <nav className="fixed h-[8vh] md:h-[10vh] top-0 left-0 w-full bg-transparent backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" width={50} height={50} alt="CampusCart Logo" className="rounded-full shadow-md transition-transform duration-300 group-hover:scale-105" priority />
        </Link>

        <div className="flex-grow flex justify-center">
          <NavLinks />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <SignedIn>
              <div className="scale-110"><UserButton afterSignOutUrl="/" /></div>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Sign In</Link>
              <SignUpButton mode="modal"><button className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Sign Up</button></SignUpButton>
            </SignedOut>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {/* --- 3. Animate the hamburger icon transition --- */}
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                    <X size={28} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                    <Menu size={28} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* --- 4. Animate the Mobile Sidebar and Overlay --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Mobile Menu */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 h-full w-2/3 max-w-sm bg-white shadow-xl z-40 md:hidden"
            >
              <div className="flex flex-col h-full p-8 pt-24">
                <NavLinks isMobile={true} />
                <div className="flex-grow" />
                <div className="flex flex-col items-start gap-4 mt-8 border-t pt-6">
                  <SignedIn>
                    <div className="flex items-center gap-4"><UserButton afterSignOutUrl="/" /><span className='font-semibold text-gray-700'>Manage Account</span></div>
                  </SignedIn>
                  <SignedOut>
                    <Link href="/sign-in" onClick={closeMenu} className="w-full text-center px-4 py-2 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Sign In</Link>
                    <SignUpButton mode="modal" afterSignUpUrl="/" afterSignInUrl="/"><button onClick={closeMenu} className="w-full px-4 py-2 font-semibold bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Sign Up</button></SignUpButton>
                  </SignedOut>
                </div>
              </div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={closeMenu}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;