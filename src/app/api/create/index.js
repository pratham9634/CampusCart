import { NextResponse } from "next/server";
import multer from "multer";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Product from "@/model/Product";
import cloudinary from "@/lib/cloudinary";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Promise wrapper for multer
function parseForm(req) {
  return new Promise((resolve, reject) => {
    upload.fields([
      { name: "images", maxCount: 6 },
      { name: "video", maxCount: 1 },
    ])(req, {}, (err) => {
      if (err) return reject(err);
      resolve({
        fields: req.body,
        file: req.files,
      });
    });
  });
}

export async function POST(req) {
  try {
    await connectDB();

    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the multipart/form-data
    const { fields, files } = await parseForm(req); // changed 'file' to 'files'

    console.log("Fields:", fields);
    console.log("Files:", files);

    const { title, category, type, price, description, email, phone } = fields;

    const images = [];
    let video = null;

    // Upload images if present
    if (files["images"] && files["images"].length > 0) {
      for (const imgFile of files["images"]) { // renamed to imgFile
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "campus_cart/images" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(imgFile.buffer);
        });
        images.push(result.secure_url);
      }
    }

    // Upload video if present
    if (files["video"] && files["video"].length > 0) {
      const vidFile = files["video"][0]; // renamed to vidFile
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "campus_cart/videos", resource_type: "video" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(vidFile.buffer);
      });
      video = result.secure_url;
    }

    // Create the product document
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
      createdBy: userId,
    });

    await product.save();

    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });
  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json({ error: "Failed to add product", details: err.message }, { status: 500 });
  }
}

