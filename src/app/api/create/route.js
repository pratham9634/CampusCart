import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const category = formData.get("category");
    const type = formData.get("type");
    const price = Number(formData.get("price"));
    const description = formData.get("description");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const college = formData.get("college");
    const condition = formData.get("condition");
    
    // --- ✅ NEW: Handle Auction Duration ---
    const auctionDuration = formData.get("auctionDuration"); // e.g., "3", "7"

    if (!title || !category || !type || !price || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle images
    const images = [];
    const imageFiles = formData.getAll("images");

    for (const file of imageFiles) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "campus_cart/images" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

      images.push(result.secure_url);
    }

    // Handle video
    let videoUrl = null;
    const videoFile = formData.get("video");
    if (videoFile && videoFile.size > 0) {
      const arrayBuffer = await videoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "campus_cart/videos", resource_type: "video" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

      videoUrl = result.secure_url;
    }

    // --- ✅ NEW: Calculate auction end date if applicable ---
    let auctionEndDate = null;
    if (type === 'auction' && auctionDuration) {
        const now = new Date();
        // Calculate the end date by adding the duration (in days) to the current date
        auctionEndDate = new Date(now.setDate(now.getDate() + parseInt(auctionDuration, 10)));
    }

    // Save to DB
    // Note: Ensure your Product schema has a field for 'auctionEndDate' of type Date.
    const product = new Product({
      title,
      category,
      type,
      price,
      description,
      images,
      video: videoUrl,
      email,
      phone,
      college,
      condition,
      createdBy: userId,
      auctionEndDate, // Add the calculated end date here
    });

    await product.save();

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json(
      { error: "Failed to add product", details: err.message },
      { status: 500 }
    );
  }
}