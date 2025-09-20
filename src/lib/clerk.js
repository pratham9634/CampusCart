"use server"
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

export const getUserById = async (userId) => {
  try {
    const user = await clerk.users.getUser(userId);
    return {
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
      email: user.emailAddresses[0]?.emailAddress || "N/A",
      memberSince: user.createdAt,
    };
  } catch (error) {
    console.error("Error fetching user from Clerk:", error);
    return null;
  }
};
