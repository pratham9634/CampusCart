
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import { clerkClient } from "@clerk/nextjs/server";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// -------------------- GET --------------------
export async function GET(req) {
  try {
    // ✅ Get auth info
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(userId);

    const currentUser = await clerk.users.getUser(userId);
    //console.log(currentUser)
    // ✅ Check if admin
    const isAdmin = currentUser.privateMetadata?.role === "admin";

    // ✅ Fetch user list (only if admin, else just current user)
    const users = isAdmin
      ? await (await clerkClient()).users.getUserList({ limit: 100 })
      : [currentUser];
      console.log(users);
    // ✅ Connect DB
    await connectDB();

    // ✅ Fetch products created by current user
    const products = await Product.find({ createdBy: userId }).sort({ createdAt: -1 });
    //console.log(products)
    return NextResponse.json({
      success: true,
      currentUser,
      users,
      isAdmin,
      products,
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}



// -------------------- POST --------------------
export async function POST(req) {
  try {
    const { targetUserId, data } = await req.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "targetUserId required" }, { status: 400 });
    }

    // ✅ Update user profile and metadata
    await (await clerkClient()).users.updateUser(targetUserId, {
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: data.publicMetadata || {},
    });

    return NextResponse.json({ success: true, message: "User metadata updated" });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

