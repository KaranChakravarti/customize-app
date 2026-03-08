"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MonitorSmartphone,
  Globe,
  PenTool,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  LayoutDashboard,
  ShoppingCart,
  Smartphone,
  Box,
  Camera,
  Zap,
  ShieldCheck,
} from "lucide-react";
// Import the Server Action we created earlier
import { createProject } from "@/actions/project.actions";

export default function NewProjectWizard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [projectData, setProjectData] = useState({
    serviceType: "",
    subType: "",
    name: "",
    description: "",
    addons: [] as string[],
  });

  const updateData = (key: string, value: any) => {
    setProjectData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAddon = (addonId: string) => {
    setProjectData((prev) => {
      const exists = prev.addons.includes(addonId);
      if (exists)
        return { ...prev, addons: prev.addons.filter((id) => id !== addonId) };
      return { ...prev, addons: [...prev.addons, addonId] };
    });
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    startTransition(async () => {
      // Call the Server Action to save to Neon DB
      const result = await createProject({
        serviceType: projectData.serviceType,
        subType: projectData.subType,
        name: projectData.name,
        description: projectData.description,
        addons: projectData.addons,
      });

      if (result?.success) {
        // Redirect back to dashboard to see the new project
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Something went wrong. Please try again.");
      }
    });
  };

  // Dynamic Add-ons based on Service Type
  const getAddons = () => {
    if (projectData.serviceType === "web")
      return [
        { id: "seo", title: "SEO Optimization", icon: Globe },
        { id: "speed", title: "Speed Optimization", icon: Zap },
      ];
    if (projectData.serviceType === "app")
      return [
        { id: "auth", title: "Advanced Security & Auth", icon: ShieldCheck },
        { id: "push", title: "Push Notifications", icon: Smartphone },
      ];
    if (projectData.serviceType === "graphic")
      return [
        { id: "source", title: "Source Files (AI/PSD)", icon: Box },
        {
          id: "consistency",
          title: "Strict Facial Consistency",
          icon: Camera,
          desc: "Prioritize exact facial features from reference images across all variations.",
        },
      ];
    return [];
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col animate-in fade-in duration-500">
      {/* Wizard Header & Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Create New Project
        </h1>
        <p className="text-[#B3B3B3]">Let's configure your new build.</p>

        <div className="w-full h-1.5 bg-[#262626] rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.5)] transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Dynamic Step Content */}
      <div className="flex-1 bg-[#151515] border border-[#262626] rounded-2xl p-6 md:p-10">
        {/* STEP 1: Choose Domain */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-white">
              1. Select Service Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ServiceCard
                id="web"
                icon={Globe}
                title="Web Development"
                desc="Landing pages, SaaS, E-commerce"
                selected={projectData.serviceType}
                onClick={updateData}
              />
              <ServiceCard
                id="app"
                icon={MonitorSmartphone}
                title="App Development"
                desc="iOS, Android, Cross-platform"
                selected={projectData.serviceType}
                onClick={updateData}
              />
              <ServiceCard
                id="graphic"
                icon={PenTool}
                title="Graphic Design"
                desc="Logos, Branding, Social Media"
                selected={projectData.serviceType}
                onClick={updateData}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Service-Specific Questions */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-white">
              2. Choose Specifics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.serviceType === "web" && (
                <>
                  <SelectionCard
                    id="ecommerce"
                    title="E-Commerce Store"
                    icon={ShoppingCart}
                    current={projectData.subType}
                    onSelect={(val: string) => updateData("subType", val)}
                  />
                  <SelectionCard
                    id="saas"
                    title="SaaS Dashboard"
                    icon={LayoutDashboard}
                    current={projectData.subType}
                    onSelect={(val: string) => updateData("subType", val)}
                  />
                </>
              )}
              {projectData.serviceType === "app" && (
                <>
                  <SelectionCard
                    id="ios"
                    title="Native iOS / Android"
                    icon={Smartphone}
                    current={projectData.subType}
                    onSelect={(val: string) => updateData("subType", val)}
                  />
                  <SelectionCard
                    id="cross"
                    title="Cross Platform (React Native)"
                    icon={MonitorSmartphone}
                    current={projectData.subType}
                    onSelect={(val: string) => updateData("subType", val)}
                  />
                </>
              )}
              {projectData.serviceType === "graphic" && (
                <>
                  <SelectionCard
                    id="branding"
                    title="Logo & Brand Identity"
                    icon={PenTool}
                    current={projectData.subType}
                    onSelect={(val: string) => updateData("subType", val)}
                  />
                  <SelectionCard
                    id="social"
                    title="Social Media Kit"
                    icon={Globe}
                    current={projectData.subType}
                    onSelect={(val: string) => updateData("subType", val)}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Details */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-white">3. Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#B3B3B3] mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF4D00] transition-colors"
                  placeholder="e.g., Nexus Rebrand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B3B3B3] mb-1.5">
                  Brief Description
                </label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => updateData("description", e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF4D00] h-32 resize-none transition-colors"
                  placeholder="Tell us about your goals, target audience, and expectations..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Add-ons & Review */}
        {step === 4 && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                4. Recommended Add-ons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getAddons().map((addon) => {
                  const isSelected = projectData.addons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3
                        ${isSelected ? "bg-[#FF4D00]/10 border-[#FF4D00]" : "bg-[#0D0D0D] border-[#262626] hover:border-[#404040]"}
                      `}
                    >
                      <addon.icon
                        className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? "text-[#FF4D00]" : "text-[#B3B3B3]"}`}
                      />
                      <div>
                        <span
                          className={`font-medium block ${isSelected ? "text-white" : "text-[#B3B3B3]"}`}
                        >
                          {addon.title}
                        </span>
                        {addon.desc && (
                          <span className="text-xs text-[#888] block mt-1">
                            {addon.desc}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-[#262626]">
              <h3 className="text-sm font-bold text-[#888] uppercase tracking-wider mb-4">
                Summary
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-[#B3B3B3]">Service:</span>
                <span className="text-white font-bold uppercase">
                  {projectData.serviceType}
                </span>
                <span className="text-[#B3B3B3]">Type:</span>
                <span className="text-white capitalize">
                  {projectData.subType || "None"}
                </span>
                <span className="text-[#B3B3B3]">Project:</span>
                <span className="text-white">
                  {projectData.name || "Untitled"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={step === 1 || isPending}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${step === 1 ? "opacity-30 cursor-not-allowed text-[#666]" : "hover:bg-[#262626] text-white"}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {step < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !projectData.serviceType) ||
              (step === 2 && !projectData.subType)
            }
            className="px-8 py-3 rounded-lg bg-[#FF4D00] hover:bg-[#FF6A2A] text-white font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-8 py-3 rounded-lg bg-[#00FF88] hover:bg-[#00E67A] text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting..." : "Submit Project"}{" "}
            <CheckCircle2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// --- Helper Components ---

function ServiceCard({ id, icon: Icon, title, desc, selected, onClick }: any) {
  const isSelected = selected === id;
  return (
    <div
      onClick={() => onClick("serviceType", id)}
      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-start gap-4
        ${isSelected ? "border-[#FF4D00] bg-[#FF4D00]/5 shadow-[0_0_15px_rgba(255,77,0,0.15)]" : "border-[#262626] bg-[#0D0D0D] hover:border-[#404040]"}
      `}
    >
      <div
        className={`p-3 rounded-lg ${isSelected ? "bg-[#FF4D00]" : "bg-[#262626]"}`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3
          className={`font-bold text-lg ${isSelected ? "text-white" : "text-[#B3B3B3]"}`}
        >
          {title}
        </h3>
        <p className="text-xs mt-1 text-[#888]">{desc}</p>
      </div>
    </div>
  );
}

function SelectionCard({ id, title, icon: Icon, current, onSelect }: any) {
  const isSelected = current === id;
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3
        ${isSelected ? "border-[#FF4D00] bg-[#FF4D00]/10" : "border-[#262626] bg-[#0D0D0D] hover:border-[#404040]"}
      `}
    >
      <Icon
        className={`w-5 h-5 ${isSelected ? "text-[#FF4D00]" : "text-[#B3B3B3]"}`}
      />
      <span
        className={`font-medium ${isSelected ? "text-white" : "text-[#B3B3B3]"}`}
      >
        {title}
      </span>
    </div>
  );
}
