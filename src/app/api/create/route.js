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

    // ✅ Parse formData directly
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
    if (!title || !category || !type || !price || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Handle images
    const images = [];
    const imageFiles = formData.getAll("images"); // ✅ multiple files

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
    let video = null;
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

      video = result.secure_url;
    }

    // Save to DB
    const product = new Product({
      title,
      category,
      type,
      price,
      description,
      images,
      video,
      email,
      phone,
      college,
      condition,
      createdBy: userId,
    });

    await product.save();

    return NextResponse.json(
      { message: "Product created successfully"},
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
