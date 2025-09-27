
import connectDB from "@/lib/db";
import Bid from "@/model/Bid";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/"); // split path by '/'
    const product_Id = segments[segments.length - 1]; // get the last segment as id
    
    console.log("👉 Incoming productId:", product_Id);

    if (!product_Id) {
      return new Response(JSON.stringify({ error: "Missing productId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(product_Id)) {
      return new Response(JSON.stringify({ error: "Invalid productId format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const bids = await Bid.find({ product: product_Id }).sort({ amount: -1 });

    return new Response(JSON.stringify(bids), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in GET /api/bids/[productId]:", err);

    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
