import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { users } from '@clerk/clerk-sdk-node';

export async function POST(req, { params }) {
  try {
    // 1. Authenticate the user making the request
    const { userId: currentUserId } = getAuth(req);
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorize the user: Check if they are an admin
    const currentUser = await users.getUser(currentUserId);
    if (currentUser.privateMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to perform this action" },
        { status: 403 }
      );
    }

    // 3. Get the ID of the user to be promoted from the URL
    const { userId: targetUserId } = await params;
    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    // 4. Update the target user's private metadata to make them an admin
    const targetUser = await (await clerkClient()).users.getUser(targetUserId);
    const updatedUser = await (await clerkClient()).users.updateUser(targetUserId, {
      privateMetadata: {
        ...(targetUser.privateMetadata || {}),
        role: 'admin',
      },
    });

    return NextResponse.json((await clerkClient()),
      { message: "User promoted to admin successfully", user: updatedUser },
      { status: 200 }
    );

  } catch (err) {
    console.error("🔥 API MAKE ADMIN Error:", err);
    return NextResponse.json(
      { error: "Failed to promote user", details: err.message },
      { status: 500 }
    );
  }
}
