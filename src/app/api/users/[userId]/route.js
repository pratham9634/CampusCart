import connectDB from "@/lib/db";
import Product from "@/model/Product";
import { NextResponse } from "next/server";
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
// -------------------- GET --------------------
export async function GET(req, { params }) {
  try {
    // ✅ Get userId from URL params
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId in URL" }, { status: 400 });
    }

    // ✅ Fetch current user from Clerk
    const currentUser = await clerk.users.getUser(userId);

    // ✅ Connect DB
    await connectDB();

    // ✅ Fetch products created by this user
    const products = await Product.find({ createdBy: userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      user: currentUser,
      products,
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}
