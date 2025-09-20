import { NextResponse } from "next/server";
import Product from "@/model/Product";
import connectDB from "@/lib/db";

export  async function GET(req){
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort") || "latest";
    const category = searchParams.get("category") || "";
    const listingType = searchParams.get("listingType") || "";
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit")) || 12;

    const query = {};

    if (category) query.category = category;
    if (listingType) query.type = listingType;
    if (priceMin !== null && priceMin !== undefined && priceMin !== "") query.price = { ...(query.price || {}), $gte: Number(priceMin) };
    if (priceMax !== null && priceMax !== undefined && priceMax !== "") query.price = { ...(query.price || {}), $lte: Number(priceMax) };
    if (search) query.title = { $regex: search, $options: "i" };
    
    let sortOption = { createdAt: -1 }; // default to latest
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "low-to-high") sortOption = { price: 1 };
    else if (sort === "high-to-low") sortOption = { price: -1 };

    const skip = (page - 1) * limit;

     const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec(),
   Product.countDocuments(query)
  ]);

    return NextResponse.json({ products, total });
    
}