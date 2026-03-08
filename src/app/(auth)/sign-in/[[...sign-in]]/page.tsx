import { SignIn } from "@clerk/nextjs";
import { Code } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4 selection:bg-[#FF4D00] selection:text-white">
      {/* Brand Logo Header */}
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-bold text-white mb-8 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#FF4D00] to-[#FF6A2A] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,77,0,0.4)]">
          <Code size={18} className="text-white" />
        </div>
        Create & Customize
      </Link>

      {/* Clerk Component with Custom Theme */}
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-[#FF4D00] hover:bg-[#FF6A2A] text-white shadow-none",
            card: "bg-[#151515] border border-[#262626] shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-[#B3B3B3]",
            socialButtonsBlockButton:
              "bg-[#0D0D0D] border border-[#262626] hover:bg-[#262626] text-white transition-colors",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-[#262626]",
            dividerText: "text-[#B3B3B3]",
            formFieldLabel: "text-[#B3B3B3]",
            formFieldInput:
              "bg-[#0D0D0D] border border-[#262626] text-white focus:border-[#FF4D00] transition-colors",
            footerActionText: "text-[#B3B3B3]",
            footerActionLink: "text-[#FF4D00] hover:text-[#FF6A2A]",
            identityPreviewText: "text-white",
            identityPreviewEditButton: "text-[#FF4D00] hover:text-[#FF6A2A]",
            formFieldInputShowPasswordButton: "text-[#B3B3B3] hover:text-white",
          },
        }}
      />
    </div>
  );
}
