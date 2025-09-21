// app/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import PageLoader from "@/components/helper/PageLoader";
import toast, { Toaster } from "react-hot-toast";

export default function MyProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    college: "",
    email: "",
    number: "",
    memberSince: "",
  });
  const [productsByUser, setProductsByUser] = useState([]);

  // ✅ Load user & products
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to load profile");

        const json = await res.json();

        setProfile(json.currentUser || null);
        setProductsByUser(json.products || []);

        if (json.isAdmin) {
          setUsersList(json.users.data || []);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        toast.error("Failed to load profile ❌");
      }
    };
    load();
  }, []);

  // ✅ Sync form with profile
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        college: profile.publicMetadata?.college || "",
        email:
          profile.primaryEmailAddress?.emailAddress ||
          profile.emailAddresses?.[0]?.emailAddress ||
          "",
        number: profile.publicMetadata?.number || "",
        memberSince: profile.createdAt
          ? new Date(profile.createdAt).toLocaleDateString()
          : "",
      });
    }
  }, [profile]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Save profile changes
  const save = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: profile.id,
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            publicMetadata: {
              ...profile.publicMetadata,
              college: form.college,
              number: form.number,
            },
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setProfile((prev) => ({
        ...prev,
        firstName: form.firstName,
        lastName: form.lastName,
        publicMetadata: {
          ...prev.publicMetadata,
          college: form.college,
          number: form.number,
        },
      }));

      setEditing(false);
      toast.success("Profile updated successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Something went wrong while updating profile ❌");
    } finally {
      setSaving(false);
    }
  };

 const toggleProduct = async (e, productId) => {
  e.stopPropagation();
  try {
    const res = await fetch(`/api/product/${productId}`, {
      method: "PATCH",
    });

    if (!res.ok) throw new Error("Failed to toggle product");

    const updatedProduct = await res.json();

    // ✅ Update the local state to reflect changes instantly
    setProductsByUser((prev) =>
      prev.map((p) => (p._id === productId ? { ...p, isActive: !p.isActive } : p))
    );

    toast.success(
      updatedProduct.isActive ? "Product activated ✅" : "Product deactivated ❌"
    );
  } catch (err) {
    console.error("Error toggling product:", err);
    toast.error("Failed to update product ❌");
  }
};



  const makeAdmin = async (targetId) => {
    const res = await fetch(`/api/users/${targetId}/make-admin`, {
      method: "POST",
    });
    if (res.ok) {
      toast.success("User promoted to admin");
      location.reload();
    } else {
      toast.error("Failed to promote user ❌");
    }
  };

  if (!isLoaded || !profile)
    return (
      <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
        <PageLoader />
        <h1 className="mt-6 text-xl font-semibold text-gray-500 animate-pulse">
          Please wait, this might take some time to load...
        </h1>
      </div>
    );

  const products = productsByUser || [];

  return (
    <div className="min-h-screen mt-16 bg-gray-50 p-6 md:p-12">
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-100 to-yellow-100 shadow-2xl rounded-3xl p-8 mb-8">
        {!editing ? (
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-purple-900 mb-1">
                  {form.firstName} {form.lastName}
                </h1>
                <p className="text-purple-700 font-medium tracking-wide">
                  Profile Details
                </p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="bg-white/25 hover:bg-yellow-200 hover:scale-105 backdrop-blur-md text-orange-500 font-semibold px-5 py-2 rounded-xl shadow-md transition"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-purple-900">
              <div>
                <label className="text-sm text-purple-600 font-medium">
                  Email
                </label>
                <p className="text-lg font-semibold">{form.email}</p>
              </div>
              <div>
                <label className="text-sm text-purple-600 font-medium">
                  Phone
                </label>
                <p className="text-lg font-semibold">
                  {form.number || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm text-purple-600 font-medium">
                  College
                </label>
                <p className="text-lg font-semibold">
                  {form.college || "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm text-purple-600 font-medium">
                  Member Since
                </label>
                <p className="text-lg font-semibold">{form.memberSince}</p>
              </div>
            </div>
          </div>
        ) : (
          // EDIT MODE
          <div>
            <h1 className="text-3xl font-extrabold mb-6 text-purple-900">
              Edit Your Profile
            </h1>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full bg-white/10 text-purple-900 border-b-2 border-purple-300 focus:border-purple-600 p-2 rounded transition placeholder:text-purple-400 outline-none"
                />
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full bg-white/10 text-purple-900 border-b-2 border-purple-300 focus:border-purple-600 p-2 rounded transition placeholder:text-purple-400 outline-none"
                />
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="College"
                  className="w-full bg-white/10 text-purple-900 border-b-2 border-purple-300 focus:border-purple-600 p-2 rounded transition placeholder:text-purple-400 outline-none"
                />
                <input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full bg-white/10 text-purple-900 border-b-2 border-purple-300 focus:border-purple-600 p-2 rounded transition placeholder:text-purple-400 outline-none"
                />
              </div>

              {/* Read-only fields with subtle glass effect */}
              <input
                name="email"
                value={`Email: ${form.email}`}
                readOnly
                className="w-full bg-white/20 text-purple-900 p-3 rounded-lg backdrop-blur-sm cursor-not-allowed"
              />
              <input
                name="memberSince"
                value={`Member Since: ${form.memberSince}`}
                readOnly
                className="w-full bg-white/20 text-purple-900 p-3 rounded-lg backdrop-blur-sm cursor-not-allowed"
              />

              <div className="flex gap-4 pt-4">
                <button
                  onClick={save}
                  disabled={saving}
                  className={`px-6 py-2 rounded-xl shadow-lg font-semibold transition text-white ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-700 hover:bg-purple-800"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-white/25 hover:bg-white/40 backdrop-blur-md text-purple-900 font-semibold px-6 py-2 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Section */}
      <section className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Products</h2>
        {products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              You haven't listed any products yet.
            </p>
          </div>
        ) : (
          // The grid now has a smaller gap for a tighter, cleaner look.
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {products.map((p) => (
              // Each card is now a flex container for a horizontal layout.
              // Subtle border and shadow for a modern, clean aesthetic.
              <div
                key={p._id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between"
              >
                {/* Div for Title and Price */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{p.title}</h3>
                  <p className="text-gray-500 text-sm">₹{p.price}</p>
                </div>

                {/* Modern "Pill" style button */}
                <button
  onClick={(e) => toggleProduct(e, p._id)}
  className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors duration-200 ${
    p.isActive
      ? "bg-red-100 text-red-700 hover:bg-red-200"
      : "bg-green-100 text-green-700 hover:bg-green-200"
  }`}
>
  {p.isActive ? "Deactivate" : "Activate"}
</button>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Admin Users Section */}
      {usersList.length > 0 && (
  <section className="max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">
      All Users (Admin)
    </h2>
    <div className="grid md:grid-cols-2 gap-4">
      {usersList.map((u) => (
        <div
          key={u.id}
          onClick={() => window.location.href = `/profile/${u.id}`}
          className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center hover:shadow-xl transition cursor-pointer hover:bg-gray-50"
        >
          <span className="text-gray-800 font-medium">{u.firstName} {u.lastName}</span>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigating when clicking the button
              makeAdmin(u.id);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded-xl shadow-sm"
          >
            Make Admin
          </button>
        </div>
      ))}
    </div>
  </section>
)}

    </div>
  );
}
