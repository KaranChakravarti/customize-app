import React from "react";
import { prisma } from "@/lib/db";
import {
  Users,
  Folder,
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  Smartphone,
  PenTool,
} from "lucide-react";
import Link from "next/link";

// Helper to format currency
const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

export default async function AdminDashboard() {
  // Fetch real-time data from your Neon PostgreSQL database
  const totalUsers = await prisma.user.count({
    where: { role: "USER" },
  });

  const totalProjects = await prisma.project.count();

  const pendingProjects = await prisma.project.count({
    where: { status: "PENDING_REVIEW" },
  });

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Admin Command Center
        </h1>
        <p className="text-[#B3B3B3]">
          Here is the current status of your agency.
        </p>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={totalUsers.toString()}
          icon={Users}
          color="text-blue-400"
        />
        <StatCard
          title="Total Projects"
          value={totalProjects.toString()}
          icon={Folder}
          color="text-purple-400"
        />
        <StatCard
          title="Needs Review"
          value={pendingProjects.toString()}
          icon={Clock}
          color="text-[#FF4D00]"
          highlight={pendingProjects > 0}
        />
        <StatCard
          title="Est. Revenue"
          value={`${currencySymbol}0`}
          icon={CheckCircle}
          color="text-green-400"
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-[#151515] border border-[#262626] rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Recent Project Requests
          </h2>
          <Link
            href="/admin/projects"
            className="text-sm text-[#FF4D00] hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] text-[#888] text-xs uppercase tracking-wider">
                <th className="pb-3 font-medium">Project Name</th>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {recentProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#666]">
                    No projects found. Waiting for clients to submit!
                  </td>
                </tr>
              ) : (
                recentProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-[#1A1A1A] transition-colors"
                  >
                    <td className="py-4 font-bold text-white">
                      {project.name}
                    </td>
                    <td className="py-4 text-sm text-[#B3B3B3]">
                      {project.user?.name ||
                        project.user?.email ||
                        "Unknown Client"}
                    </td>
                    <td className="py-4">
                      <ServiceBadge type={project.serviceType} />
                    </td>
                    <td className="py-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/projects/${project.id}`}>
                        <button className="px-3 py-1.5 bg-[#262626] hover:bg-[#FF4D00] text-white text-xs font-medium rounded transition-colors">
                          Manage
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

function StatCard({ title, value, icon: Icon, color, highlight = false }: any) {
  return (
    <div
      className={`p-5 rounded-xl border ${highlight ? "border-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.1)]" : "border-[#262626]"} bg-[#151515] flex items-center gap-4`}
    >
      <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#262626]">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-[#888] uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

function ServiceBadge({ type }: { type: string }) {
  let Icon = Globe;
  let label = "Web Dev";

  if (type === "APP_DEVELOPMENT") {
    Icon = Smartphone;
    label = "App Dev";
  }
  if (type === "GRAPHIC_DESIGN") {
    Icon = PenTool;
    label = "Graphics";
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-[#B3B3B3]">
      <Icon size={14} /> {label}
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
  const label = status.replace("_", " ");

  return (
    <span
      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${currentStyle}`}
    >
      {label}
    </span>
  );
}
