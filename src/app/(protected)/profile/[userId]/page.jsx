"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import PageLoader from "@/components/helper/PageLoader";
import { Mail, Phone, University, Calendar, Package, AlertTriangle } from "lucide-react";
// ✨ 1. Import motion and AnimatePresence
import { motion, AnimatePresence } from "framer-motion";

// ✨ 2. Define animation variants for page sections and grid items
const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Staggers the main header and product section
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Staggers the product cards inside the grid
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function UserPage() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("User not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ✨ 3. Wrap the main return in AnimatePresence for smooth state transitions
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-screen h-screen flex flex-col justify-center items-center bg-slate-50"
        >
          <PageLoader />
          <h1 className="mt-6 text-xl font-semibold text-slate-500">
            Fetching Profile...
          </h1>
        </motion.div>
      ) : !data || !data.user ? (
        <motion.div
          key="not-found"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-screen h-screen flex flex-col justify-center items-center p-6 text-center bg-slate-50"
        >
          <AlertTriangle size={48} className="text-red-500" />
          <h2 className="mt-4 text-3xl font-bold text-slate-800">User Not Found</h2>
          <p className="text-slate-500 mt-2">
            The profile you are looking for does not exist or could not be loaded.
          </p>
          <Link href="/browse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Browse
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen mt-16 bg-slate-50 font-sans"
        >
          <motion.div
            variants={pageContainerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8"
          >
            {/* User Profile Header */}
            <motion.header variants={sectionVariants} className="bg-white shadow-lg rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Image
                  src={data.user.imageUrl}
                  alt={`${data.user.firstName}'s profile picture`}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white shadow-md"
                />
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                    {data.user.firstName} {data.user.lastName}
                  </h1>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-x-6 gap-y-2 mt-2 text-slate-500">
                    <p className="flex items-center gap-2">
                      <Calendar size={16} />
                      Joined on {new Date(data.user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}
                    </p>
                    {data.user.publicMetadata?.college && (
                      <p className="flex items-center gap-2">
                        <University size={16} />
                        {data.user.publicMetadata.college}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail size={18} className="text-indigo-500 flex-shrink-0" />
                  <span className="text-slate-700 truncate">{data.user.primaryEmailAddress?.emailAddress || data.user.emailAddresses?.[0]?.emailAddress}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone size={18} className="text-indigo-500 flex-shrink-0" />
                  <span className="text-slate-700">{data.user.publicMetadata?.number || "Not provided"}</span>
                </div>
              </div>
            </motion.header>

            {/* User's Products Section */}
            <motion.section variants={sectionVariants}>
              <div className="flex items-center gap-3 mb-6">
                <Package size={24} className="text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-800">
                  {data.user.firstName}'s Listings
                </h2>
              </div>
              {data.products.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <p className="text-slate-500">This user has no listings.</p>
                </div>
              ) : (
                <motion.div
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {data.products.map((p) => {
                    const cardContent = (
                      <div className={`bg-white border border-slate-200 rounded-xl h-full overflow-hidden shadow-sm transition-all duration-300 ${p.isActive ? 'group-hover:shadow-xl group-hover:-translate-y-1' : ''} ${!p.isActive ? 'opacity-60' : ''}`}>
                        <div className="relative w-full aspect-video">
                          <Image src={p.images?.[0] || '/default_items.webp'} alt={p.title} fill className="object-cover" />
                          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-md ${p.isActive ? 'bg-green-500' : 'bg-slate-500'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className={`font-bold text-lg text-slate-800 ${p.isActive ? 'group-hover:text-indigo-600' : ''} transition-colors line-clamp-2`}>
                            {p.title}
                          </h3>
                          <p className="text-indigo-600 mt-2 font-semibold text-xl">
                            ₹{p.price.toLocaleString()}
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-400 flex justify-between items-center">
                            <span>
                              Listed: {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`flex items-center gap-1 font-semibold ${p.isActive ? 'text-indigo-500 group-hover:text-indigo-700' : 'text-slate-400'} transition-colors`}>
                              View Details {p.isActive && '→'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );

                    return (
                      // ✨ 4. Animate each product card
                      <motion.div variants={cardVariants} key={p._id}>
                        {p.isActive ? (
                          <Link href={`/product/${p._id}`} className="group block h-full">
                            {cardContent}
                          </Link>
                        ) : (
                          <div className="group block cursor-not-allowed h-full">
                            {cardContent}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}