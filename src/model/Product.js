import mongoose from 'mongoose';

const HighestBidSchema = new mongoose.Schema({
  amount: { type: Number, required: true, default: 0 },
  bidderId: { type: String, required: false }, // Clerk user id
  bidderName: { type: String, required: false }, // to show bidder's name
  time: { type: Date, default: Date.now }      // Renamed for clarity
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 200 },
  category: { type: String, required: true, trim: true },
  type: { type: String, enum: ['sale', 'auction'], required: true },
  price: { type: Number, required: true, min: 0 }, // Starting price for auctions
  description: { type: String, trim: true },
  images: {
    type: [String],
    validate: {
      validator: (arr) => arr.length <= 6,
      message: 'A product can have at most 6 images'
    }
  },
  video: { type: String },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  createdBy: { type: String, required: true },
  college: { type: String, trim: true },
  condition: { 
    type: String, 
    enum: ['new', 'used', 'refurbished'], 
    default: 'used' 
  },
  // ✅ NEW: Field to store the end date for auctions
  auctionEndDate: { 
    type: Date 
  },
  isActive: { type: Boolean, default: true },
  highestBid: {
    type: HighestBidSchema,
    // Sets a default structure for new products
    default: () => ({ amount: 0, time: new Date() }) 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Indexes for performance
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ "highestBid.amount": -1 }); 
ProductSchema.index({ auctionEndDate: 1, isActive: 1 }); // Index for querying active auctions

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);