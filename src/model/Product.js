import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema({
  bidderName: { type: String, required: true },  // name of person who bid
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },  // optional reference if you have User model
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['sale', 'auction'], required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [String],              // array of image URLs
  video: { type: String },       // optional video URL
  email: { type: String, required: true },
  phone: { type: String },
  createdBy: { type: String, required: true },   // user ID string from Clerk or other auth
  // New fields added:
  college: { type: String },     // e.g. college location
  condition: { 
    type: String, 
    enum: ['new', 'used', 'refurbished'], 
    default: 'new' 
  },
  // Bids history sub-document array
  bids: { 
    type: [BidSchema],
    default: [] 
  }
}, {
  timestamps: true    // automatically adds createdAt & updatedAt
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
