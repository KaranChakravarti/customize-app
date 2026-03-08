import { inngest } from "./inngest";
import OpenAI from "openai";
import { prisma } from "./db";

// Initialize the OpenAI client using your Gemini credentials from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export const processNewProject = inngest.createFunction(
  { id: "process-new-project" },
  { event: "project/created" },
  async ({ event, step }) => {
    const { projectId, projectName, clientEmail, serviceType, description, addons } = event.data;

    // Step 1: Generate AI Project Brief
    const aiBrief = await step.run("generate-ai-brief", async () => {
      // If the user didn't provide a description, skip the AI generation
      if (!description || description.trim().length < 5) return null;

      const prompt = `
        You are an expert technical project manager at an elite digital agency. 
        A client just requested a new ${serviceType.replace('_', ' ')} project named "${projectName}".
        
        Client's raw description: "${description}"
        Requested Add-ons: ${addons.length > 0 ? addons.join(', ') : 'None'}

        Based on the client's raw description, generate a professional, structured 3-paragraph Project Scope & Brief. 
        Format it cleanly. Include potential technical requirements, target audience assumptions, and a recommended approach. Do not use markdown, just plain text with line breaks.
      `;

      try {
        const response = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gemini-2.0-flash",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
        });

        return response.choices[0].message.content;
      } catch (error) {
        console.error("AI Generation failed:", error);
        return null;
      }
    });

    // Step 2: Save the AI Brief back to the Neon Database
    if (aiBrief) {
      await step.run("save-brief-to-db", async () => {
        await prisma.project.update({
          where: { id: projectId },
          data: { 
            // We append the AI brief to the original description so you have both
            description: `--- ORIGINAL CLIENT INPUT ---\n${description}\n\n--- AI GENERATED SCOPE ---\n${aiBrief}` 
          }
        });
      });
    }

    // Step 3: Send Email Notifications (Placeholder)
    await step.run("notify-admin", async () => {
      console.log(`[ADMIN ALERT]: New project '${projectName}' needs review! AI Brief generated: ${!!aiBrief}`);
      return { success: true };
    });

    return { message: `Successfully processed project ${projectId} with AI enhancements.` };
  }
);