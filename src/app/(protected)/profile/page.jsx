// app/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import PageLoader from "@/components/helper/PageLoader";
import toast, { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  University,
  Calendar,
  Edit,
  Save,
  X,
  Power,
  PowerOff,
  Trash2,
  UserCog,
} from "lucide-react";

export default function MyProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingAdminIds, setLoadingAdminIds] = useState([]);
  const [successAdminIds, setSuccessAdminIds] = useState([]);
  const [deletingProductIds, setDeletingProductIds] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    college: "",
    email: "",
    number: "",
    memberSince: "",
  });
  const [productsByUser, setProductsByUser] = useState([]);

  // Load user & products
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to load profile");
        const json = await res.json();
        setProfile(json.currentUser || null);
        setProductsByUser(json.products || []);
        if (json.isAdmin) {
          setUsersList(json.users?.data || []);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        toast.error("Failed to load profile.");
      }
    };
    load();
  }, []);

  // Sync form with profile
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
          ? new Date(profile.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "",
      });
    }
  }, [profile]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Save profile changes
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
      const updatedProfile = await res.json();
      setProfile(updatedProfile.user || profile); // fallback to current profile
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Something went wrong while updating.");
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = async (productId) => {
    try {
      const productToUpdate = productsByUser.find((p) => p._id === productId);
      if (!productToUpdate) return;
      const res = await fetch(`/api/product/${productId}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to toggle product");
      const { updatedProduct } = await res.json();
      setProductsByUser((prev) =>
        prev.map((p) => (p._id === productId ? updatedProduct : p))
      );
      toast.success(
        updatedProduct.isActive ? "Product activated." : "Product deactivated."
      );
    } catch (err) {
      console.error("Error toggling product:", err);
      toast.error("Failed to update product.");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingProductIds((prev) => [...prev, productId]);
    try {
      const res = await fetch(`/api/product/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProductsByUser((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Product deleted successfully.");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(err.message || "Failed to delete product.");
    } finally {
      setDeletingProductIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const makeAdmin = async (targetId) => {
    if (loadingAdminIds.includes(targetId)) return;
    setLoadingAdminIds((prev) => [...prev, targetId]);
    try {
      const res = await fetch(`/api/users/${targetId}/make-admin`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to promote user");
      setUsersList((prev) =>
        prev.map((u) =>
          u.id === targetId
            ? { ...u, privateMetadata: { ...u.privateMetadata, role: "admin" } }
            : u
        )
      );
      setSuccessAdminIds((prev) => [...prev, targetId]);
      setTimeout(() => {
        setSuccessAdminIds((prev) => prev.filter((id) => id !== targetId));
      }, 1000);
      toast.success("User promoted to admin.");
    } catch (err) {
      console.error("Make admin error:", err);
      toast.error("Failed to promote user.");
    } finally {
      setLoadingAdminIds((prev) => prev.filter((id) => id !== targetId));
    }
  };

  if (!isLoaded || !profile) {
    return (
      <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center bg-slate-50">
        <PageLoader />
        <h1 className="mt-6 text-xl font-semibold text-gray-500">
          Loading your profile...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-slate-50 p-4 sm:p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Card */}
        <section className="bg-white shadow-lg rounded-2xl border border-slate-200">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <Image
                  src={profile?.imageUrl || "/default_profile.png"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    {form.firstName} {form.lastName}
                  </h1>
                  <p className="text-slate-500">Your personal dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="mt-4 sm:mt-0 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-300"
              >
                {editing ? (
                  <>
                    <X size={16} /> Cancel
                  </>
                ) : (
                  <>
                    <Edit size={16} /> Edit Profile
                  </>
                )}
              </button>
            </div>

            {!editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-indigo-500" />
                  <span className="text-slate-700">{form.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-indigo-500" />
                  <span className="text-slate-700">{form.number || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <University size={20} className="text-indigo-500" />
                  <span className="text-slate-700">{form.college || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-indigo-500" />
                  <span className="text-slate-700">Member since {form.memberSince}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full bg-slate-100 border-slate-200 border-2 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full bg-slate-100 border-slate-200 border-2 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    placeholder="College"
                    className="w-full bg-slate-100 border-slate-200 border-2 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    name="number"
                    value={form.number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-slate-100 border-slate-200 border-2 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* My Products Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">My Products</h2>
          <div className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-hidden">
            {productsByUser.length > 0 ? (
              <ul className="divide-y divide-slate-200">
                {productsByUser.map((p) => (
                  <li
                    key={p._id}
                    id={`product-${p._id}`}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <Link href={`/product/${p._id}`} className="flex items-center gap-4 group">
                      <Image
                        src={p.images?.[0] || "/default_items.webp"}
                        alt={p.title}
                        width={64}
                        height={64}
                        className="rounded-lg aspect-square object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          ₹{p.price?.toLocaleString() || 0} -{" "}
                          <span className={p.isActive ? "text-green-600" : "text-red-600"}>
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleProduct(p._id)}
                        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${
                          p.isActive
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {p.isActive ? (
                          <>
                            <PowerOff size={14} /> Deactivate
                          </>
                        ) : (
                          <>
                            <Power size={14} /> Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        disabled={deletingProductIds.includes(p._id)}
                        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md transition-all ${
                          deletingProductIds.includes(p._id)
                            ? "bg-red-200 text-red-900 cursor-not-allowed animate-pulse"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {deletingProductIds.includes(p._id) ? (
                          <span className="flex items-center gap-1">
                            <Trash2 size={14} className="animate-spin" /> Deleting...
                          </span>
                        ) : (
                          <>
                            <Trash2 size={14} /> Delete
                          </>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-12">
                <p className="text-slate-500">You haven't listed any products yet.</p>
                <Link href="/create">
                  <button className="mt-4 bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    List an Item
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Admin Users Section */}
        {profile.privateMetadata?.role === "admin" && usersList.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">All Users (Admin Panel)</h2>
            <div className="bg-white shadow-lg rounded-2xl border border-slate-200 overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                  <tr>
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <Image
                          src={u.imageUrl || "/default_profile.png"}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <span className="font-medium text-slate-900">
                          {u.firstName} {u.lastName}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {u.emailAddresses?.[0]?.emailAddress || "N/A"}
                      </td>
                      <td className="p-4">
                        {u.privateMetadata?.role === "admin" ? (
                          <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full">
                            User
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {u.privateMetadata?.role !== "admin" && (
                          <button
                            onClick={() => makeAdmin(u.id)}
                            disabled={loadingAdminIds.includes(u.id)}
                            className={`flex items-center gap-1.5 ml-auto font-semibold px-3 py-1.5 rounded-md text-sm transition-all ${
                              loadingAdminIds.includes(u.id)
                                ? "bg-yellow-200 text-yellow-900 cursor-not-allowed animate-pulse"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            } ${
                              successAdminIds.includes(u.id)
                                ? "scale-105 bg-green-100 text-green-800"
                                : ""
                            }`}
                          >
                            {loadingAdminIds.includes(u.id) ? (
                              <span className="flex items-center gap-1">
                                <UserCog size={14} className="animate-spin" /> Promoting...
                              </span>
                            ) : (
                              <>
                                <UserCog size={14} /> Make Admin
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
