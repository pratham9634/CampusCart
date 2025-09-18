import { NextResponse } from "next/server";
import Product from "@/model/Product";
import connectDB from "@/lib/db";

export default function GET(req){
    const { searchParams } = new URL(req.url);

}