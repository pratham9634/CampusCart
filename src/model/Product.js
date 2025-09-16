import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['sale', 'auction'], required: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [String],
    video: { type: String },  // Optional video URL or file path
    email: { type: String, required: true },
    phone: { type: String },
    createdBy: { type: String, required: true }  // Clerk user ID
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
