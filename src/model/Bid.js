import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true },
  bidderId: { type: String }, // clerk id or user id
  bidderName: { type: String },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.models.Bid || mongoose.model('Bid', BidSchema);
