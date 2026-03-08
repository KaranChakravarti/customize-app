import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  FolderSearch,
  ArrowRight,
  Globe,
  Smartphone,
  PenTool,
} from "lucide-react";

export default async function AdminProjectsPage() {
  // Fetch ALL projects from Neon, ordered by newest first
  const allProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FolderSearch className="text-[#FF4D00]" size={28} /> All Projects
          </h1>
          <p className="text-[#B3B3B3]">
            Manage and track all client requests.
          </p>
        </div>
        <div className="text-sm text-[#B3B3B3] bg-[#151515] border border-[#262626] px-4 py-2 rounded-lg">
          Total Records:{" "}
          <span className="text-white font-bold">{allProjects.length}</span>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#151515] border border-[#262626] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0D0D0D] border-b border-[#262626] text-[#888] text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Project ID</th>
                <th className="p-4 font-medium">Name & Details</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {allProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#666]">
                    No projects found in the database.
                  </td>
                </tr>
              ) : (
                allProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#1A1A1A] transition-colors group"
                  >
                    <td className="p-4 text-xs font-mono text-[#666]">
                      {project.id.slice(-6).toUpperCase()}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white mb-1 group-hover:text-[#FF4D00] transition-colors">
                        {project.name}
                      </p>
                      <ServiceBadge
                        type={project.serviceType}
                        subType={project.subType}
                      />
                    </td>

                    <td className="p-4">
                      <p className="text-sm text-white font-medium">
                        {project.user?.name || "No Name"}
                      </p>
                      <p className="text-xs text-[#888]">
                        {project.user?.email}
                      </p>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={project.status} />
                    </td>

                    <td className="p-4 text-sm text-[#B3B3B3]">
                      {project.createdAt.toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <Link href={`/admin/projects/${project.id}`}>
                        <button className="px-4 py-2 bg-[#262626] hover:bg-[#FF4D00] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-end gap-2 ml-auto">
                          Manage <ArrowRight size={14} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function ServiceBadge({ type, subType }: { type: string; subType: string }) {
  let Icon = Globe;
  let label = "Web";

  if (type === "APP_DEVELOPMENT") {
    Icon = Smartphone;
    label = "App";
  }
  if (type === "GRAPHIC_DESIGN") {
    Icon = PenTool;
    label = "Graphics";
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-[#B3B3B3]">
      <Icon size={12} className="text-[#FF4D00]" />
      <span className="capitalize">
        {label} • {subType}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING_REVIEW: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    IN_DESIGN: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    IN_DEVELOPMENT: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    REVISION: "bg-[#FF4D00]/10 text-[#FF4D00] border-[#FF4D00]/20",
    FINAL_DELIVERY: "bg-green-500/10 text-green-500 border-green-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const currentStyle =
    styles[status] || "bg-[#262626] text-[#B3B3B3] border-[#404040]";

  return (
    <span
      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${currentStyle}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
