"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageLoader from "@/components/helper/PageLoader";

// Icon components for a nice touch (you can use an icon library like react-icons)
const ProductIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const NotFoundIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16 mx-auto text-red-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);


export default function UserPage() {
  const { userId } = useParams(); // get userId from route
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

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <PageLoader />
        <h1 className="mt-6 text-xl font-semibold text-gray-400 animate-pulse">
          Fetching Profile...
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center p-6 text-center">
        <NotFoundIcon />
        <h2 className="mt-4 text-2xl font-bold text-red-500">User Not Found</h2>
        <p className="text-gray-400 mt-2">
          The profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  const { user, products } = data;
  const userInitials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  return (
    <div className="min-h-screen mt-16 bg-gray-50 text-gray-900">
  <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
    {/* User Card */}
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-xl rounded-3xl p-8 mb-10 border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="w-32 h-32 rounded-full flex-shrink-0 bg-blue-500 text-white flex items-center justify-center text-5xl font-bold border-4 border-white shadow-md">
          {userInitials}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-blue-600 text-lg mt-1">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <label className="text-sm text-blue-600">Email</label>
          <p className="text-lg font-semibold">
            {user.primaryEmailAddress?.emailAddress ||
              user.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
        <div>
          <label className="text-sm text-blue-600">Phone</label>
          <p className="text-lg font-semibold">
            {user.primaryPhoneNumber?.phoneNumber || "Not set"}
          </p>
        </div>
        <div>
          <label className="text-sm text-blue-600">College</label>
          <p className="text-lg font-semibold">
            {user.publicMetadata?.college || "Not set"}
          </p>
        </div>
      </div>
    </div>

    {/* Products Section */}
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">
        Products for Sale
      </h2>
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <p className="text-gray-500">This user has no active listings.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p) => (
            <Link
              href={`/product/${p._id}`}
              key={p._id}
              className="group block"
            >
              <div className="bg-white border border-gray-200 p-6 rounded-2xl h-full shadow-sm transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-500 transition-colors">
                    {p.title}
                  </h3>
                  <ProductIcon className="text-gray-500 group-hover:text-blue-500" />
                </div>
                <p className="text-blue-600 mt-2 font-mono text-lg">
                  ₹{p.price}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
                  <span>
                    Listed: {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1 text-blue-600">
                    View Product →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  </div>
</div>

  );
}