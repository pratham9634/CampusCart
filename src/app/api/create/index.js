import connectDB from "@/lib/db";
import Product from "@/model/Product";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    //connect to db
    await connectDB();

    //checking the method
    if(req.method!=='Post'){
        return res.status(405).json({error:"Method not allowed"});
    }

    //extract user from clerk 
    const {userId} = getAuth(res);
    if(!userId){
        return res.status(401).json({error:"Unauthorized"});
    }

    //add product to db
    try{
         const { title, category, type, price, description, images, video, email, phone } = req.body;

         const product = new Product({
            title,
            title,
            category,
            type,
            price,
            description,
            images,
            video,
            email,
            phone,
            createdBy: userId
         });

         await Product.save();

         return res.status(201).json({message:"Product created successfully", product});

    }catch(err){
        console.log(err);
        return res.status(500).json({error:"failed to add product "});
    }
}