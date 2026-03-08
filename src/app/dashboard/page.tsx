import React from "react";
import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MonitorSmartphone,
  LayoutDashboard,
  Box,
  Settings,
  UploadCloud,
  Rocket,
  PenTool,
  CheckCircle2,
  FileText,
  MessageSquare,
  Activity,
  CreditCard,
  Plus,
} from "lucide-react";

export default async function DashboardOverview() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();

  // Fetch the user and their projects
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      projects: {
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
    },
  });

  if (!user) redirect("/sign-in");

  const projects = user.projects || [];
  const latestProject = projects[0];

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => !["COMPLETED", "CANCELLED"].includes(p.status),
  ).length;
  // Calculate average progress roughly
  const avgProgress = totalProjects
    ? Math.round(
        projects.reduce((acc, p) => acc + (p.progress || 0), 0) / totalProjects,
      )
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER WIDGET */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {clerkUser?.firstName || "Creator"}.
          </h1>
          <p className="text-[#B3B3B3]">
            {latestProject
              ? `Status for your latest project "${latestProject.name}" is `
              : "Let's build something amazing today."}
            {latestProject && (
              <span className="text-[#00FF88] font-semibold">
                {latestProject.status?.replace(/_/g, " ") || "ACTIVE"}
              </span>
            )}
          </p>
        </div>
        <div className="bg-[#151515] border border-[#262626] px-4 py-2 rounded-full flex items-center gap-2 w-fit">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-sm font-medium text-[#B3B3B3]">
            System Online
          </span>
        </div>
      </div>

      {/* STATS SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value={activeProjects.toString()}
          icon={Activity}
          color="text-[#FF4D00]"
        />
        <StatCard
          title="Total Projects"
          value={totalProjects.toString()}
          icon={LayoutDashboard}
          color="text-blue-400"
        />
        <StatCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          icon={CheckCircle2}
          color="text-[#00FF88]"
        />
        <StatCard
          title="Latest Type"
          value={
            latestProject ? latestProject.serviceType.split("_")[0] : "N/A"
          }
          icon={MonitorSmartphone}
          color="text-purple-400"
        />
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LATEST PROJECT PROGRESS TRACKER */}
          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-6 lg:col-span-2 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">
                Latest Mission Status
              </h2>
              <Link href={`/dashboard/my-projects/${latestProject.id}`}>
                <button className="text-sm text-[#FF4D00] hover:underline">
                  View Details
                </button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-36 h-36 shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#262626"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#FF4D00"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (latestProject.progress || 0) / 100)}`}
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(255,77,0,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white leading-none">
                    {latestProject.progress || 0}%
                  </span>
                </div>
              </div>

              <div className="flex-1 w-full">
                <h3 className="text-lg font-bold text-[#00FF88] mb-2 flex items-center gap-2 capitalize">
                  <Activity className="w-5 h-5" /> Phase:{" "}
                  {latestProject.status?.replace(/_/g, " ").toLowerCase() ||
                    "Requirement Analysis"}
                </h3>
                <p className="text-sm text-[#B3B3B3] mb-4">
                  Our team is currently reviewing your project details. We will
                  reach out shortly to update you on the next milestone.
                </p>
                <div className="w-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white truncate max-w-[70%]">
                      {latestProject.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-[#262626] rounded-md text-[#B3B3B3] capitalize">
                      {latestProject.serviceType
                        ?.replace(/_/g, " ")
                        .toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-[#151515] border border-[#262626] rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/new-project"
                className="bg-[#FF4D00]/10 border border-[#FF4D00]/30 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-[#FF4D00] hover:text-white transition-colors text-[#FF4D00] relative overflow-hidden group"
              >
                <Rocket
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-center">
                  New Project
                </span>
              </Link>
              <Link
                href="/dashboard/my-projects"
                className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF4D00] transition-colors text-[#B3B3B3] hover:text-white group"
              >
                <LayoutDashboard
                  size={24}
                  className="group-hover:text-[#FF4D00] transition-colors"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-center">
                  My Projects
                </span>
              </Link>
              <button
                disabled
                className="opacity-50 cursor-not-allowed bg-[#0D0D0D] border border-[#262626] rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-[#B3B3B3]"
              >
                <UploadCloud size={24} />
                <span className="text-xs font-bold uppercase tracking-wider text-center">
                  Upload Files
                </span>
              </button>
              <button
                disabled
                className="opacity-50 cursor-not-allowed bg-[#0D0D0D] border border-[#262626] rounded-xl p-5 flex flex-col items-center justify-center gap-3 text-[#B3B3B3]"
              >
                <Settings size={24} />
                <span className="text-xs font-bold uppercase tracking-wider text-center">
                  Settings
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* NO PROJECTS EMPTY STATE */
        <div className="bg-[#151515] border border-[#262626] border-dashed rounded-2xl p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#FF4D00]/10 flex items-center justify-center mb-6">
            <Rocket className="w-10 h-10 text-[#FF4D00]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No active projects yet
          </h2>
          <p className="text-[#B3B3B3] max-w-md mb-8">
            You haven't submitted any project requests. Start a new project to
            kick off your app, website, or graphic design.
          </p>
          <Link href="/dashboard/new-project">
            <button className="px-8 py-4 rounded-lg bg-[#FF4D00] hover:bg-[#FF6A2A] text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,77,0,0.3)]">
              Start Your First Project <Rocket className="w-5 h-5" />
            </button>
          </Link>
        </div>
      )}

      {/* COMMUNICATION WIDGET (Always visible) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FF4D00]/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-[#FF4D00]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Need to discuss details?
            </h3>
            <p className="text-sm text-[#B3B3B3]">
              Leave feedback or talk with our dedicated project managers.
            </p>
          </div>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <button
            disabled
            className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-[#262626] hover:bg-[#333] text-white font-medium transition-colors opacity-70 cursor-not-allowed"
          >
            Leave Note
          </button>
          <button
            disabled
            className="flex-1 md:flex-none px-6 py-3 rounded-lg bg-[#FF4D00] hover:bg-[#FF6A2A] text-white font-bold transition-colors shadow-[0_0_15px_rgba(255,77,0,0.3)] opacity-70 cursor-not-allowed"
          >
            Open Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper components for Dashboard
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-[#151515] border border-[#262626] flex items-center gap-4">
      <div className="p-3 rounded-lg bg-[#262626]">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-[#888] uppercase tracking-wide">
          {title}
        </p>
        <p className="text-xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}
