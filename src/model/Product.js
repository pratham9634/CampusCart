import mongoose from 'mongoose';

const HighestBidSchema = new mongoose.Schema({
  amount: { type: Number, required: true, default: 0 },
  bidderId: { type: String, required: false }, // Clerk user id
  bidderName: { type: String, required: false }, // to show name
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });  // no own _id since embedded

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 200 },
  category: { type: String, required: true, trim: true },
  type: { type: String, enum: ['sale', 'auction'], required: true },
  price: { type: Number, required: true, min: 0 },
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
    default: 'new' 
  },
  isActive: { type: Boolean, default: true },
  highestBid: {
    type: HighestBidSchema,
    default: { amount: 0, bidderId: null, bidderName: null, updatedAt: new Date() }
  }
}, {
  timestamps: true
});

// Indexes for performance
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ "highestBid.amount": -1 });  // to sort or filter by highest bid

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
