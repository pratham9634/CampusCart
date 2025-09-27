"use client";

import PageLoader from "@/components/helper/PageLoader";
import ProductDetails from "@/components/helper/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // To get logged-in user

const Page = () => {
  const { id } = useParams();
  const { user } = useUser(); // current logged-in user
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Failed to load product");

        const data = await res.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );

  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  return <ProductDetails product={product} currentUser={user} />;
};

export default Page;
