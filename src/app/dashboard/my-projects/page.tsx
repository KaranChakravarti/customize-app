import React from "react";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Folder,
  ArrowRight,
  Globe,
  Smartphone,
  PenTool,
  Clock,
} from "lucide-react";

export default async function MyProjectsPage() {
  const { userId: clerkId } = auth();
  if (!clerkId) redirect("/sign-in");

  // Fetch only this specific user's projects
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      projects: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user) redirect("/sign-in");

  const projects = user.projects;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Folder className="text-[#FF4D00]" size={28} /> My Projects
          </h1>
          <p className="text-[#B3B3B3]">
            Track the status of your ongoing and past requests.
          </p>
        </div>
        <Link href="/dashboard/new-project">
          <button className="px-5 py-2.5 rounded-lg bg-transparent border border-[#404040] hover:border-[#FF4D00] text-white transition-colors text-sm font-medium">
            + New Request
          </button>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-[#151515] border border-[#262626] border-dashed rounded-2xl p-12 text-center">
          <p className="text-[#B3B3B3]">
            You haven't submitted any projects yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            let Icon = Globe;
            if (project.serviceType === "APP_DEVELOPMENT") Icon = Smartphone;
            if (project.serviceType === "GRAPHIC_DESIGN") Icon = PenTool;

            return (
              <Link
                key={project.id}
                href={`/dashboard/my-projects/${project.id}`}
              >
                <div className="bg-[#151515] border border-[#262626] rounded-2xl p-6 hover:border-[#FF4D00] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#262626] group-hover:border-[#FF4D00]/50 transition-colors">
                      <Icon className="w-6 h-6 text-[#FF4D00]" />
                    </div>
                    <span className="text-xs text-[#B3B3B3] flex items-center gap-1">
                      <Clock size={12} />{" "}
                      {project.createdAt.toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex-1 mb-6">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FF4D00] transition-colors line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-[#888] capitalize">
                      {project.serviceType.replace("_", " ").toLowerCase()} •{" "}
                      {project.subType}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#262626]">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#B3B3B3] mb-2">
                      <span>{project.status.replace("_", " ")}</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0D0D0D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF4D00] transition-all duration-1000"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
