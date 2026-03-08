import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { processNewProject } from "@/lib/inngest-functions";

// Create an API that serves your background jobs
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processNewProject,
  ],
});