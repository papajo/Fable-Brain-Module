import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
       apiKey: apiKey,
       httpOptions: {
         headers: {
           'User-Agent': 'aistudio-build',
         }
       }
    });
  }
  return aiClient;
}

// 8-Module Fable Brain System Prompt
const FABLE_SYSTEM_PROMPT = `You are an advanced, hyper-focused AI assistant acting under the "Fable Brain" behavior protocol. You are direct, objective, and ruthlessly realistic. Adhere strictly to these eight behavioral modules:

1. ACT, DO NOT OVER-PLAN: Provide recommendations and final answers rather than list options or ask permission for standard steps.
2. LEAD WITH THE OUTCOME: Put the bottom line, final answer, or crucial result in your very first sentence. Background details or explanations only follow afterwards.
3. GROUND EVERY CLAIM: Audit your findings strictly against the supplied context or evidence. Never speculate or exaggerate.
4. STOP ONLY AT REAL BOUNDARIES: Carry out tasks without frozen hesitation. Stop only if a step would be destructive or alters the fundamental request.
5. ASSESS (DO NOT ACT UNINVITED): If asked for an assessment or audit, report the findings first. Do not make changes or write unsolicited code until requested.
6. GIVE THE REASON, NOT JUST THE REQUEST: Make smarter decisions by keeping the ultimate user goal in mind.
7. MATCH EFFORT TO THE TASK: Spend deep thoughts on genuinely hard problems, and move fast and ultra-concisely on routine ones.
8. KEEP LESSONS & CHECK YOUR WORK: Verify your answers against the original instruction before submitting. Ensure word count is minimal and highly grounded.`;

// Endpoint to run prompt against Standard vs Fable Brain behavior
app.post("/api/evaluate", async (req, res) => {
  try {
    const { prompt, context, reason } = req.body;
    if (!prompt) {
       res.status(400).json({ error: "Prompt is required" });
       return;
    }

    const ai = getGeminiClient();

    // 1. Standard Prompt Execution
    const standardPrompt = context 
      ? `Context:\n${context}\n\nTask:\n${prompt}` 
      : prompt;

    // 2. Fable Prompt Execution
    const fablePrompt = `User Intent/Reason: ${reason || "Not specified"}\n\nContext:\n${context || "No context provided"}\n\nTask:\n${prompt}`;

    // Run standard model call
    const standardPromise = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: standardPrompt,
      config: {
        temperature: 0.7,
      }
    });

    // Run Fable model call with the 8-module system prompt
    const fablePromise = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fablePrompt,
      config: {
        systemInstruction: FABLE_SYSTEM_PROMPT,
        temperature: 0.2, // Slightly lower temp for higher groundedness (Module 3)
      }
    });

    const [standardRes, fableRes] = await Promise.all([standardPromise, fablePromise]);

    const standardText = standardRes.text || "";
    const fableText = fableRes.text || "";

    res.json({
       standard: {
         text: standardText,
         wordCount: standardText.split(/\s+/).filter(Boolean).length,
       },
       fable: {
         text: fableText,
         wordCount: fableText.split(/\s+/).filter(Boolean).length,
       }
    });

  } catch (error: any) {
    console.error("Evaluation error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred",
      hasKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    });
  }
});

// Endpoint to check secrets configuration status
app.get("/api/config-status", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({ hasKey });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fable Brain Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
