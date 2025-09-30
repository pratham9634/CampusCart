Campus Cart 🛒
A modern OLX-like marketplace for college students to buy, sell, and bid on items in real-time. Campus Cart creates a trusted, exclusive community for students to trade goods within their own campus.

🚀 Live Demo
🌐 https://campus-cart.vercel.app/

✨ Overview
Campus Cart is a full-stack web application designed to simplify the process of buying and selling second-hand goods within a college campus. It moves beyond simple listings by incorporating a dynamic, real-time bidding system, creating an engaging and competitive marketplace. Listings are temporary and automatically expire, ensuring the marketplace stays fresh and relevant.

🌟 Key Features
Feature	Icon	Description
Authentication	🔑	Secure and seamless login/signup experience powered by Clerk for robust user management.
Buy & Sell	🛍️	Easily list products with multiple images, detailed descriptions, and a starting price.
Real-time Bidding	💸	Place bids on items and see updates instantly across all clients, powered by Socket.io.
College-specific	🏫	A closed-loop marketplace ensuring you only trade with verified students from your campus community.
Auto Expiry	⏳	Temporary listings automatically get deleted after their expiration time, keeping the platform clean.
Responsive UI	📱	A modern and clean user interface that works perfectly on both mobile devices and desktops.

🛠️ Tech Stack

Frontend: Next.js, React, Tailwind CSS, Framer Motion
Backend: Next.js API Routes, Socket.io
Database: MongoDB Atlas
Authentication: Clerk
Image Storage: Cloudinary
Deployment: Vercel (Frontend + API), Render (Socket Server)

🏗️ Architecture Diagram
<img width="1024" height="1024" alt="Campus_Cart_Architecture_Design" src="https://github.com/user-attachments/assets/b4a8dfd5-f29c-476e-94a9-952a07ed9c32" />


📷 Screenshots / GIFs
Here's a glimpse of Campus Cart in action
HomePage :![home](https://github.com/user-attachments/assets/d229de4a-67de-4ebd-af5c-6b75e673ba47)
CreateItemPage : ![create](https://github.com/user-attachments/assets/cf366fdb-b7b2-43ef-bc1d-ffaa7c62e948)
BrowsePage : ![browse](https://github.com/user-attachments/assets/d36006b1-6624-4b4b-9404-961955a80f77)
ProductDetailPage : ![detail](https://github.com/user-attachments/assets/acf2da0c-09ff-452b-acd8-4bb8c64d88a8)


🛠️ Developer Setup
Follow these instructions to get a local copy of the project up and running for development and testing purposes.

Prerequisites
Node.js (v18 or later)

npm or yarn

MongoDB Atlas account

Clerk account

Cloudinary account

Installation & Setup
Clone the repository:

Bash

git clone https://github.com/your-username/campuscart.git
cd campuscart
Install dependencies:

Bash
npm install
# or
yarn install
Set up Environment Variables:
Create a file named .env.local in the root of the project and add the following keys. Obtain these from your respective service dashboards.

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Socket.io Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000 # For local development
PORT=5000

Run the application:
You'll need two separate terminal windows for this.

Terminal 1: Run the Next.js Frontend & API Server:

Bash

npm run dev
Your application should now be running on http://localhost:3000.

Terminal 2: Run the Socket.io Server:

Bash

node server.js
Your real-time bidding server will be running on http://localhost:8080.

🚀 Deployment
The project is architected for modern serverless and PaaS platforms:

Frontend + API Routes: Deployed on Vercel. Vercel handles the Next.js build and serverless functions seamlessly.

Socket.io Server: Deployed on Render as a web service.

Database: Hosted on MongoDB Atlas.

⚡ Future Improvements
💳 Payment Integration: Integrate Stripe or Razorpay for secure in-app transactions.

💬 In-App Chat: Allow buyers and sellers to communicate directly within the app.

🧠 AI Recommendations: Implement a recommendation engine to suggest products to users.

🔔 Push Notifications: Notify users about new bids, outbids, and listing expiries.

🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
This project is distributed under the MIT License. See LICENSE for more information.

👨‍💻 Author
Pratham Petwal

📧 Email: prathampetwal100@gmail.com 

🐙 GitHub: https://github.com/pratham9634

🔗 LinkedIn: https://www.linkedin.com/in/prathampetwal
