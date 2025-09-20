
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import Bid from "@/model/Bid";

export async function GET(req, {params}) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/"); // split path by '/'
  const id = segments[segments.length - 1]; // get the last segment as id

  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bids = await Bid.find({ product: id }).sort({ createdAt: -1 }).limit(5).lean(); // newest first
  return NextResponse.json({ product, bids });
}
