import 'dotenv/config';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/lib/db.js";
import Product from "./src/model/Product.js";
import Bid from "./src/model/Bid.js"; // Import the Bid model for a scalable bidding history

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // IMPORTANT: In production, restrict this to your frontend's domain (e.g., "http://localhost:3000")
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// A simple health-check endpoint to verify the server is running
app.get("/", (req, res) => {
  res.send("✅ Real-time Bidding Server is running!");
});

// Main Socket.IO connection logic
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  // Handler for when a client joins a specific product's "room"
  socket.on("joinProductRoom", (productId) => {
    socket.join(productId);
    console.log(`Client ${socket.id} joined room for product: ${productId}`);
  });

  // This is the primary handler for receiving and processing new bids
  socket.on("placeBid", async (data) => {
    try {
      const { productId, bidderId, bidderName, amount } = data;

      // 1. Find the product being bid on
      const product = await Product.findById(productId);
      if (!product) {
        socket.emit("bidError", { message: "Product not found." });
        return;
      }

      // 2. Validate the bid amount
      // The new bid must be strictly greater than the current highest bid.
      if (product.highestBid && amount <= product.highestBid.amount) {
        socket.emit("bidError", { message: "Your bid must be higher than the current highest bid." });
        return;
      }

      // 3. Create a new bid document in the 'bids' collection
      // This creates a persistent record of every bid placed.
      await Bid.create({
        product: productId,
        bidderId,
        bidderName,
        amount,
      });

      // 4. Update the highest bid information on the product document itself
      product.highestBid = {
        amount,
        bidderId,
        bidderName,
        time: new Date(),
      };
      await product.save();

      // 5. Fetch all bids for this product to ensure the client gets the full, updated list
      const allBids = await Bid.find({ product: productId }).sort({ amount: -1 });

      // 6. Broadcast the successful new bid to ALL clients in the product room
      io.to(productId).emit("newBid", {
        productId,
        highestBid: product.highestBid,
        bids: allBids, // Send the complete, sorted list of all bids
      });

    } catch (err) {
      console.error("Error processing bid:", err);
      // If an error occurs, notify only the client who placed the bid
      socket.emit("bidError", { message: "A server error occurred while placing your bid." });
    }
  });

  // Handler for when a client disconnects
  socket.on("disconnect", () => {
    console.log(`👋 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Socket.IO server is live on port ${PORT}`));