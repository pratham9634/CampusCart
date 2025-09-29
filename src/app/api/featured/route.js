import connectDB from "@/lib/db";
import Product from "@/model/Product";

export async function GET(req) {
  try {
    await connectDB(); // connect to MongoDB

    // Fetch latest 5 products
    const products = await Product.find({})
      .sort({ createdAt: -1 }) // newest first
      .limit(5);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
