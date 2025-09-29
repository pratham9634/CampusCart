import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import Bid from "@/model/Bid";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

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

const extractPublicId = (url) => {
  if (!url) return null;

  // This regex looks for the part of the URL after a version number (like /v12345/)
  // and captures everything until the final file extension.
  const regex = /\/v\d+\/(.+)\.\w+$/;
  const match = url.match(regex);

  // match[1] will contain the captured group, which is the public ID.
  return match ? match[1] : null;
};

export async function DELETE(req) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectDB();

    // Authentication
    const { userId } = getAuth(req);
    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const productId = segments[segments.length - 1];

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Invalid Product ID" }, { status: 400 });
    }

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Authorization
    const user = await (await clerkClient()).users.getUser(userId);
    const isAdmin = user.privateMetadata?.role === "admin";
    if (product.createdBy.toString() !== userId && !isAdmin) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Forbidden: No permission" }, { status: 403 });
    }

    // Delete related bids
    await Bid.deleteMany({ product: productId }).session(session);

    // Delete images
    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map(imgUrl => extractPublicId(imgUrl)).filter(Boolean);
      if (publicIds.length > 0) {
        const result = await cloudinary.api.delete_resources(publicIds);
        console.log("Image deletion result:", result);
      }
    }

    // Delete video
    if (product.video) {
      const videoId = extractPublicId(product.video);
      if (videoId) {
        await cloudinary.uploader.destroy(videoId, { resource_type: "video" });
      }
    }

    // Delete product
    await Product.findByIdAndDelete(productId).session(session);

    // ✅ Commit if everything succeeded
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ message: "Product and related bids deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("🔥 API DELETE Error:", err);

    // ❌ Rollback if anything fails
    await session.abortTransaction();
    session.endSession();

    return NextResponse.json({ error: "Failed to delete product", details: err.message }, { status: 500 });
  }
}

