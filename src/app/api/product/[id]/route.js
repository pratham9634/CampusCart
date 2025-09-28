import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import Bid from "@/model/Bid";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(req) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/"); // split path by '/'
  const id = segments[segments.length - 1]; // get the last segment as id

  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bids = await Bid.find({ product: id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean(); // newest first
  return NextResponse.json({ product, bids });
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1]; // product ID from URL

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(id);
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { isActive: !product.isActive },
      { new: true } // return updated document
    );
    console.log(updatedProduct);
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedProduct });
  } catch (error) {
    console.error("Error in PATCH /products/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    // 1. Authentication: Ensure user is logged in
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // split path by '/'
    const productId = segments[segments.length - 1];

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid Product ID" },
        { status: 400 }
      );
    }

    // 2. Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 3. Authorization: Check if the user is the owner or an admin
    const user = await (await clerkClient()).users.getUser(userId);
    const isAdmin = user.publicMetadata?.role === "admin";

    if (product.createdBy.toString() !== userId && !isAdmin) {
      return NextResponse.json(
        {
          error: "Forbidden: You do not have permission to delete this product",
        },
        { status: 403 }
      );
    }

    // 4. Delete associated assets from Cloudinary
    // Delete images (if any)
    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map(extractPublicId).filter((id) => id);
      if (publicIds.length > 0) {
        // Deletes multiple resources at once
        await cloudinary.api.delete_resources(publicIds);
      }
    }

    // Delete video (if it exists)
    if (product.video) {
      const videoPublicId = extractPublicId(product.video);
      if (videoPublicId) {
        await cloudinary.uploader.destroy(videoPublicId, {
          resource_type: "video",
        });
      }
    }

    // 5. Delete the product from the database
    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("🔥 API DELETE Error:", err);
    return NextResponse.json(
      { error: "Failed to delete product", details: err.message },
      { status: 500 }
    );
  }
}
