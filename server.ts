import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "50mb" }));

// OpenRouter-compatible model client. The key is read server-side only.
const getOpenRouterConfig = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.openrouter_api_key;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is missing.");
  }
  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
  };
};

const generateOpenRouterContent = async (
  prompt: string,
  systemInstruction: string,
  jsonMode = false,
) => {
  const { apiKey, model } = getOpenRouterConfig();
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "FinVision Analytics",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt },
      ],
      max_tokens: jsonMode ? 6000 : 2000,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenRouter request failed with HTTP ${response.status}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content.map((part: any) => part?.text || "").join("");
  }
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenRouter returned an empty response.");
  }
  return content;
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Data & Financial Analysis Endpoint
app.post("/api/ai-analyze", async (req, res) => {
  try {
    const { datasetName, rowCount, columnCount, columnsSummary, sampleRows, calculatedMetrics, riskOverview } = req.body;

    const prompt = `
You are a Managing Director & Chief Financial Analyst at an elite Fortune 500 Multinational Corporation (MNC).
Analyze the following enterprise dataset and financial/operational metrics to produce an executive-ready financial report and strategic insights.

### DATASET OVERVIEW
- Name: ${datasetName || "Uploaded Enterprise Dataset"}
- Rows: ${rowCount}, Columns: ${columnCount}
- Column Metadata & Summary Stats: ${JSON.stringify(columnsSummary)}
- Sample Records: ${JSON.stringify(sampleRows?.slice(0, 5))}
- Calculated Financial & ML Metrics: ${JSON.stringify(calculatedMetrics)}
- Detected Risk & Anomaly Indicators: ${JSON.stringify(riskOverview)}

Deliver a rigorous, professional MNC Financial & Business Insights Report in structured JSON format.
Include exact strategic figures, risk scores, and clear ROI estimates where applicable.
`;

    const jsonText = await generateOpenRouterContent(
      prompt,
      "You are an expert MNC Financial & ML Data Analyst. Return only valid JSON matching the requested executive report structure, with sharp analysis, numerical rigor, risk mitigation strategies, and strategic recommendations.",
      true,
    );
    const reportData = JSON.parse(jsonText);
    res.json({ success: true, report: reportData });
  } catch (error: any) {
    console.error("Error in /api/ai-analyze:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to generate AI analysis." });
  }
});

// AI Q&A Assistant Endpoint
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { question, datasetContext, previousReport } = req.body;

    const prompt = `
You are the Lead Financial Analyst & Data Scientist advising corporate executives.
The user is asking a specific question regarding their enterprise dataset and financial metrics.

### DATASET CONTEXT
${JSON.stringify(datasetContext)}

### PREVIOUS EXECUTIVE REPORT SUMMARY
${JSON.stringify(previousReport?.executiveSummary || {})}

### USER QUESTION
"${question}"

Provide a direct, analytical, and actionable answer. Use bullet points, quantitative financial reasoning, risk implications, and strategic advice where appropriate.
`;

    const answer = await generateOpenRouterContent(
      prompt,
      "You are a professional corporate financial analyst. Answer questions concisely with clear financial math, risk commentary, and business strategy recommendations.",
    );

    res.json({ success: true, answer });
  } catch (error: any) {
    console.error("Error in /api/ai-chat:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to process question." });
  }
});

// Start express server & vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
