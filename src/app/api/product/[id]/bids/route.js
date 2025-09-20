import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Bid from "@/models/Bid";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { notifyNewBid } from "@/services/realtime";


export async function POST(req, { params }) {
    await connectDB();
    const { userId } = getAuth(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }   

    const session = await mongoose.startSession();
   try {
    // Fetch the product
    const product = await Product.findById(id).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if the product is active
    if (!product.isActive) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Cannot bid on inactive product" }, { status: 400 });
    }

    // Check if the product is an auction
    if (product.type !== "auction") {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Only auction products accept bids" }, { status: 400 });
    }

    // Fetch the highest existing bid
    const highestBidDoc = await Bid.findOne({ product: product._id })
      .sort({ amount: -1 })
      .session(session);

    const currentMax = highestBidDoc ? highestBidDoc.amount : product.price;

    if (numericAmount <= currentMax) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: "Your bid must be higher than the current highest bid" }, { status: 400 });
    }

    // Get bidder information from Clerk
    let bidderName = "Unknown";
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      bidderName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Unknown";
    } catch (e) {
      console.warn("Failed to fetch user from Clerk:", e);
    }

    // Create the new bid
    const [newBid] = await Bid.create(
      [
        {
          product: product._id,
          bidderId: userId,
          bidderName,
          amount: numericAmount,
        },
      ],
      { session }
    );

    // Update the product with the new highest bid
    product.highestBid = {
      amount: numericAmount,
      bidderId: userId,
      bidderName,
      updatedAt: newBid.createdAt,
    };
    await product.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Notify other clients about the new bid
    notifyNewBid(product._id.toString(), {
      _id: newBid._id,
      bidderId: userId,
      bidderName,
      amount: numericAmount,
      createdAt: newBid.createdAt,
    });

    return NextResponse.json({ message: "Bid placed successfully", bid: newBid }, { status: 201 });
  } catch (error) {
    console.error("Error placing bid:", error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}