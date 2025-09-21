
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import Bid from "@/model/Bid";

export async function GET(req) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/"); // split path by '/'
  const id = segments[segments.length - 1]; // get the last segment as id

  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bids = await Bid.find({ product: id }).sort({ createdAt: -1 }).limit(5).lean(); // newest first
  return NextResponse.json({ product, bids });
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1]; // product ID from URL

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connectDB();

    // Update the product's isActive field to false
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true } // return updated document
    );
    console.log(updatedProduct)
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Product marked as inactive successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in PATCH /products/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}