'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { inngest } from '@/lib/inngest'; 

const SERVICE_MAP: Record<string, 'WEB_DEVELOPMENT' | 'APP_DEVELOPMENT' | 'GRAPHIC_DESIGN'> = {
  web: 'WEB_DEVELOPMENT',
  app: 'APP_DEVELOPMENT',
  graphic: 'GRAPHIC_DESIGN',
};

// --- 1. CREATE PROJECT (Called by the Client Wizard) ---
export async function createProject(formData: {
  serviceType: string;
  subType: string;
  name: string;
  description: string;
  addons: string[];
  assets?: { fileName: string; fileUrl: string; fileType: string }[];
}) {
  try {
    const { userId: clerkId } = auth();
    const userDetails = await currentUser(); 
    
    if (!clerkId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new Error("User not found in database.");

    const mappedServiceType = SERVICE_MAP[formData.serviceType];
    if (!mappedServiceType) throw new Error("Invalid service type.");

    // Save to Neon PostgreSQL
    const newProject = await prisma.project.create({
      data: {
        userId: user.id,
        serviceType: mappedServiceType,
        subType: formData.subType,
        name: formData.name || 'Untitled Project',
        description: formData.description || '',
        addons: formData.addons || [],
        assets: {
          create: formData.assets?.map(asset => ({
            fileName: asset.fileName,
            fileUrl: asset.fileUrl,
            fileType: asset.fileType,
          })) || [],
        }
      },
    });

    // Trigger Inngest Background Job (AI Generation & Email Notifications)
    await inngest.send({
      name: "project/created",
      data: {
        projectId: newProject.id,
        projectName: newProject.name,
        clientEmail: userDetails?.emailAddresses[0]?.emailAddress || user.email,
        serviceType: mappedServiceType,
        description: formData.description, // <-- ADD THIS LINE
        addons: newProject.addons,
      },
    });

    // Refresh UI
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { success: true, projectId: newProject.id };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project. Please try again." };
  }
}


// --- 2. UPDATE PROJECT STATUS (Called by the Admin Dashboard) ---
export async function updateProjectStatus(projectId: string, newStatus: any, newProgress: number) {
  try {
    const { userId: clerkId } = auth();
    const user = await currentUser();
    
    // Security check: Ensure the person doing this is an Admin
    const adminEmails = process.env.ADMIN_EMAIL?.split(",").map(e => e.trim()) || [];
    const userEmail = user?.emailAddresses[0]?.emailAddress || "";
    
    if (!clerkId || !adminEmails.includes(userEmail)) {
      throw new Error("Unauthorized: Admin access required.");
    }

    // Update the database
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: newStatus,
        progress: newProgress,
      },
    });

    // Refresh the relevant pages so changes appear instantly without refreshing the browser
    revalidatePath('/admin');
    revalidatePath('/dashboard');
    revalidatePath(`/admin/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Could not update project status." };
  }
}