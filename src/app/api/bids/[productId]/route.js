// src/app/api/bids/[productId]/route.js
import connectDB from "@/lib/db";
import Bid from "@/model/Bid";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  const { productId } = params;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return new Response(JSON.stringify({ error: "Invalid or missing productId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectDB();

    // Fetch all bids for this product, descending order
    const bids = await Bid.find({ product: productId }).sort({ amount: -1 });

    return new Response(JSON.stringify(bids), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
