"use client";

import ProductDetails from "@/components/helper/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Failed to load product");

        const data = await res.json();
        setProduct(data.product);
        setBids(data.bids);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="w-screen h-screen flex items-center justify-center text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  return <ProductDetails product={product} bids={bids} />;
};

export default Page;
