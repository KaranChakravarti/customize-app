import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the logged-in user from Clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Extract the user's primary email
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // Grab the admin emails from your .env file
  // Using optional chaining and fallback to empty string to prevent crashes
  const adminEmails =
    process.env.ADMIN_EMAIL?.split(",").map((e) => e.trim()) || [];

  // Check if the current user is in the admin list
  const isAdmin = adminEmails.includes(userEmail);

  if (!isAdmin) {
    // Kick regular users back to their dashboard
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#FFFFFF] flex font-sans selection:bg-[#FF4D00] selection:text-white">
      {/* This is a placeholder for your Admin Sidebar.
        We will build out the actual UI for this next!
      */}
      <aside className="w-64 border-r border-[#262626] bg-[#151515] p-6 hidden md:block">
        <h2 className="text-xl font-bold text-[#FF4D00]">Admin Portal</h2>
        <p className="text-xs text-[#B3B3B3] mt-2">Logged in as: {userEmail}</p>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
